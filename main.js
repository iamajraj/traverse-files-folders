// iamajraj 🐥 aren't I?

const fs = require('fs');
const path = require('path');

class FileOrFolder {
  get FileName() {
    return (this.isFolder ? '◘ ' : '◍ ') + this.fileName;
  }

  constructor(fileName, filePath, fileType, isFolder = false) {
    this.filePath = filePath;
    this.fileName = fileName;
    this.fileType = fileType;
    this.isFolder = isFolder;
    this.files = [];
  }
}

class FsRouter {
  files = [];

  push(fileOrFolder) {
    this.files.push(fileOrFolder);
  }
  join(a, b) {
    return a + b;
  }
  traverseFolder(current, deep, folderDepth = 1) {
    if (current.isFolder) {
      let paddingStart =
        folderDepth === 1
          ? '' + Array.from({ length: deep }).fill('︱').join('')
          : '  ' + Array.from({ length: deep }).fill('︱').join('') + '↳';
      console.log(this.join(paddingStart, current.FileName));
      if (current.files && current.files.length > 0) {
        deep += 1;
        current.files.forEach((file) => {
          this.traverseFolder(file, deep, folderDepth + 1);
        });
      }
    } else {
      let paddingStart =
        '  ︱' +
        Array.from({ length: deep - 1 })
          .fill('︱')
          .join('') +
        '-';
      console.log(this.join(paddingStart, current.FileName));
    }
  }
  traverse() {
    this.files.forEach((f) => {
      if (f.isFolder) {
        this.traverseFolder(f, 0);
      } else {
        console.log(f.FileName);
      }
    });
  }
}

class FsSystem {
  #fileRouter;

  constructor() {
    this.#fileRouter = new FsRouter();
  }

  parseFileAndFolders(currentDir = __dirname, folder = null) {
    const contents = fs.readdirSync(currentDir, { withFileTypes: true });
    contents.forEach((file) => {
      const file_name = file.name;
      const filePath = path.join(currentDir, file_name);
      const new_file = new FileOrFolder(file_name, filePath);
      if (file.isDirectory()) {
        new_file.isFolder = true;
        this.parseFileAndFolders(path.join(currentDir, file_name), new_file);
        if (folder) {
          folder.files.push(new_file);
        } else {
          this.#fileRouter.push(new_file);
        }
      } else {
        if (folder) {
          folder.files.push(new_file);
        } else {
          new_file.fileType = String(file_name).split(
            file_name.lastIndexOf('.')
          );
          new_file.isFolder = false;
          this.#fileRouter.push(new_file);
        }
      }
    });
    return this;
  }
  traverse() {
    this.#fileRouter.traverse();
  }
}

const fsSystem = new FsSystem();
fsSystem.parseFileAndFolders().traverse();
