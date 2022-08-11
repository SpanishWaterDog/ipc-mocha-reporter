import { Options } from "./types/options";

export const getDefaultOptions = (options: Partial<Options>): Options => {
  options.ipcId ??= "ipc-reporter";
  options.ipcSilent ??= true;
  options.ipcSocketId ??= "ipc-reporter";

  return options as Options;
};
