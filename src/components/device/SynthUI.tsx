import { Box, Button, Grid, HStack, Stack, Text } from "@chakra-ui/react";
import { Rotary } from "./Rotary";
import { useReducer, useState } from "react";
import { RotaryWithLabel } from "./RotaryWithLabel";
import { Slider } from "./Slider";
import { Step } from "../../types";
import { SamplePlayer } from "../../output";

const mapN = <T extends any>(n: number, cb: (index: number) => T) => {
  return new Array(n).fill(null).map((_, i) => cb(i));
};

interface SynthUIProps {
  samplePlayer: SamplePlayer;
  currentStep: number;
  synthStepState: Step[];
  toggleSynthStep: (step: number) => void;
  updateSynthStepValue: (step: number, value: number) => void;

  octave: number;
  setOctave: (value: number) => void;
  filterCutoff: number;
  setFilterCutoff: (value: number) => void;
  filterRes: number;
  setFilterRes: (value: number) => void;
  attack: number;
  setAttack: (value: number) => void;
  release: number;
  setRelease: (value: number) => void;
}

export const SynthUI = ({
  samplePlayer,
  currentStep,
  synthStepState,
  toggleSynthStep,
  updateSynthStepValue,
  octave,
  setOctave,
  filterCutoff,
  setFilterCutoff,
  filterRes,
  setFilterRes,
  attack,
  setAttack,
  release,
  setRelease,
}: SynthUIProps) => {
  const [testValue, onTestValueChange] = useReducer(
    (_: number, x: number) => x,
    0.5
  );

  const [oscValueState, setOscValueState] = useState(
    samplePlayer.currentSample
  );

  const handleOscValueChange = (value: number) => {
    samplePlayer.setCurrentSample(value);
    setOscValueState(value);
  };

  return (
    <Box w="420px" background="silver" p="16px">
      <HStack justify="space-between" align="baseline" mb="16px">
        <Text fontSize="lg" color="grey">
          synth
        </Text>
      </HStack>

      <HStack mb="16px">
        <RotaryWithLabel
          label="osc"
          value={oscValueState}
          onChange={handleOscValueChange}
        />
        <RotaryWithLabel label="octave" value={octave} onChange={setOctave} />

        <Box h="48px" w="2px" bg="grey"></Box>
        <RotaryWithLabel
          label="freq"
          value={filterCutoff}
          onChange={setFilterCutoff}
        />
        <RotaryWithLabel
          label="res"
          value={filterRes}
          onChange={setFilterRes}
        />

        <Box h="48px" w="2px" bg="grey"></Box>
        <RotaryWithLabel label="attack" value={attack} onChange={setAttack} />
        <RotaryWithLabel
          label="release"
          value={release}
          onChange={setRelease}
        />

        <Box h="48px" w="2px" bg="grey"></Box>

        <RotaryWithLabel
          label="drive"
          value={testValue}
          onChange={onTestValueChange}
        />
        <RotaryWithLabel
          label="vol"
          value={testValue}
          onChange={onTestValueChange}
        />
      </HStack>

      <HStack mb="16px">
        {mapN(16, (i) => (
          <Stack w="16px" align="center">
            <Slider
              height={48}
              value={synthStepState[i].value}
              deactivated={!synthStepState[i].active}
              onChange={(value) => updateSynthStepValue(i, value)}
            />
            <Button
              size="xs"
              w="4px"
              h="16px"
              bg={
                synthStepState[i].active
                  ? "#99c"
                  : currentStep === i
                  ? "lightgrey"
                  : "grey"
              }
              onClick={() => toggleSynthStep(i)}
            ></Button>
          </Stack>
        ))}
      </HStack>
    </Box>
  );
};
