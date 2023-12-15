import { useInstance } from "./useInstance";
import { Box, HStack, Stack } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { Scheduler } from "./scheduler";
import { SamplePlayer, SoundBankOutput } from "./output";
import { Nav } from "./components/app/Nav";
import { DrumSamplerUI } from "./components/device/DrumSamplerUI";
import { SynthUI } from "./components/device/SynthUI";
import { ChatUI } from "./components/device/ChatUI";
import { Step } from "./types";

const mapN = <T extends any>(n: number, cb: (index: number) => T) => {
  return new Array(n).fill(null).map((_, i) => cb(i));
};

const STEPS = 16;
const INITIAL_BPM = 120;

const offset = -6;

const notes = [60, 62, 63, 58, 65, 62].map((x) => x + offset);
const notes2 = [60, 63, 58, 65].map((x) => x + offset);

const SCALE = [0, 2, 4, 5, 7, 9, 11];

const randStep = (): Step => ({
  active: false,
  value: Math.random(),
});

export const AudioApp = () => {
  const ctx = useInstance(() => new AudioContext());
  const scheduler = useInstance(() => new Scheduler(ctx, INITIAL_BPM));
  const soundBank = useInstance(() => new SoundBankOutput());
  const samplePlayer = useInstance(() => new SamplePlayer());

  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBPMState] = useState(INITIAL_BPM);

  // synth
  const [octaveState, setOctaveState] = useState(0.5);
  const octaveStateRef = useRef(0.5);

  const [filterCutoffState, setFilterCutoffState] = useState(
    samplePlayer.filterCutoff
  );
  const [filterResState, setFilterResState] = useState(samplePlayer.filterRes);

  const setFilterCutoff = (value: number) => {
    samplePlayer.filterCutoff = value;
    setFilterCutoffState(value);
  };

  const setFilterRes = (value: number) => {
    samplePlayer.filterRes = value;
    setFilterResState(value);
  };

  const [attackState, setAttackState] = useState(samplePlayer.attack);
  const [releaseState, setReleaseState] = useState(samplePlayer.release);

  const setAttack = (value: number) => {
    samplePlayer.attack = value;
    setAttackState(value);
  };

  const setRelease = (value: number) => {
    samplePlayer.release = value;
    setReleaseState(value);
  };

  // hack cos of useEffect closure :(
  useEffect(() => {
    octaveStateRef.current = octaveState;
  }, [octaveState]);

  const [tab, setTab] = useState<"drums" | "synth">("drums");

  const [drumStepState, setDrumStepState] = useState(
    mapN(STEPS, () => mapN(8, () => false))
  );

  const [synthStepState, setSynthStepState] = useState<Step[]>(
    mapN(STEPS, randStep)
  );

  const toggleDrumStep = (channel: number, step: number) => {
    setDrumStepState((prev) => {
      const next = [...prev.map((x) => [...x])];
      next[step][channel] = !next[step][channel];
      return next;
    });
  };

  const toggleSynthStep = (step: number) => {
    setSynthStepState((prev) => {
      const next = [...prev];
      next[step].active = !next[step].active;
      return next;
    });
  };

  const updateSynthStepValue = (step: number, value: number) => {
    setSynthStepState((prev) => {
      const next = [...prev];
      next[step].value = value;
      next[step].active = true;
      return next;
    });
  };

  useEffect(() => {
    const onStep = (timestamp: number) => {
      setCurrentStep((s) => {
        const step = s === STEPS - 1 ? 0 : s + 1;

        setDrumStepState((state) => {
          state[step].forEach((x, channel) => {
            if (x) {
              soundBank.triggerNote(channel, 60, timestamp, 1);
            }
          });

          return state;
        });

        setSynthStepState((state) => {
          const note = state[step];
          if (note.active) {
            const octaveMin = 3;
            const octaveMax = 7;
            const octaveRange = octaveMax - octaveMin;
            const octave = Math.floor(
              octaveStateRef.current * octaveRange + octaveMin
            );
            const index = Math.floor(note.value * (SCALE.length - 1));
            const noteNumber = SCALE[index] + octave * 12;
            samplePlayer.triggerNote(noteNumber, timestamp, 0.8);
          }

          return state;
        });

        return step;
      });
    };

    (async () => {
      await soundBank.init({ context: ctx });
      await samplePlayer.init(ctx);

      scheduler.addEventListener(onStep);
    })();

    return () => scheduler.removeEventListener(onStep);
  }, []);

  const setBPM = (newBPM: number) => {
    setBPMState(newBPM);
    scheduler.setBPM(newBPM);
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
        bpm={bpm}
        setBPM={setBPM}
      />

      <Stack p="16px" alignItems="flex-start">
        <SynthUI
          samplePlayer={samplePlayer}
          synthStepState={synthStepState}
          toggleSynthStep={toggleSynthStep}
          updateSynthStepValue={updateSynthStepValue}
          currentStep={currentStep}
          octave={octaveState}
          setOctave={(value) => setOctaveState(value)}
          filterCutoff={filterCutoffState}
          setFilterCutoff={setFilterCutoff}
          filterRes={filterResState}
          setFilterRes={setFilterRes}
          attack={attackState}
          setAttack={setAttack}
          release={releaseState}
          setRelease={setRelease}
        />
        <DrumSamplerUI
          currentStep={currentStep}
          soundbank={soundBank}
          drumStepState={drumStepState}
          toggleDrumStep={toggleDrumStep}
        />
        <ChatUI />
      </Stack>
    </Box>
  );
};
