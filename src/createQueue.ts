import async from "async";
import ipc from "node-ipc";

export const createQueue = (id: string) => {
  const queue = async.queue<{ event: string; data: unknown }>(
    ({ event, data }, completed) => {
      try {
        ipc.of.test.emit(event, data);
      } catch (err) {
        // put it back in the queue if something bad happens.
        queue.unshift({ event, data });
      }

      completed();
    }
  );

  return queue;
};
