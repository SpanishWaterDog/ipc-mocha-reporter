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

    if (parsedOptions.ipcMode === IpcMode.client) {
      ipc.connectToNet(parsedOptions.ipcSocketId, () => {
        ipc.of[parsedOptions.ipcSocketId].on("connect", () => {
          queue.resume();
        });
        ipc.of[parsedOptions.ipcSocketId].on("error", (err) => {
          console.log(err);
          queue.pause();
        });
      });
    } else {
      ipc.serveNet();
      ipc.server.start();
    }

    configureRunner(runner, queue);
  }
}

// propably could be fixed in tsconfig
// but I could't find a way and it also works
module.exports = IpcReporter;
// export default IpcReporter;
