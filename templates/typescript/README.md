# {package-name}
A simple package template to create new TypeScript projects.

## Steps to create a new project

1. Clone this repository.
2. Do a global replace of the following string:
    - `{package-name}` -> `your-package-name`
3. Update the `package.json` file with your package information.
4. Run `pnpm install` to install the dependencies.
5. Run `git init` to initialize a new git repository.
6. Run `git add .` to stage all the files.
7. Run `git commit -m "Initial commit"` to commit the changes.
8. Run `git remote add origin <your-repository-url>` to add the remote repository.
9. Run `git push -u origin master` to push the changes to the remote repository.

## Scripts

- `pnpm build`: Build the project.
- `pnpm test`: Run the tests.
- `pnpm lint`: Run the linter.
- `pnpm format`: Format the code.