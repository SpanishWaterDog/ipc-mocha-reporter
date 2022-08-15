import async from "async";
import ipc from "node-ipc";
import { IpcMode } from "./types/ipcMode";

export const createQueue = (id: string, ipcMode: IpcMode) => {
  const queue = async.queue<{ event: string; data: unknown }>(
    ({ event, data }, completed) => {
      try {
        if ([IpcMode.CLIENT_NET, IpcMode.CLIENT].includes(ipcMode))
          ipc.of[id].emit(event, data);
        else ipc.server.broadcast(event, data);
      } catch (err) {
        // put it back in the queue if something bad happens.
        queue.unshift({ event, data });
      }

      completed();
    }
  );

  return queue;
};
