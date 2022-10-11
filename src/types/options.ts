import ipc from "node-ipc";
import { IpcMode } from "./ipcMode";
export interface Options {
  ipcSocketId: string;
  ipcMode: IpcMode;
  sendAllData: boolean;

  nodeIpcConfig: typeof ipc.config;
}
