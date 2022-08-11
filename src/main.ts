import _ from "lodash";
import { Runner } from "mocha";
import ipc from "node-ipc";
import { createQueue } from "./createQueue";
import { getDefaultOptions } from "./getDefaultOptions";
import { getReporterOptions } from "./getReporterOptions";
import { Options } from "./types/options";
import { RunnerConstants } from "./types/runnerConstants";

const ipcReporter = (
  runner: Runner,
  options?: {
    reporterOptions: Partial<Options>;
  }
) => {
  const parsedOptions = getDefaultOptions(getReporterOptions(options));

  const queue = createQueue(parsedOptions.ipcSocketId);

  ipc.config.id = parsedOptions.ipcId;
  ipc.config.silent = parsedOptions.ipcSilent;

  ipc.connectToNet(parsedOptions.ipcSocketId, () => {
    ipc.of[parsedOptions.ipcSocketId].on("connect", () => {
      queue.resume();
    });
    ipc.of[parsedOptions.ipcSocketId].on("error", (err) => {
      queue.pause();
    });
  });

  runner
    .once(RunnerConstants.EVENT_RUN_BEGIN, () => {
      queue.push({
        event: RunnerConstants.EVENT_RUN_BEGIN,
        data: {},
      });
    })
    .on(RunnerConstants.EVENT_SUITE_BEGIN, (x) => {
      const data = _.flatten(
        x.suites.map((suite) =>
          suite.tests.reduce(
            (acc, { title }) => ({ ...acc, [title]: "pending" }),
            {}
          )
        )
      );

      queue.push({
        event: RunnerConstants.EVENT_SUITE_BEGIN,
        data,
      });
    })
    .on(RunnerConstants.EVENT_SUITE_END, () => {
      queue.push({
        event: RunnerConstants.EVENT_SUITE_END,
        data: {},
      });
    })
    .on(RunnerConstants.EVENT_TEST_PASS, ({ title, state }) => {
      queue.push({
        event: RunnerConstants.EVENT_TEST_PASS,
        data: { [title]: state },
      });
    })
    .on(RunnerConstants.EVENT_TEST_FAIL, ({ title, state }) => {
      queue.push({
        event: RunnerConstants.EVENT_TEST_FAIL,
        data: { [title]: state },
      });
    })
    .once(RunnerConstants.EVENT_RUN_END, () => {
      queue.push({
        event: RunnerConstants.EVENT_RUN_END,
        data: {},
      });
    });
};

export default ipcReporter;
