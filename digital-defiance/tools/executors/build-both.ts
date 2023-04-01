import { createNodeExecutor, scheduleExecutor } from '@nrwl/workspace';
import { join } from 'path';

interface BuildBothExecutorSchema {
  outputPath: string;
  nodeProject: string;
  browserProject: string;
}

export default createNodeExecutor<BuildBothExecutorSchema>((options: BuildBothExecutorSchema, context: unknown) => {
  const nodeBuild = scheduleExecutor(options.nodeProject, {
    outputPath: options.outputPath,
  });
  const browserBuild = scheduleExecutor(options.browserProject, {
    outputPath: join(options.outputPath, 'browser'),
  });

  return Promise.all([nodeBuild, browserBuild]);
});
