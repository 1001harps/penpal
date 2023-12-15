import { useInstance } from "./useInstance";
import { Box, HStack, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Scheduler } from "./scheduler";
import { SamplePlayer, SoundBankOutput } from "./output";
import { Nav } from "./components/app/Nav";
import { DrumSamplerUI } from "./components/device/DrumSamplerUI";
import { SynthUI } from "./components/device/SynthUI";
import { ChatUI } from "./components/device/ChatUI";

const mapN = <T extends any>(n: number, cb: (index: number) => T) => {
  return new Array(n).fill(null).map((_, i) => cb(i));
};

const STEPS = 16;
const INITIAL_BPM = 120;

const offset = -6;

const notes = [60, 62, 63, 58, 65, 62].map((x) => x + offset);
const notes2 = [60, 63, 58, 65].map((x) => x + offset);

const SCALE = [0, 2, 4, 5, 7, 9, 11];
interface Step {
  active: boolean;
  value: number;
}

const randStep = (): Step => ({
  active: false,
  value: Math.random(),
});

export const AudioApp = () => {
  const ctx = useInstance(() => new AudioContext());
  const scheduler = useInstance(() => new Scheduler(ctx, INITIAL_BPM));
  const soundBank = useInstance(() => new SoundBankOutput());
  const samplePlayer = useInstance(() => new SamplePlayer());
  const samplePlayer2 = useInstance(() => new SamplePlayer());

  const [currentStep, setCurrentStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [bpm, setBPMState] = useState(INITIAL_BPM);

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

  useEffect(() => {
    (async () => {
      await soundBank.init({ context: ctx });
      await samplePlayer.init(ctx);
      await samplePlayer2.init(ctx);
      samplePlayer2.currentSample = 0;

      let bassNoteIndex = 0;

      scheduler.addEventListener((timestamp) => {
        setCurrentStep((s) => {
          const step = s === STEPS - 1 ? 0 : s + 1;

          // if (step === 0) {
          //   const synthNote = notes2[bassNoteIndex];
          //   samplePlayer2.triggerNote(synthNote - 12, timestamp, 0.5);
          //   bassNoteIndex++;
          //   if (bassNoteIndex === notes2.length) {
          //     bassNoteIndex = 0;
          //   }
          // }

          // if (step % 4 === 0) {
          //   soundBank.triggerNote(0, 60, timestamp, 1);
          // }

          // if (step % 3 === 0) {
          //   soundBank.triggerNote(1, 60, timestamp, 1);
          // }

          // if ((step + 2) % 4 === 0) {
          //   soundBank.triggerNote(2, 60, timestamp, 1);
          // }

          setDrumStepState((state) => {
            state[step].forEach((x, channel) => {
              if (x) {
                soundBank.triggerNote(channel, 60, timestamp, 1);
              }
            });

            return state;
          });

          // const synthNote = notes[step % notes.length];
          // samplePlayer.triggerNote(synthNote + 12, timestamp, 0.5);

          setSynthStepState((state) => {
            const note = state[step];
            if (note.active) {
              const octave = 5;
              const index = Math.floor(note.value * (SCALE.length - 1));
              const noteNumber = SCALE[index] + octave * 12;
              console.log({ noteNumber, index });
              samplePlayer.triggerNote(noteNumber, timestamp, 0.8);
            }

            return state;
          });

          return step;
        });
      });
    })();
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

      <HStack p="16px" alignItems="flex-start">
        <SynthUI />
        <DrumSamplerUI />
        <ChatUI />
      </HStack>
    </Box>
  );
};
