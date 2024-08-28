#!/usr/bin/env node
const spawn = require('cross-spawn');
const templates = require('./templates.js');

const fs = require('fs');
const path = require('path');

const [, , packageName, author, _template, fullSetup] = process.argv;
console.log({process})

const template = _template ?? "typescript"

const replacementKeys = {
  "{package-name}": packageName,
  "{author}": author
}

const runCommand = (command, args) => {
  console.log(`Running: ${command} ${args.join(" ")}`);
  spawn.sync(command, args, { stdio: 'inherit' });
};

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

const setupProject = async (targetDir, packageName) => {
  const newPackageInfo = {
    name: packageName,
    version: '0.0.1',
    description: 'Your package description',
    author: author || 'Your Name',
  };

  const currentDir = process.cwd();
  const projectDir = path.resolve(currentDir, projectName);
  fs.mkdirSync(projectDir, { recursive: true });

  const templateDir = path.resolve(__dirname, 'templates', template);

  fs.cpSync(templateDir, projectDir, { recursive: true });


  fs.renameSync(
    path.join(projectDir, 'gitignore'),
    path.join(projectDir, '.gitignore')
  );

  process.chdir(projectDir);

  // Step 2: Replace `ts-package` with the new package name
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
  console.error('Usage: setup-project <target-directory> <package-name> <target-repository-url>');
  process.exit(1);
}

setupProject(targetDir, packageName)
  .then(() => console.log('Project setup complete'))
  .catch((err) => console.error('Error setting up project:', err));