import { Runner } from "mocha";
import ipc from "node-ipc";
import { configureRunner } from "./configureRunner";
import { createQueue } from "./createQueue";
import { getDefaultOptions } from "./getDefaultOptions";
import { getReporterOptions } from "./getReporterOptions";
import { IpcMode } from "./types/ipcMode";
import { Options } from "./types/options";

class IpcReporter {
  constructor(
    runner: Runner,
    options?: {
      reporterOptions: Partial<Options>;
    }
  ) {
    const parsedOptions = getDefaultOptions(getReporterOptions(options));
    const queue = createQueue(parsedOptions.ipcSocketId, parsedOptions.ipcMode);
    ipc.config = parsedOptions.nodeIpcConfig;

    switch (parsedOptions.ipcMode) {
      case IpcMode.CLIENT:
        ipc.connectTo(parsedOptions.ipcSocketId, () => {
          ipc.of[parsedOptions.ipcSocketId].on("connect", () => {
            queue.resume();
          });
          ipc.of[parsedOptions.ipcSocketId].on("error", (err) => {
            console.log(err);
            queue.pause();
          });
          ipc.of[parsedOptions.ipcSocketId].on("kill", () => {
            ipc.disconnect(parsedOptions.ipcSocketId);
            process.exit();
          });
        });
        break;
      case IpcMode.CLIENT_NET:
        ipc.connectToNet(parsedOptions.ipcSocketId, () => {
          ipc.of[parsedOptions.ipcSocketId].on("connect", () => {
            queue.resume();
          });
          ipc.of[parsedOptions.ipcSocketId].on("error", (err) => {
            console.log(err);
            queue.pause();
          });
          ipc.of[parsedOptions.ipcSocketId].on("kill", () => {
            ipc.disconnect(parsedOptions.ipcSocketId);
            process.exit();
          });
        });
        break;
      case IpcMode.SERVER:
        ipc.serve(() => {
          ipc.server.on("kill", () => {
            ipc.server.stop();
            process.exit();
          });
        });
        ipc.server.start();
        break;
      case IpcMode.SERVER_NET:
        ipc.serveNet(() => {
          ipc.server.on("kill", () => {
            ipc.server.stop();
            process.exit();
          });
        });
        ipc.server.start();
        break;
      default:
        throw new Error("ipc mode not specified");
    }

    configureRunner(runner, queue, parsedOptions.sendAllData);
  }
}

// propably could be fixed in tsconfig
// but I could't find a way and it also works
module.exports = IpcReporter;
// export default IpcReporter;
