import Mocha from "mocha";
import IPC from "node-ipc";
import { IpcMode } from "../src/types/ipcMode";
import { RunnerConstants } from "../src/types/runnerConstants";
import { initializeMocha } from "./utils/mocha";
import * as assert from "assert";

describe("IPC mocha reporter - client mode", () => {
  let ipc;
  let id = new Date().toISOString();

  beforeEach(() => {
    ipc = new IPC.IPC();
    id = new Date().toISOString();
    ipc.config.silent = true;
    ipc.config.id = id;
  });

  afterEach(() => {
    ipc.disconnect(id);
    ipc.server.off("*", "*");
    ipc.server.stop();
  });

  it("connects to ipc on start", (done) => {
    const mocha = initializeMocha(IpcMode.CLIENT, id);
    let mochaRunner;
    ipc.serve(() => {
      ipc.server.on("connect", () => {
        mochaRunner.abort();
        done();
      });
    });
    ipc.server.start();

    mochaRunner = mocha.run();
  });

  it("receives message on start", (done) => {
    const mocha = initializeMocha(IpcMode.CLIENT, id);
    let mochaRunner;
    ipc.serve(() => {
      ipc.server.on(RunnerConstants.EVENT_RUN_BEGIN, () => {
        mochaRunner.abort();
        done();
      });
    });
    ipc.server.start();

    mochaRunner = mocha.run();
  });

  it("receives message on suite start", (done) => {
    const mocha = initializeMocha(IpcMode.CLIENT, id);
    const suite = new Mocha.Suite("Test Suite");
    let mochaRunner;
    suite.addTest(
      new Mocha.Test("mock test - failing", () => {
        return Promise.reject(new Error("Failing test."));
      })
    );
    suite.addTest(
      new Mocha.Test("mock test - passing", () => {
        return Promise.resolve(true);
      })
    );
    mocha.suite = suite;
    let passed = false;

    ipc.serve(() => {
      ipc.server.on(RunnerConstants.EVENT_SUITE_BEGIN, (data) => {
        assert.deepEqual(data, [
          { "mock test - failing": "pending" },
          { "mock test - passing": "pending" },
        ]);
        ipc.server.off("*", "*");
        mochaRunner.abort();
        ipc.server.stop();
        if (!passed) done();
        passed = true;
      });
    });
    ipc.server.start();

    mochaRunner = mocha.run();
  });

  it("receives message on test pass", (done) => {
    const mocha = initializeMocha(IpcMode.CLIENT, id);
    const suite = new Mocha.Suite("Test Suite");
    let mochaRunner;
    suite.addTest(
      new Mocha.Test("mock test", () => {
        return Promise.resolve(true);
      })
    );
    mocha.suite = suite;
    let passed = false;

    ipc.serve(() => {
      ipc.server.on(RunnerConstants.EVENT_TEST_PASS, (data) => {
        assert.deepEqual(data, { "mock test": "passed" });
        mochaRunner.abort();
        if (!passed) done();
        passed = true;
      });
    });
    ipc.server.start();

    mochaRunner = mocha.run();
  });

  it("receives message on test fail", (done) => {
    const mocha = initializeMocha(IpcMode.CLIENT, id);
    const suite = new Mocha.Suite("Test Suite");
    let mochaRunner;
    suite.addTest(
      new Mocha.Test("mock test", () => {
        return Promise.reject(new Error("Failing test."));
      })
    );
    mocha.suite = suite;
    let passed = false;

    ipc.serve(() => {
      ipc.server.on(RunnerConstants.EVENT_TEST_FAIL, (data) => {
        assert.deepEqual(data, { "mock test": "failed" });
        mochaRunner.abort();
        if (!passed) done();
        passed = true;
      });
    });
    ipc.server.start();

    mochaRunner = mocha.run();
  });

  it("receives message on suite end", (done) => {
    const mocha = initializeMocha(IpcMode.CLIENT, id);
    const suite = new Mocha.Suite("Test Suite");
    let mochaRunner;
    suite.addTest(
      new Mocha.Test("mock test - failing", () => {
        return Promise.reject(new Error("Failing test."));
      })
    );
    suite.addTest(
      new Mocha.Test("mock test - passing", () => {
        return Promise.resolve(true);
      })
    );
    mocha.suite = suite;
    let passed = false;

    ipc.serve(() => {
      ipc.server.on(RunnerConstants.EVENT_SUITE_END, (data) => {
        assert.deepEqual(data, [
          { "mock test - failing": "failed" },
          { "mock test - passing": "passed" },
        ]);
        mochaRunner.abort();
        if (!passed) done();
        passed = true;
      });
    });
    ipc.server.start();

    mochaRunner = mocha.run();
  });
});
