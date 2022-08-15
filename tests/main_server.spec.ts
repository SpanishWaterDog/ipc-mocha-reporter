import IPC from "node-ipc";
import { IpcMode } from "../src/types/ipcMode";
import { initializeMocha } from "./utils/mocha";

describe("IPC mocha reporter - server mode", () => {
  let ipc;
  let id = new Date().toISOString();
  let mocha = initializeMocha(IpcMode.client, id);
  let mochaRunner;

  beforeEach(() => {
    ipc = new IPC.IPC();
    id = new Date().toISOString();
    ipc.config.silent = true;
    ipc.config.id = id;
    mocha = initializeMocha(IpcMode.server, id);
  });

  afterEach(() => {
    ipc.of[id].emit("kill", {});
    ipc.of[id].off("*", "*");
    ipc.disconnect(id);
    mochaRunner?.abort();
  });

  it("creates server", (done) => {
    ipc.connectToNet(id, () => {
      ipc.of[id].on("connect", () => {
        done();
      });
    });

    mochaRunner = mocha.run();
  });
});
