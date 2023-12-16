import {
  AspectRatio,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Input,
  Spacer,
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
import { Nav } from "./components/app/Nav";
import { Rotary } from "./components/device/Rotary";
import { DrumSamplerUI } from "./components/device/DrumSamplerUI";
import { SynthUI } from "./components/device/SynthUI";
import { useParams } from "react-router-dom";

const mapN = <T extends any>(n: number, cb: (index: number) => T) => {
  return new Array(n).fill(null).map((_, i) => cb(i));
};

interface Step {
  active: boolean;
  value: number;
}
const STEPS = 16;

export const StepSeq = ({
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

export const SliderSeq = ({
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
