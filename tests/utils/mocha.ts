import Mocha from "mocha";
import { IpcMode } from "../../src/types/ipcMode";

export const initializeMocha = (ipcMode: IpcMode) => {
  const mocha = new Mocha();
  mocha.reporter("./lib/main.js", { ipcMode });
  return mocha;
};
