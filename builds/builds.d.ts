export interface BuildFile {
    [key: string]: string;
}
export interface Build {
    defaultPackage: string;
    buildCommand?: string;
    testCommand?: string;
    serveCommand?: string;
    basePath: string;
    dirs: string[];
    files: BuildFile[];
}
export interface Builds {
    [key: string]: Build;
}
