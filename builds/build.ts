import fs from 'fs';
import path from 'path';
import { preflight, linkBuildFiles, getBuild, cleanBuildDir, performBuild, performTest, serve } from './build.functions';

const buildsDir = path.dirname(__filename);
if (!fs.existsSync(buildsDir)) {
    console.error(`Builds directory ${buildsDir} not found. Basic sanity check failed.`);
}

if (process.argv.length < 4 || process.argv.length % 2 === 1) {
    console.error(`Usage: node ${__filename} <build|test|serve|clean> {build-name} ...`);
    process.exit(1);
}

for (let i = 2; i < process.argv.length; i += 2) {
    const action = process.argv[i];
    const buildName = process.argv[i + 1];

    if (!['build', 'test', 'serve', 'clean'].includes(action)) {
        console.error(`Usage: node ${__filename} <build|test|serve|clean> {build-name} ...`);
        process.exit(1);
    }

    preflight(buildsDir, buildName);
    const build = getBuild(buildName);
    linkBuildFiles(build);

    console.log(`Performing action: ${action} for build: ${buildName}`);
    switch (action) {
        case 'build':
            performBuild(build);
            break;
        case 'test':
            performTest(build);
            break;
        case 'serve':
            serve(build);
            break;
        case 'clean':
            cleanBuildDir(build);
            break;
        default:
            console.error('Invalid action specified');
            process.exit(1);
    }
}
