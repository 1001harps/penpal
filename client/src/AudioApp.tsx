import { Box, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { AudioEngine } from "./audio";
import { Nav } from "./components/app/Nav";
import { DrumSamplerUI } from "./components/device/DrumSamplerUI";
import { SynthUI } from "./components/device/SynthUI";
import {
  DrumMachineParams,
  SamplePlayer,
  SoundBankOutput,
  SynthParams,
} from "./output";
import { Scheduler } from "@9h/lib";
import { useAppDispatch, useAppSelector } from "./store";
import { useInstance } from "./useInstance";
import { roomStateChanged } from "./store/thunk";

export const AudioApp = () => {
  const ctx = useInstance(() => new AudioContext());
  const engine = useInstance(() => new AudioEngine());
  const scheduler = useInstance(() => new Scheduler(ctx, 120));
  const [devicesInitialised, setDevicesInitialised] = useState(false);

  const sharedState = useAppSelector((x) => x.room.shared);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!engine) return;

    engine.addEventListener((event) => {
      if (event.type === "state_change") {
        dispatch(
          roomStateChanged({
            patch: event.patch,
            state: event.state,
          })
        );
      }
    });
  }, [engine]);

  // local state
  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);

  const onSynthParamChange = (param: keyof SynthParams, value: number) => {
    engine.updateSynthParam(param, value);
  };

  const onDrumMachineParamChange = (
    param: keyof DrumMachineParams,
    value: number
  ) => {
    engine.updateDrumMachineParam(param, value);
  };

  const toggleDrumStep = (channel: number, step: number) => {
    engine.toggleDrumStep(channel, step);
  };

  const toggleSynthStep = (step: number) => {
    engine.toggleSynthStep(step);
  };

  const updateSynthStepValue = (step: number, value: number) => {
    engine.updateSynthStepValue(step, value);
  };

  const onDrumMachinePadClick = (channel: number) => {
    engine.drumMachine.triggerNote(channel, 60, 0, 1);
  };

  const onStep = (timestamp: number) => {
    setCurrentStep((s) => {
      const step = s === 15 ? 0 : s + 1;

      engine.tick(step, timestamp);

      return step;
    });
  };

  useEffect(() => {
    (async () => {
      engine.init(ctx);
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
    sharedState.synthParams.octave,
  ]);

  const setBPM = (value: number) => {
    engine.updateBPM(value);
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
          params={sharedState.synthParams}
          onParamChange={onSynthParamChange}
        />
        <DrumSamplerUI
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
