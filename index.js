import {
  Worker,
  isMainThread,
  markAsUntransferable,
  moveMessagePortToContext,
  parentPort,
  receiveMessageOnPort,
  resourceLimits,
  SHARE_ENV,
  threadId,
  workerData,
} from "worker_threads";
import * as vm from "vm";
import * as path from "path";
