import { Options } from "./types/options";
import { IpcMode } from "./types/ipcMode";
import { PartialDeep } from "type-fest";
import ipc from "node-ipc";

export const getDefaultOptions = (options: PartialDeep<Options>): Options => {
  options.ipcSocketId ??= options.nodeIpcConfig?.id ?? ipc.config.id;
  options.ipcMode ??= IpcMode.CLIENT_NET;
  options.sendAllData ??= false;

  options.nodeIpcConfig = {
    ...ipc.config,
    silent: true,
    ...options.nodeIpcConfig,
    id: options.ipcSocketId,
  };

  return options as Options;
};
