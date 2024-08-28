const TEMPLATES = {
  "typescript": {
    replacements: [
      {
        files: ["README.md", "package.json", "jest.config.ts", "tsconfig.json", "workflows/ci.yml"],
        key: "{package-name}"
      },
      {
        files: ["LICENSE", "package.json", "workflows/ci.yml"],
        key: "{author}"
      }
    ]
  }
  
}

module.exports = TEMPLATES