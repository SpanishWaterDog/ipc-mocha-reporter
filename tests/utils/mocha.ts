import Mocha from "mocha";
import { Options } from "./../../src/types/options";
import { IpcMode } from "../../src/types/ipcMode";

export const initializeMocha = (
  ipcMode: IpcMode,
  ipcSocketId?: Options["ipcSocketId"],
  additionalSettings?: Options
) => {
  const mocha = new Mocha();
  mocha.reporter("./lib/main.js", {
    ipcMode,
    ipcSocketId,
    ...additionalSettings,
  });
  return mocha;
};
