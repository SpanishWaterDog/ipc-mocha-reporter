import { createQueue } from "./createQueue";
import { Runner } from "mocha";
import _ from "lodash";
import { RunnerConstants } from "./types/runnerConstants";

export const configureRunner = (
  runner: Runner,
  queue: ReturnType<typeof createQueue>
) =>
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
