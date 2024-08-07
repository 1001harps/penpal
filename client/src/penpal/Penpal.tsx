import {
  SampleBankDevice,
  SampleBankParams,
  SamplePlayerDevice,
  SamplePlayerParams,
  Scheduler,
} from "@9h/lib";
import { useSyncedStateReducer } from "@9h/react-synced-state/hooks";
import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Nav } from "../components/app/Nav";
import { DrumSamplerUI } from "../components/device/DrumSamplerUI";
import { SynthUI } from "../components/device/SynthUI";
import { SharedState, initialState } from "./state";
import { useInstance } from "./useInstance";

const SCALE = [0, 2, 4, 5, 7, 9, 11];

interface Penpal {}

const samplePlayerFiles = [
  "synth",
  "synth2",
  "marimba",
  "bass",
  "piano",
  "epiano",
].map((x) => `/samples/${x}.wav`);

const drumMachineFiles = ["bd", "rs", "sd", "cp", "hh", "oh", "mt", "lt"].map(
  (x) => `/samples/drums/${x}.wav`
);

type SharedStateAction =
  | {
      type: "update_synth_param";
      payload: {
        param: keyof SamplePlayerParams;
        value: number;
      };
    }
  | {
      type: "update_drum_param";
      payload: {
        param: keyof SampleBankParams;
        value: number;
      };
    }
  | { type: "update_bpm"; payload: number }
  | { type: "toggle_synth_step"; payload: number }
  | { type: "toggle_drum_step"; payload: { step: number; channel: number } }
  | {
      type: "update_synth_step_value";
      payload: { step: number; value: number };
    };

const reducer = (state: SharedState, action: SharedStateAction) => {
  switch (action.type) {
    case "update_drum_param": {
      const drumMachineParams = { ...state.drumMachineParams };
      drumMachineParams[action.payload.param] = action.payload.value;

      return { ...state, drumMachineParams };
    }
    case "update_synth_param": {
      const samplePlayerParams = { ...state.samplePlayerParams };
      samplePlayerParams[action.payload.param] = action.payload.value;

      return { ...state, samplePlayerParams };
    }
    case "update_bpm": {
      return { ...state, bpm: action.payload };
    }

    case "toggle_synth_step": {
      const synthSteps = state.synthSteps;
      synthSteps[action.payload].active = !synthSteps[action.payload].active;
      return { ...state, synthSteps };
    }

    case "toggle_drum_step": {
      const drumMachineSteps = state.drumMachineSteps;
      drumMachineSteps[action.payload.channel][action.payload.step] =
        !drumMachineSteps[action.payload.channel][action.payload.step];
      return { ...state, drumMachineSteps };
    }

    case "update_synth_step_value": {
      const synthSteps = state.synthSteps;
      synthSteps[action.payload.step] = {
        active: true,
        value: action.payload.value,
      };
      return {
        ...state,
        synthSteps,
      };
    }
  }

  return state;
};

export const Penpal = (props: Penpal) => {
  const [sharedState, dispatch] = useSyncedStateReducer(
    {
      url: `ws://localhost:8080`,
      initialState: initialState,
      roomId: "test",
    },
    reducer
  );

  const ctx = useInstance(() => new AudioContext());
  const scheduler = useInstance(() => new Scheduler(ctx, 120));
  const drumMachineDevice = useInstance(
    () => new SampleBankDevice(drumMachineFiles)
  );
  const synthDevice = useInstance(
    () => new SamplePlayerDevice(samplePlayerFiles)
  );
  const [devicesInitialised, setDevicesInitialised] = useState(false);

  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!stateKey) return;

  //   navigate(`/room/${stateKey}`, { replace: true });
  // }, [stateKey]);

  // const state = useAppSelector((x) => x.room);
  // const dispatch = useAppDispatch();

  // local state
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const onSynthParamChange = (
    param: keyof SamplePlayerParams,
    value: number
  ) => {
    dispatch({
      type: "update_synth_param",
      payload: { param, value },
    });

    synthDevice.setParam(param, value);
  };

  const onDrumMachineParamChange = (
    param: keyof SampleBankParams,
    value: number
  ) => {
    dispatch({ type: "update_drum_param", payload: { param, value } });

    drumMachineDevice.setParam(param, value);
  };

  const toggleDrumStep = (channel: number, step: number) => {
    dispatch({ type: "toggle_drum_step", payload: { channel, step } });
  };

  const toggleSynthStep = (step: number) => {
    dispatch({ type: "toggle_synth_step", payload: step });
  };

  const updateSynthStepValue = (step: number, value: number) => {
    dispatch({
      type: "update_synth_step_value",
      payload: {
        step,
        value,
      },
    });
  };

  const onDrumMachinePadClick = (channel: number) => {
    drumMachineDevice.trigger(channel, 0);
  };

  const onStep = (timestamp: number) => {
    setCurrentStep((s) => {
      const step = s === 15 ? 0 : s + 1;

      sharedState.drumMachineSteps.forEach((steps, channel) => {
        if (steps[s]) {
          drumMachineDevice.trigger(channel, timestamp);
        }
      });

      const note = sharedState.synthSteps[step];
      if (note.active) {
        const octaveMin = 3;
        const octaveMax = 7;
        const octaveRange = octaveMax - octaveMin;

        const octave = Math.floor(
          sharedState.samplePlayerParams.octave * octaveRange + octaveMin
        );
        const index = Math.floor(note.value * (SCALE.length - 1));
        const noteNumber = SCALE[index] + octave * 12;
        synthDevice.trigger(noteNumber, timestamp);
      }

      return step;
    });
  };

  useEffect(() => {
    (async () => {
      await drumMachineDevice.init(ctx);
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
    sharedState.drumMachineSteps,
    sharedState.synthSteps,
    sharedState.samplePlayerParams.octave,
  ]);

  const setBPM = (value: number) => {
    dispatch({ type: "update_bpm", payload: value });

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
        bpm={sharedState.bpm}
        setBPM={setBPM}
      />

      <Stack p="16px" alignItems="flex-start">
        <SynthUI
          synthStepState={sharedState.synthSteps}
          toggleSynthStep={toggleSynthStep}
          updateSynthStepValue={updateSynthStepValue}
          currentStep={currentStep}
          params={sharedState.samplePlayerParams}
          onParamChange={onSynthParamChange}
        />
        <DrumSamplerUI
          device={drumMachineDevice}
          currentStep={currentStep}
          drumStepState={sharedState.drumMachineSteps}
          toggleDrumStep={toggleDrumStep}
          params={sharedState.drumMachineParams}
          onParamChange={onDrumMachineParamChange}
          onPadClick={onDrumMachinePadClick}
        />
      </Stack>
    </Box>
  );
};
