import { useInstance } from "./useInstance";
import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { Scheduler } from "./scheduler";
import {
  DrumMachineParams,
  SamplePlayer,
  SoundBankOutput,
  SynthParams,
  initialDrumMachineParams,
  initialSynthParams,
} from "./output";
import { Nav } from "./components/app/Nav";
import { DrumSamplerUI } from "./components/device/DrumSamplerUI";
import { SynthUI } from "./components/device/SynthUI";
import { ChatUI } from "./components/device/ChatUI";
import { Step, makeExhaustive } from "./types";

const mapN = <T extends any>(n: number, cb: (index: number) => T) => {
  return new Array(n).fill(null).map((_, i) => cb(i));
};

const STEPS = 16;
const INITIAL_BPM = 120;
const SCALE = [0, 2, 4, 5, 7, 9, 11];

const randStep = (): Step => ({
  active: false,
  value: Math.random(),
});

interface EngineState {
  bpm: number;
  synthParams: SynthParams;
  drumMachineParams: DrumMachineParams;
  synthSteps: Step[];
  drumMachineSteps: boolean[][];
}

const initialEngineState: EngineState = {
  bpm: INITIAL_BPM,
  synthParams: initialSynthParams,
  drumMachineParams: initialDrumMachineParams,
  synthSteps: mapN(STEPS, randStep),
  drumMachineSteps: mapN(STEPS, () => mapN(8, () => false)),
};

type EngineAction =
  | {
      type: "bpm_changed";
      value: number;
    }
  | {
      type: "synth_param_changed";
      param: keyof SynthParams;
      value: number;
    }
  | {
      type: "drum_machine_param_changed";
      param: keyof DrumMachineParams;
      value: number;
    }
  | {
      type: "drum_step_toggled";
      step: number;
      channel: number;
    }
  | {
      type: "synth_step_toggled";
      step: number;
    }
  | {
      type: "synth_step_value_changed";
      step: number;
      value: number;
    };

const engineReducer = (
  state: EngineState,
  action: EngineAction
): EngineState => {
  switch (action.type) {
    case "bpm_changed":
      return { ...state, bpm: action.value };
    case "synth_param_changed":
      return {
        ...state,
        synthParams: {
          ...state.synthParams,
          [action.param]: action.value,
        },
      };
    case "drum_machine_param_changed":
      return {
        ...state,
        drumMachineParams: {
          ...state.synthParams,
          [action.param]: action.value,
        },
      };
    case "drum_step_toggled": {
      const drumMachineSteps = [...state.drumMachineSteps.map((x) => [...x])];
      drumMachineSteps[action.step][action.channel] =
        !drumMachineSteps[action.step][action.channel];

      return {
        ...state,
        drumMachineSteps,
      };
    }
    case "synth_step_toggled": {
      const synthSteps = [...state.synthSteps];
      synthSteps[action.step].active = !synthSteps[action.step].active;

      return {
        ...state,
        synthSteps,
      };
    }
    case "synth_step_value_changed": {
      const synthSteps = [...state.synthSteps];

      synthSteps[action.step].value = action.value;
      synthSteps[action.step].active = true;

      return {
        ...state,
        synthSteps,
      };
    }
  }

  makeExhaustive(action);
};

export type EngineStateDispatch = React.Dispatch<EngineAction>;

export const AudioApp = () => {
  const ctx = useInstance(() => new AudioContext());
  const scheduler = useInstance(() => new Scheduler(ctx, INITIAL_BPM));
  const drumMachineDevice = useInstance(() => new SoundBankOutput());
  const synthDevice = useInstance(() => new SamplePlayer());
  const [devicesInitialised, setDevicesInitialised] = useState(false);

  const [state, dispatch] = useReducer(engineReducer, initialEngineState);

  // local state
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const onSynthParamChange = (param: keyof SynthParams, value: number) => {
    dispatch({ type: "synth_param_changed", param, value });
    synthDevice.setParam(param, value);
  };

  const onDrumMachineParamChange = (
    param: keyof DrumMachineParams,
    value: number
  ) => {
    dispatch({ type: "drum_machine_param_changed", param, value });
    drumMachineDevice.setParam(param, value);
  };

  const toggleDrumStep = (channel: number, step: number) => {
    dispatch({ type: "drum_step_toggled", channel, step });
  };

  const toggleSynthStep = (step: number) => {
    dispatch({ type: "synth_step_toggled", step });
  };

  const updateSynthStepValue = (step: number, value: number) => {
    dispatch({ type: "synth_step_value_changed", step, value });
  };

  const onDrumMachinePadClick = (channel: number) => {
    drumMachineDevice.triggerNote(channel, 60, 0, 1);
  };

  const onStep = (timestamp: number) => {
    setCurrentStep((s) => {
      const step = s === STEPS - 1 ? 0 : s + 1;

      state.drumMachineSteps[step].forEach((x, channel) => {
        if (x) {
          drumMachineDevice.triggerNote(channel, 60, timestamp, 1);
        }
      });

      const note = state.synthSteps[step];
      if (note.active) {
        const octaveMin = 3;
        const octaveMax = 7;
        const octaveRange = octaveMax - octaveMin;

        const octave = Math.floor(
          state.synthParams.octave * octaveRange + octaveMin
        );
        const index = Math.floor(note.value * (SCALE.length - 1));
        const noteNumber = SCALE[index] + octave * 12;
        synthDevice.triggerNote(noteNumber, timestamp, 0.8);
      }

      return step;
    });
  };

  useEffect(() => {
    (async () => {
      await drumMachineDevice.init({ context: ctx });
      await synthDevice.init(ctx);

      setDevicesInitialised(true);
    })();
  }, []);

  useEffect(() => {
    if (!devicesInitialised) return;

    scheduler.addEventListener(onStep);

    return () => scheduler.removeEventListener(onStep);
  }, [
    devicesInitialised,
    state.drumMachineSteps,
    state.synthSteps,
    state.synthParams.octave,
  ]);

  const setBPM = (value: number) => {
    dispatch({ type: "bpm_changed", value });
    scheduler.setBPM(value);
  };

  const togglePlay = () => {
    if (playing) {
      scheduler.stop();
      setPlaying(false);
      return;
    }

    scheduler.start();
    setPlaying(true);
  };

  return (
    <Box bg="white" h="100vh">
      <Nav
        playing={playing}
        togglePlay={togglePlay}
        bpm={state.bpm}
        setBPM={setBPM}
      />

      <Stack p="16px" alignItems="flex-start">
        <SynthUI
          synthStepState={state.synthSteps}
          toggleSynthStep={toggleSynthStep}
          updateSynthStepValue={updateSynthStepValue}
          currentStep={currentStep}
          params={state.synthParams}
          onParamChange={onSynthParamChange}
        />
        <DrumSamplerUI
          device={drumMachineDevice}
          currentStep={currentStep}
          drumStepState={state.drumMachineSteps}
          toggleDrumStep={toggleDrumStep}
          params={state.drumMachineParams}
          onParamChange={onDrumMachineParamChange}
          onPadClick={onDrumMachinePadClick}
        />
        <ChatUI />
      </Stack>
    </Box>
  );
};
