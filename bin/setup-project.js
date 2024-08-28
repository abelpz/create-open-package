#!/usr/bin/env node
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const fs = require('fs');
const path = require('path');

function toSpliced(array, start, deleteCount, ...items) {
  // Ensure start is within bounds
  start = Math.max(start < 0 ? array.length + start : start, 0);
  // Ensure deleteCount is within bounds
  deleteCount = Math.max(Math.min(deleteCount, array.length - start), 0);

  // Create a new array
  const newArr = array.slice(0, start).concat(items, array.slice(start + deleteCount));
  return newArr;
}

const runCommand = (command, args) => {
  console.log(`Running: ${command} ${args ? args.join(" ") : ""}`);
  spawn.sync(command, args, { stdio: 'inherit' });
};

const argv = yargs(hideBin(toSpliced(process.argv,2,1))).argv
const packageName = process.argv[2]

const spawn = require('cross-spawn');
const templates = require('./templates.js');

const {author: _author, template: _template, fullSetup} = argv;

const author = _author ?? "{author}";

const template = _template ?? "typescript"

const replacementKeys = {
  "{package-name}": packageName,
  "{author}": author
}

const replaceInTemplate = (template) => {
  templates[template].replacements.forEach(({files,key}) => {
    files.forEach((filePath) => {
      replaceInFile(filePath, key, replacementKeys[key])
    })
  });
};

const replaceInFile = (filePath, searchValue, replaceValue) => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const updatedContent = fileContent.replace(new RegExp(searchValue, 'g'), replaceValue);
  fs.writeFileSync(filePath, updatedContent, 'utf8');
}

const updatePackageJson = (filePath, newInfo) => {
  const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const updatedPackageJson = { ...packageJson, ...newInfo };
  fs.writeFileSync(filePath, JSON.stringify(updatedPackageJson, null, 2), 'utf8');
};

const setupProject = async (packageName) => {
  const newPackageInfo = {
    name: packageName,
    version: '0.0.1',
    description: 'Your package description',
    author: author,
  };

  const currentDir = process.cwd();
  const projectDir = path.resolve(currentDir, packageName);
  fs.mkdirSync(projectDir, { recursive: true });

  const templateDir = path.resolve(__dirname, '../', 'templates', template);

  fs.cpSync(templateDir, projectDir, { recursive: true });

  fs.renameSync(
    path.join(projectDir, 'gitignore'),
    path.join(projectDir, '.gitignore')
  );

  process.chdir(projectDir);

  // Step 2: Replace `open-package` with the new package name
  replaceInTemplate(template)

  // Step 3: Update the `package.json` file with the new package information
  updatePackageJson('package.json', newPackageInfo);

  if (fullSetup) {
    // Step 4: Install the dependencies
    runCommand('pnpm',['install']);

    // Step 5: Initialize a new git repository
    runCommand('git', ['init']);

    // Step 6: Stage all the files
    runCommand('git', ['add','.']);

    // Step 7: Commit the changes
    runCommand('git',['commit', '-m', '"Initial commit"']);
  }

};

if (!packageName) {
  console.error('Usage: setup-project <package-name> <target-repository-url>');
  process.exit(1);
}

setupProject(packageName)
  .then(() => console.log('Project setup complete'))
  .catch((err) => console.error('Error setting up project:', err));