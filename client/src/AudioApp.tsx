import { useInstance } from "./useInstance";
import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Scheduler } from "./scheduler";
import {
  DrumMachineParams,
  SamplePlayer,
  SoundBankOutput,
  SynthParams,
} from "./output";
import { Nav } from "./components/app/Nav";
import { DrumSamplerUI } from "./components/device/DrumSamplerUI";
import { SynthUI } from "./components/device/SynthUI";
import { ChatUI } from "./components/device/ChatUI";
import { useAppDispatch, useAppSelector } from "./store";
import {
  bpmChanged,
  drumMachineParamChanged,
  drumStepToggled,
  sendChat,
  synthParamChanged,
  synthStepToggled,
  synthStepValueChanged,
} from "./store/roomSlice";

const SCALE = [0, 2, 4, 5, 7, 9, 11];

export const AudioApp = () => {
  const ctx = useInstance(() => new AudioContext());
  const scheduler = useInstance(() => new Scheduler(ctx, 120));
  const drumMachineDevice = useInstance(() => new SoundBankOutput());
  const synthDevice = useInstance(() => new SamplePlayer());
  const [devicesInitialised, setDevicesInitialised] = useState(false);

  const state = useAppSelector((x) => x.room);
  const dispatch = useAppDispatch();

  // local state
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const onSynthParamChange = (param: keyof SynthParams, value: number) => {
    dispatch(synthParamChanged({ param, value }));
    synthDevice.setParam(param, value);
  };

  const onDrumMachineParamChange = (
    param: keyof DrumMachineParams,
    value: number
  ) => {
    dispatch(drumMachineParamChanged({ param, value }));
    drumMachineDevice.setParam(param, value);
  };

  const toggleDrumStep = (channel: number, step: number) => {
    dispatch(drumStepToggled({ channel, step }));
  };

  const toggleSynthStep = (step: number) => {
    dispatch(synthStepToggled({ step }));
  };

  const updateSynthStepValue = (step: number, value: number) => {
    dispatch(synthStepValueChanged({ step, value }));
  };

  const onDrumMachinePadClick = (channel: number) => {
    drumMachineDevice.triggerNote(channel, 60, 0, 1);
  };

  const onStep = (timestamp: number) => {
    setCurrentStep((s) => {
      const step = s === 15 ? 0 : s + 1;

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

  const onMessageSend = (message: string) => {
    dispatch(sendChat({ message }));
  };

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
    dispatch(bpmChanged(value));
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
        <ChatUI messages={state.messages} onSend={onMessageSend} />
      </Stack>
    </Box>
  );
};
