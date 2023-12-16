import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import {
  SynthParams,
  DrumMachineParams,
  initialSynthParams,
  initialDrumMachineParams,
} from "../output";
import { Step } from "../types";

const mapN = <T extends any>(n: number, cb: (index: number) => T) => {
  return new Array(n).fill(null).map((_, i) => cb(i));
};

interface EngineState {
  bpm: number;
  synthParams: SynthParams;
  drumMachineParams: DrumMachineParams;
  synthSteps: Step[];
  drumMachineSteps: boolean[][];
}

const randStep = (): Step => ({
  active: false,
  value: Math.random(),
});

const initialState: EngineState = {
  bpm: 120,
  synthParams: { ...initialSynthParams },
  drumMachineParams: { ...initialDrumMachineParams },
  synthSteps: mapN(16, randStep),
  drumMachineSteps: mapN(16, () => mapN(8, () => false)),
};

export const counterSlice = createSlice({
  name: "room",
  initialState,
  reducers: {
    incrementBpm: (state) => {
      state.bpm += 1;
    },
    decrementBpm: (state) => {
      state.bpm -= 1;
    },
    bpmChanged: (state, action: PayloadAction<number>) => {
      state.bpm = action.payload;
    },
    synthParamChanged: (
      state,
      action: PayloadAction<{ param: keyof SynthParams; value: number }>
    ) => {
      state.synthParams[action.payload.param] = action.payload.value;
    },
    drumMachineParamChanged: (
      state,
      action: PayloadAction<{ param: keyof DrumMachineParams; value: number }>
    ) => {
      state.drumMachineParams[action.payload.param] = action.payload.value;
    },
    drumStepToggled: (
      state,
      action: PayloadAction<{ step: number; channel: number }>
    ) => {
      state.drumMachineSteps[action.payload.step][action.payload.channel] =
        !state.drumMachineSteps[action.payload.step][action.payload.channel];
    },
    synthStepToggled: (state, action: PayloadAction<{ step: number }>) => {
      state.synthSteps[action.payload.step].active =
        !state.synthSteps[action.payload.step].active;
    },
    synthStepValueChanged: (
      state,
      action: PayloadAction<{ step: number; value: number }>
    ) => {
      state.synthSteps[action.payload.step].value = action.payload.value;
      state.synthSteps[action.payload.step].active = true;
    },
  },
});

export const {
  incrementBpm,
  decrementBpm,
  bpmChanged,
  synthParamChanged,
  drumMachineParamChanged,
  drumStepToggled,
  synthStepToggled,
  synthStepValueChanged,
} = counterSlice.actions;

export default counterSlice.reducer;
