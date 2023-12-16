type SchedulerListener = (timestamp: number) => void;

export class Scheduler {
  audioContext: AudioContext;
  bpm = 120;

  listeners: SchedulerListener[] = [];

  lookaheadTimeMs = 50.0;
  scheduleAheadTime = 0.1;
  nextNoteTime = 0.0;

  worker: Worker;

  constructor(audioContext: AudioContext, initialBPM: number) {
    this.audioContext = audioContext;
    this.bpm = initialBPM;

    // TODO: this should dynamically generate its own worker
    this.worker = new Worker("/schedulerWorker.js");

    this.nextNoteTime = this.audioContext.currentTime;

    this.worker.onmessage = (e) => {
      if (e.data === "tick") {
        this.tick();
      }
    };
  }

  private tick() {
    while (
      this.nextNoteTime <
      this.audioContext.currentTime + this.scheduleAheadTime
    ) {
      this.listeners.forEach((l) => l(this.nextNoteTime));
      const secondsPerBeat = 60.0 / this.bpm;
      this.nextNoteTime += 0.25 * secondsPerBeat;
    }
  }

  start() {
    this.nextNoteTime = this.audioContext.currentTime;

    this.worker.postMessage({
      type: "start",
      lookaheadTimeMs: this.lookaheadTimeMs,
    });
  }

  stop() {
    this.worker.postMessage({
      type: "stop",
      lookaheadTimeMs: this.lookaheadTimeMs,
    });
  }

  setBPM(bpm: number) {
    this.bpm = bpm;
  }

  addEventListener(listener: SchedulerListener) {
    this.listeners.push(listener);
  }

  removeEventListener(listener: SchedulerListener) {
    this.listeners = this.listeners.filter((x) => x !== listener);
  }
}
