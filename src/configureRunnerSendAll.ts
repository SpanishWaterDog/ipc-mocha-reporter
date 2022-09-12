import { Runner } from "mocha";
import { createQueue } from "./createQueue";
import { RunnerConstants } from "./types/runnerConstants";

export const configureRunnerSendAll = (
  runner: Runner,
  queue: ReturnType<typeof createQueue>
) => {
  Object.values(RunnerConstants).forEach((event) => {
    runner.on(event, (data) => {
      queue.push({
        event: event,
        data,
      });
    });
  });

  return runner;
};
