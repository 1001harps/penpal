import {
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  SliderMark,
} from "@chakra-ui/react";
import { Scheduler } from "./scheduler";
import { useInstance } from "./useInstance";
import { SamplePlayer, SoundBankOutput } from "./output";

const STEPS = 16;

const mapN = <T extends any>(n: number, cb: (index: number) => T) => {
  return new Array(n).fill(null).map((_, i) => cb(i));
};

const INITIAL_BPM = 120;

const offset = -6;

const notes = [60, 62, 63, 58, 65, 62].map((x) => x + offset);
const notes2 = [60, 63, 58, 65].map((x) => x + offset);

const SCALE = [0, 2, 4, 5, 7, 9, 11];

const StepSeq = ({
  state,
  toggleStep,
  currentStep,
}: {
  state: boolean[][];
  toggleStep: (channel: number, step: number) => void;
  currentStep: number;
}) => {
  return (
    <Box p="16px">
      {mapN(STEPS, (rowIndex) => (
        <HStack h="25px" key={`row-${rowIndex}`} mb="5px">
          <HStack w="100%">
            {mapN(8, (buttonIndex) => (
              <Button
                key={`row-${rowIndex}-button-${buttonIndex}`}
                size="xs"
                w="12.5%"
                onClick={() => toggleStep(buttonIndex, rowIndex)}
                background={
                  state[rowIndex][buttonIndex]
                    ? "blue"
                    : currentStep === rowIndex
                    ? "#eee"
                    : "lightgrey"
                }
              ></Button>
            ))}
          </HStack>
        </HStack>
      ))}
    </Box>
  );
};

const SliderSeq = ({
  state,
  counter,
  onStepChange,
  toggleStepActive,
}: {
  state: Step[];
  onStepChange: (i: number, value: number) => void;
  counter: number;
  toggleStepActive: (i: number) => void;
}) => {
  return (
    <Box w="93%" h="100%" m="16px">
      {state.map((step, i) => (
        <HStack h="25px" key={`row-${i}`} mb="4px">
          <Box
            onClick={() => toggleStepActive(i)}
            bg={counter === i ? "magenta" : step.active ? "blue" : "grey"}
            h="100%"
            w="10px"
          ></Box>

          <Slider
            // isDisabled={!stepControlOn[i]}
            aria-label="slider-ex-1"
            min={0}
            max={1}
            step={0.00001}
            value={step.value}
            w="100%"
            onChange={(x) => onStepChange(i, x)}
            colorScheme="blue"
          >
            <SliderTrack>{/* <SliderFilledTrack /> */}</SliderTrack>
            <SliderThumb boxSize={6}>
              <Box
                w="100%"
                h="100%"
                background={step.active ? "blue" : "grey"}
                borderRadius={"50%"}
              />
            </SliderThumb>
          </Slider>
        </HStack>
      ))}
    </Box>
  );
};

interface Step {
  active: boolean;
  value: number;
}

const randStep = (): Step => ({
  active: false,
  value: Math.random(),
});

const AudioApp = () => {
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
      <HStack justify="space-between" bg="blue" p="10px">
        <Button onClick={togglePlay} variant="outline" colorScheme="pink">
          {playing ? "pause" : "play"}
        </Button>

        <HStack>
          <Button onClick={() => setBPM(bpm - 1)}>-</Button>
          <Text>{bpm}</Text>
          <Button onClick={() => setBPM(bpm + 1)}>+</Button>
        </HStack>
      </HStack>

      {/* <HStack w="100%" p="8px 16px">
        {mapN(STEPS, (i) => (
          <Box
            key={`step-indicator-${i}`}
            h="8px"
            w={`${100 / STEPS}%`}
            bg={i === currentStep ? "blue" : "white"}
          ></Box>
        ))}
      </HStack> */}

      <HStack w="100%" p="16px" pb={0}>
        <Box onClick={() => setTab("drums")} p="5px" w="33.3%" bg="blue">
          drums
        </Box>
        <Box onClick={() => setTab("synth")} p="5px" w="33.3%" bg="hotpink">
          synth 1
        </Box>
        <Box onClick={() => setTab("synth")} p="5px" w="33.3%" bg="turquoise">
          synth 2
        </Box>
      </HStack>

      {tab === "drums" && (
        <StepSeq
          currentStep={currentStep}
          state={drumStepState}
          toggleStep={toggleDrumStep}
        />
      )}

      {tab === "synth" && (
        <SliderSeq
          counter={currentStep}
          toggleStepActive={(i) =>
            setSynthStepState((s) => {
              const next = [...s];
              next[i].active = !next[i].active;
              return next;
            })
          }
          onStepChange={(i, value) =>
            setSynthStepState((s) => {
              const next = [...s];
              next[i].value = value;
              next[i].active = true;
              return next;
            })
          }
          state={synthStepState}
        />
      )}
    </Box>
  );
};

function App() {
  const [loaded, setLoaded] = useState(false);

  if (!loaded) {
    return (
      <Box as="main">
        <Button w="100%" h="100vh" onClick={() => setLoaded(true)}>
          load
        </Button>
      </Box>
    );
  }

  return (
    <Box as="main">
      <AudioApp />
    </Box>
  );
}

export default App;
