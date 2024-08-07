import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { RotaryWithLabel } from "./RotaryWithLabel";
import { Slider } from "./Slider";
import { SamplePlayerParams } from "@9h/lib";
import { Step } from "../../penpal/state";

const mapN = <T extends any>(n: number, cb: (index: number) => T) => {
  return new Array(n).fill(null).map((_, i) => cb(i));
};

interface SynthUIProps {
  currentStep: number;
  synthStepState: Step[];
  toggleSynthStep: (step: number) => void;
  updateSynthStepValue: (step: number, value: number) => void;
  params: SamplePlayerParams;
  onParamChange: (param: keyof SamplePlayerParams, value: number) => void;
}

export const SynthUI = ({
  currentStep,
  synthStepState,
  toggleSynthStep,
  updateSynthStepValue,
  params,
  onParamChange,
}: SynthUIProps) => {
  return (
    <Box w="420px" background="silver" p="16px">
      <HStack justify="space-between" align="baseline" mb="16px">
        <Text fontSize="lg" color="grey">
          synth
        </Text>
      </HStack>

      <HStack mb="16px">
        <RotaryWithLabel
          label="sample"
          value={params.sample}
          onChange={(value: number) => onParamChange("sample", value)}
        />
        <RotaryWithLabel
          label="octave"
          value={params.octave}
          onChange={(value: number) => onParamChange("octave", value)}
        />

        <Box h="48px" w="2px" bg="grey"></Box>
        <RotaryWithLabel
          label="freq"
          value={params.filterCutoff}
          onChange={(value: number) => onParamChange("filterCutoff", value)}
        />
        <RotaryWithLabel
          label="res"
          value={params.filterRes}
          onChange={(value: number) => onParamChange("filterRes", value)}
        />
        <RotaryWithLabel
          label="env"
          value={params.filterEnvMod}
          onChange={(value: number) => onParamChange("filterEnvMod", value)}
        />

        <Box h="48px" w="2px" bg="grey"></Box>
        <RotaryWithLabel
          label="attack"
          value={params.attack}
          onChange={(value: number) => onParamChange("attack", value)}
        />
        <RotaryWithLabel
          label="release"
          value={params.release}
          onChange={(value: number) => onParamChange("release", value)}
        />

        <Box h="48px" w="2px" bg="grey"></Box>

        <RotaryWithLabel
          label="vol"
          value={params.volume}
          onChange={(value) => onParamChange("volume", value)}
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
