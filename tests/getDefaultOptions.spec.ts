import * as assert from "assert";
import ipc from "node-ipc";
import { IpcMode } from "../src/types/ipcMode";
import { getDefaultOptions } from "../src/getDefaultOptions";

describe("getDefaultOptions", () => {
  it("should return default config on empty parameters", () => {
    const options = {};
    const expectedResult = {
      ipcSocketId: "ipc-reporter",
      ipcMode: IpcMode.client,
      nodeIpcConfig: { ...ipc.config, silent: true },
    };

    assert.deepEqual(getDefaultOptions(options), expectedResult);
  });

  it("should not overwrite parameters", () => {
    const options = { ipcSocketId: "test-reporter" };
    const expectedResult = {
      ipcSocketId: "test-reporter",
      ipcMode: IpcMode.client,
      nodeIpcConfig: { ...ipc.config, silent: true },
    };

    assert.deepEqual(getDefaultOptions(options), expectedResult);
  });

  it("should update node-ipc parameters", () => {
    const options = { nodeIpcConfig: { id: "test" } };
    const expectedResult = {
      ipcSocketId: "ipc-reporter",
      ipcMode: IpcMode.client,
      nodeIpcConfig: { ...ipc.config, silent: true, id: "test" },
    };

    assert.deepEqual(getDefaultOptions(options), expectedResult);
  });
});
