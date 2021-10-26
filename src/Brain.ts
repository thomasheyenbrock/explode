import { RootFiber } from "./RootFiber";
import { Fiber } from "./types";

enum Priority {
  "high" = 1,
  "low" = 0
}

class WorkQueue {
  id: number;
  hasStartedWorking: boolean;
  fibersToWorkOn: Fiber[];
  priority: Priority;
  createdAt: number;

  constructor(id: number, priority: Priority) {
    this.id = id;
    this.hasStartedWorking = false;
    this.fibersToWorkOn = [];
    this.priority = priority;
    this.createdAt = Date.now();
  }
}

let numberOfBrainInstances = 0;

export class Brain {
  private roots: RootFiber[];
  private workQueueIdCounter: number;
  private workQueues: WorkQueue[];

  constructor() {
    // We only allow one instance of this class at any time, so throw
    // an error if there already exists one.
    if (numberOfBrainInstances > 0) {
      throw new Error(
        "Internal error: A second brain was tried to initialize."
      );
    } else {
      numberOfBrainInstances += 1;
    }

    this.roots = [];
    this.workQueueIdCounter = 0;
    this.workQueues = [];
  }

  createRootFiber(domNode: HTMLElement) {
    const root = new RootFiber(domNode);
    this.roots.push(root);
    return { root, index: this.roots.length - 1 };
  }

  scheduleWork(fiber: Fiber) {
    // Create a work queue:
    const newWorkQueue = new WorkQueue(this.workQueueIdCounter, Priority.low);
    this.workQueueIdCounter += 1;

    // Add the fiber with work to the queue:
    newWorkQueue.fibersToWorkOn.push(fiber);

    // Modify the list of WorkQueues and insert the new queue according to its
    // priority and its time of creation.
    this.workQueues = [
      // All queues that either have a higher priority or that have the same
      // priorty but were created earlier:
      ...this.workQueues.filter(
        queue =>
          queue.priority > newWorkQueue.priority ||
          (queue.priority === newWorkQueue.priority &&
            queue.createdAt < newWorkQueue.createdAt)
      ),
      // The new queue:
      newWorkQueue,
      // All queues that either have a lower priority or that have the same
      // priorty but were created later:
      ...this.workQueues.filter(
        queue =>
          queue.priority < newWorkQueue.priority ||
          (queue.priority === newWorkQueue.priority &&
            queue.createdAt > newWorkQueue.createdAt)
      )
    ];

    // There is work to do, so start doing it:
    this.performUnitOfWork();
  }

  performUnitOfWork() {
    console.log("do work");
  }
}
