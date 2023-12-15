import { AspectRatio, Box, Button, Grid, HStack, Text } from "@chakra-ui/react";
import { Rotary } from "./Rotary";

const mapN = <T extends any>(n: number, cb: (index: number) => T) => {
  return new Array(n).fill(null).map((_, i) => cb(i));
};

export const DrumSamplerUI = () => {
  return (
    <Box w="420px" background="silver" p="16px">
      <HStack justify="space-between" align="baseline" mb="16px">
        <Text fontSize="lg" color="grey">
          sampler
        </Text>
        <HStack justify="flex-end" h="32px" spacing="16px">
          <Rotary value={0.5} onChange={() => {}} />
          <Rotary value={0.5} onChange={() => {}} />
          <Rotary value={0.5} onChange={() => {}} />
          <Rotary value={0.5} onChange={() => {}} />
        </HStack>
      </HStack>

      <Grid
        templateRows="repeat(2, auto)"
        templateColumns="repeat(4, auto)"
        gap="16px"
        mb="16px"
      >
        {mapN(8, (i) => (
          <AspectRatio ratio={1}>
            <Button key={`drum-pad-${i}`} bg="grey"></Button>
          </AspectRatio>
        ))}
      </Grid>

      <Grid
        w="100%"
        templateColumns="repeat(8,1fr)"
        templateRows="1fr"
        mb="8px"
      >
        {mapN(2, (i) => (
          <Button
            key={`drum-bank-selector-${i}`}
            w="12.5%"
            h="8px"
            bg="grey"
          ></Button>
        ))}
      </Grid>

      <Grid w="100%" templateColumns="repeat(8,1fr)" templateRows="1fr">
        {mapN(8, (i) => (
          <Button
            key={`drum-selector-${i}`}
            w="12.5%"
            h="16px"
            bg="grey"
          ></Button>
        ))}
      </Grid>
    </Box>
  );
};
