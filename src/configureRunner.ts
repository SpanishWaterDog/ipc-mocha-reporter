import { configureRunnerOnlySuites } from "./configureRunnerOnlySuites";
import { Runner } from "mocha";
import { configureRunnerSendAll } from "./configureRunnerSendAll";
import { createQueue } from "./createQueue";

export const configureRunner = (
  runner: Runner,
  queue: ReturnType<typeof createQueue>,
  sendAllData: boolean
) =>
  sendAllData
    ? configureRunnerSendAll(runner, queue)
    : configureRunnerOnlySuites(runner, queue);
