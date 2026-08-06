/// <reference lib="webworker" />
import { handleWorkerMessage, type WorkerMessage } from "./nodeGraphLogic";

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const result = handleWorkerMessage(event.data);
  self.postMessage(result);
};

export {};
