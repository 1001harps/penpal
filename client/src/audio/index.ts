import {
  DrumMachineParams,
  initialDrumMachineParams,
  initialSynthParams,
  SamplePlayer,
  SoundBankOutput,
  SynthParams,
} from "../output";
import { Message } from "../store/roomSlice";
import { Step } from "../types";
import { EventListener } from "../room/events";
import * as jsondiffpatch from "jsondiffpatch";
import { AudioEngineEvent } from "./event";

const clone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj));

const SCALE = [0, 2, 4, 5, 7, 9, 11];

const randStep = (): Step => ({
  active: Math.random() > 0.5,
  value: Math.random(),
});

const mapN = <T extends any>(n: number, cb: (index: number) => T) => {
  return new Array(n).fill(null).map((_, i) => cb(i));
};

export const defaultSharedState = {
  bpm: 120,
  synthParams: { ...initialSynthParams },
  drumMachineParams: { ...initialDrumMachineParams },
  synthSteps: mapN(16, randStep),
  drumMachineSteps: mapN(16, () => mapN(8, () => Math.random() > 0.8)),
};

export interface AudioEngineState {
  bpm: number;
  synthParams: SynthParams;
  drumMachineParams: DrumMachineParams;
  synthSteps: Step[];
  drumMachineSteps: boolean[][];
}

export type AudioEngineEvent = {
  type: "state_change";
  patch: string;
  state: AudioEngineState;
};

export class AudioEngine extends EventListener<AudioEngineEvent> {
  state: AudioEngineState = defaultSharedState;

  // devices
  drumMachine = new SoundBankOutput();
  synth = new SamplePlayer();

  async init(context: AudioContext) {
    await this.drumMachine.init({ context });
    await this.synth.init(context);

    AudioEngineEvent.on("state-change", (state: AudioEngineState) => {
      console.log("** state-change **");
      this.state = state;
    });
  }

  tick(step: number, timestamp: number) {
    this.state.drumMachineSteps[step].forEach((x, channel) => {
      if (x) {
        this.drumMachine.triggerNote(channel, 60, timestamp, 1);
      }
    });

    const note = this.state.synthSteps[step];
    if (note.active) {
      const octaveMin = 3;
      const octaveMax = 7;
      const octaveRange = octaveMax - octaveMin;

      const octave = Math.floor(
        this.state.synthParams.octave * octaveRange + octaveMin
      );
      const index = Math.floor(note.value * (SCALE.length - 1));
      const noteNumber = SCALE[index] + octave * 12;
      this.synth.trigger(noteNumber, timestamp);
    }
  }

  private updateState(callback: (state: AudioEngineState) => AudioEngineState) {
    const prevState = clone(this.state);

    const nextState = callback(prevState);

    const diff = jsondiffpatch.diff(prevState, nextState);

    this.notify({
      type: "state_change",
      patch: JSON.stringify(diff),
      state: nextState,
    });

    this.state = prevState;
  }

  toggleDrumStep(channel: number, step: number) {
    this.updateState((state) => {
      this.state.drumMachineSteps[step][channel] =
        !this.state.drumMachineSteps[step][channel];

      return state;
    });
  }

  updateDrumMachineParam(param: keyof DrumMachineParams, value: number) {
    this.updateState((state) => {
      state.drumMachineParams[param] = value;
      return state;
    });
  }

  updateSynthParam(param: keyof SynthParams, value: number) {
    this.updateState((state) => {
      state.synthParams[param] = value;
      return state;
    });
  }

  updateSynthStepValue(step: number, value: number) {
    this.updateState((state) => {
      state.synthSteps[step].value = value;
      state.synthSteps[step].active = true;
      return state;
    });
  }

  toggleSynthStep(step: number) {
    this.updateState((state) => {
      state.synthSteps[step].active = !state.synthSteps[step].active;
      return state;
    });
  }

  updateBPM(bpm: number) {
    this.updateState((state) => {
      state.bpm = bpm;
      return state;
    });
  }
}
