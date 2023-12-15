import { Box, Button, HStack, Stack, Text } from "@chakra-ui/react";
import { Rotary } from "./Rotary";
import { useReducer } from "react";
import { RotaryWithLabel } from "./RotaryWithLabel";
import { Slider } from "./Slider";

const mapN = <T extends any>(n: number, cb: (index: number) => T) => {
  return new Array(n).fill(null).map((_, i) => cb(i));
};

export const SynthUI = () => {
  const [testValue, onTestValueChange] = useReducer(
    (_: number, x: number) => x,
    0.5
  );

  return (
    <Box w="420px" background="silver" p="16px">
      <HStack justify="space-between" align="baseline" mb="16px">
        <Text fontSize="lg" color="grey">
          synth
        </Text>
        <HStack justify="flex-end" h="32px" spacing="16px">
          <Rotary value={testValue} onChange={onTestValueChange} />
          <Rotary value={testValue} onChange={onTestValueChange} />
        </HStack>
      </HStack>

      <HStack mb="16px">
        <RotaryWithLabel
          label="osc"
          value={testValue}
          onChange={onTestValueChange}
        />
        <RotaryWithLabel
          label="octave"
          value={testValue}
          onChange={onTestValueChange}
        />

        <Box h="48px" w="2px" bg="grey"></Box>
        <RotaryWithLabel
          label="freq"
          value={testValue}
          onChange={onTestValueChange}
        />
        <RotaryWithLabel
          label="res"
          value={testValue}
          onChange={onTestValueChange}
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
        <RotaryWithLabel
          label="wave"
          value={testValue}
          onChange={onTestValueChange}
        />
        <RotaryWithLabel
          label="freq"
          value={testValue}
          onChange={onTestValueChange}
        />
        <RotaryWithLabel
          label="osc"
          value={testValue}
          onChange={onTestValueChange}
        />
        <RotaryWithLabel
          label="vcf"
          value={testValue}
          onChange={onTestValueChange}
        />
        <RotaryWithLabel
          label="vca"
          value={testValue}
          onChange={onTestValueChange}
        />

        <Box h="48px" w="2px" bg="grey"></Box>

        <HStack mb="16px">
          {mapN(4, () => (
            <Slider
              height={48}
              value={testValue}
              onChange={onTestValueChange}
            />
          ))}
        </HStack>
        <Box h="48px" w="2px" bg="grey"></Box>
      </HStack>

      <HStack mb="16px">
        {mapN(16, () => (
          <Stack w="16px">
            <Slider
              height={48}
              value={testValue}
              onChange={onTestValueChange}
            />
            <Button size="xs" w="4px" h="4px" bg="grey"></Button>
          </Stack>
        ))}
      </HStack>
    </Box>
  );
};
