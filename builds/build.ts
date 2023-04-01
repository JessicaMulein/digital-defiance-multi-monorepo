import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { preflight, linkBuildFiles } from './build.functions';

const buildsDir = path.dirname(__filename);
if (!fs.existsSync(buildsDir)) {
    console.error(`Builds directory ${buildsDir} not found. Basic sanity check failed.`);
}
// check args
if (process.argv.length < 3) {
    console.error(`Usage: node ${__filename} <build|test|serve> {build-name}`);
    process.exit(1);
}
const action = process.argv[1];
if(!['build', 'test', 'serve'].includes(action)) {
    console.error(`Usage: node ${__filename} <build|test|serve> {build-name}`);
    process.exit(1);
}


preflight(scriptDir, buildName);
linkBuildFiles(buildsDir, buildsDataObject[buildName]);
switch(action) {
    case 'build':
        execSync(`cd ${buildsDir} && npx nx run ${buildName}:build`);
        break;
    case 'test':
        execSync(`cd ${buildsDir} && npx nx run ${buildName}:test`);
        break;
    case 'serve':
        execSync(`cd ${buildsDir} && npx nx serve ${buildName}`);
        break;
    default: