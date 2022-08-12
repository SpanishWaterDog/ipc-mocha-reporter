import { Options } from "./types/options";
import { IpcMode } from "./types/ipcMode";
import { PartialDeep } from "type-fest";
import ipc from "node-ipc";

export const getDefaultOptions = (options: PartialDeep<Options>): Options => {
  options.ipcSocketId ??= "ipc-reporter";
  options.ipcMode ??= IpcMode.client;
  options.nodeIpcConfig = { ...ipc.config, ...options.nodeIpcConfig };

  return options as Options;
};
