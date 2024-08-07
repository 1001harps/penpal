import { Step } from "./types";

import {
  SampleBankDevice,
  SampleBankParams,
  SamplePlayerDevice,
  SamplePlayerParams,
} from "@9h/lib";

const randStep = (): Step => ({
  active: false,
  value: Math.random(),
});

const mapN = <T extends any>(n: number, cb: (index: number) => T) => {
  return new Array(n).fill(null).map((_, i) => cb(i));
};

export interface SharedState {
  bpm: number;
  samplePlayerParams: SamplePlayerParams;
  drumMachineParams: SampleBankParams;
  synthSteps: Step[];
  drumMachineSteps: boolean[][];
}

export const initialState: SharedState = {
  bpm: 120,
  samplePlayerParams: { ...SamplePlayerDevice.defaultParams },
  drumMachineParams: { ...SampleBankDevice.defaultSampleBankParams },
  synthSteps: mapN(16, randStep),
  drumMachineSteps: mapN(8, () => mapN(16, () => false)),
};
