import { Options } from "./types/options";
import { IpcMode } from "./types/ipcMode";
import { PartialDeep } from "type-fest";
import ipc from "node-ipc";

export const getDefaultOptions = (options: PartialDeep<Options>): Options => {
  options.ipcSocketId ??= "ipc-reporter";
  options.ipcMode ??= IpcMode.CLIENT_NET;
  options.nodeIpcConfig = {
    ...ipc.config,
    silent: true,
    ...options.nodeIpcConfig,
  };

  return options as Options;
};
