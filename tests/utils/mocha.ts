import Mocha from "mocha";
import { Options } from "./../../src/types/options";
import { IpcMode } from "../../src/types/ipcMode";

export const initializeMocha = (
  ipcMode: IpcMode,
  ipcSocketId?: Options["ipcSocketId"]
) => {
  const mocha = new Mocha();
  mocha.reporter("./lib/main.js", { ipcMode, ipcSocketId });
  return mocha;
};
