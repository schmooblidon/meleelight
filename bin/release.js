const fs = require("fs-extra");
const path = require("path");
const execSync = require('child_process').execSync;

const dir = path.resolve(process.cwd());
const tmpDir = path.join(dir, ".tmp");

const fileMapping = {
  "README.md": "README.md",
  "LICENSE": "LICENSE",
  "dist/meleelight.css": "styles.css",
  "dist/js": "js",
  "dist/assets": "assets",
  "dist/sfx": "sfx",
  "dist/music": "music",
  "dist/assets": "assets",
};

function cmd(command, oneLine) {
  const output = execSync(command, {
    encoding: 'utf8',
  });

  if (oneLine) {
    return output.replace(/(\r\n|\n|\r)/gm,"");
  }
  else {
    return output;
  }
}

function printError(err, msg) {
  console.error(err);
  console.error("");
  console.error(`${msg} See error above for details.`);
}

function removeTmpDir() {
  try {
    fs.emptyDirSync(tmpDir);
    return fs.rmdirSync(tmpDir);
  }
  catch(err) {
    printError(err, "Unable to remove temporary directory!");
  }
}


// Make sure we're on master
/*const branch = cmd("git rev-parse --abbrev-ref HEAD", true);
if (branch !== "webpack") {
  console.error(`release must be run on the master branch, you're currently on '${branch}'!`);
  process.exit();
}*/

// Make the temp directory and copy everything over
console.log("Copying required assets to a temporary directory...")

try {
  fs.emptyDirSync(path.join(dir, ".tmp"));
}
catch(err) {
  printError(err, "Unable to make temporary directory!");
  removeTmpDir();
  process.exit();
}

let lastFile;
try {
  Object.keys(fileMapping).forEach((og) => {
    lastFile = og;
    fs.copySync(path.join(dir, og), path.join(tmpDir, fileMapping[og]));
  });
}
catch(err) {
  printError(err, `Unable to copy ${lastFile} to the temporary directory!`);
  removeTmpDir();
  process.exit();
}


// Checkout the download branch
try {
  console.log("Switching to the download branch...");
  cmd("git checkout download");
}
catch(err) {
  printError(err, "Unable to checkout branch 'download'!");
  removeTmpDir();
  process.exit();
}


// Copy the files out
try {
  console.log("Unpacking required assets from the temporary directory...");
  Object.keys(fileMapping).forEach((og) => {
    lastFile = fileMapping[og];
    fs.copySync(path.join(tmpDir, lastFile), path.join(dir, lastFile));
  });
}
catch(err) {
  printError(err, `Unable to copy ${lastFile} from temporary directory!`);
  removeTmpDir();
  process.exit();
}

// Clean up
console.log("Cleaning up temporary directory...");
removeTmpDir();

// Stage for committing
try {
  cmd("git add .");
}
catch(err) {}

console.log("All done! Just run 'git status' to make sure the changes are what you");
console.log("expected, then commit and push the changes to launch the release.");
