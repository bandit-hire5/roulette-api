export const getModuleIdentifier = (moduleName: string): symbol => Symbol.for(`module:${moduleName}`);
