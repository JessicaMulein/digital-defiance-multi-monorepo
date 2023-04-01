import fs, { readdir, readdirSync } from "fs";
import path from "path";
import { Build, Builds } from "./builds.d";

export function preflight(scriptDir: string, buildName: string) {
  try {
    // make a test symlink
    // get a random directory name within the build dir
    const dirName = Math.random().toString(36).substring(7);
    const testPath = path.join(scriptDir, "builds", buildName, dirName);
    fs.symlinkSync(scriptDir, testPath);

    // Check if the symlink was created
    if (!fs.lstatSync(testPath).isSymbolicLink()) {
      console.error(`ln -s ${scriptDir} ${testPath} failed`);
      process.exit(2);
    }

    // Remove the test symlink
    fs.unlinkSync(testPath);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

export function linkBuildFiles(build: Build) {
  for (const source in Object.keys(build)) {
    const fullSource = path.join(build.basePath, source);
    const fullDest = path.join(build.basePath, build[source]);

    if (!fs.existsSync(fullSource)) {
      console.error(`Source directory ${build.basePath} not found`);
      process.exit(1);
    }

    try {
      fs.symlinkSync(source, fullDest);
    } catch (error) {
      console.error(`ln -s ${source} ${fullDest} failed`);
      process.exit(2);
    }
  }

  // get the actual root
  const baseDir = path.dirname(path.dirname(__filename));
  if (!fs.existsSync(baseDir)) {
    console.error(`Base directory ${baseDir} not found. Basic sanity check failed.`);
  }
}

export function getBuild(buildName: string): Build {
    const buildDir = path.join(path.dirname(__filename), buildName);
    const buildsData = path.join(buildDir, 'builds.json');
    if (!fs.existsSync(buildsData)) {
        console.error(`Builds.json not found`);
        process.exit(2);
    }
    const buildsDataObject = JSON.parse(fs.readFileSync(buildsData, 'utf8')) as Builds;
    const buildNames = Object.keys(buildsDataObject);
    if (!buildNames.includes(buildName)) {
        console.error(`Build ${buildName} not found`);
        process.exit(2);
    }
    return buildsDataObject[buildName];
}

export function cleanDir(pathToClean: string) {
    if (!fs.existsSync(pathToClean)) {
        return false;
    }
    const stat = fs.lstatSync(pathToClean);
    if (!stat.isDirectory()) {
        fs.unlinkSync(pathToClean);
    } else {
        const files = fs.readdirSync(pathToClean);
        for (const file of files) {
            cleanDir(path.join(pathToClean, file));
        }
        fs.rmdirSync(pathToClean);
    }
}

export function cleanBuildDir(build: Build) {
    if (!build.dirs) {
        return;
    }
    for (const source of Object.keys(build.dirs)) {
        const fullDest = path.join(build.basePath, build.dirs[source]);
        if (fs.existsSync(fullDest) && fs.lstatSync(fullDest).isDirectory()) {
            cleanDir(fullDest);
        }
    }
}
