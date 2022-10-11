import _ from "lodash";
import { Runner } from "mocha";
import { createQueue } from "./createQueue";
import { RunnerConstants } from "./types/runnerConstants";

export const configureRunnerOnlySuites = (
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
    .on(RunnerConstants.EVENT_SUITE_BEGIN, data => {
      const suites = _.flatten(
        data.suites.map((suite) =>
          suite.tests.reduce(
            (acc, { title, state }) => ({
              ...acc,
              [title]: state ?? "pending",
            }),
            {}
          )
        )
      );
      const singleTests = data.tests.map(({ title, state }) => ({
        [title]: state ?? "pending",
      }));

      queue.push({
        event: RunnerConstants.EVENT_SUITE_BEGIN,
        data: [...suites, ...singleTests],
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
    .on(RunnerConstants.EVENT_SUITE_END, (x) => {
      const suites = _.flatten(
        x.suites.map((suite) =>
          suite.tests.reduce(
            (acc, { title, state }) => ({ ...acc, [title]: state }),
            {}
          )
        )
      );
      const singleTests = x.tests.map(({ title, state }) => ({
        [title]: state,
      }));

      queue.push({
        event: RunnerConstants.EVENT_SUITE_END,
        data: [...suites, ...singleTests],
      });
    })
    .once(RunnerConstants.EVENT_RUN_END, () => {
      queue.push({
        event: RunnerConstants.EVENT_RUN_END,
        data: {},
      });
    });
