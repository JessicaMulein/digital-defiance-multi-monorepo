import { ExecutorContext } from '@nrwl/devkit';

export interface BuildBothExecutorSchema {
  nodeProject: string;
  browserProject: string;
  outputPath: string;
}

export interface NormalizedBuilderOptions extends BuildBothExecutorSchema {
  nodeProjectRoot: string;
  browserProjectRoot: string;
  outputPath: string;
}

export interface BuildBothOutput {
  success: boolean;
}

export interface BuildBothProcessOutput {
  stdout: string;
  stderr: string;
}

export type BuildBothProcessOutputTuple = [
  BuildBothProcessOutput,
  BuildBothProcessOutput
];

export interface BuildBothProcess {
  nodeProcess: Promise<BuildBothProcessOutput>;
  browserProcess: Promise<BuildBothProcessOutput>;
}

export type BuildBothExecutor = (
  schema: NormalizedBuilderOptions,
  context: ExecutorContext
) => Promise<BuildBothOutput>;
