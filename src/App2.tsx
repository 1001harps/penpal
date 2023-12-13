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

const STEPS = 16;

const mapN = <T extends any>(n: number, cb: (index: number) => T) => {
  return new Array(n).fill(null).map((_, i) => cb(i));
};

const SliderSeq = ({
  counter,
  toggleStep,
  stepControlOn,
}: {
  counter: number;
  toggleStep: (i: number) => void;
  stepControlOn: boolean[];
}) => {
  return (
    <>
      {mapN(STEPS, (i) => (
        <HStack h="25px" key={`row-${i}`}>
          <Box
            onClick={() => toggleStep(i)}
            bg={counter === i ? "magenta" : stepControlOn[i] ? "blue" : "grey"}
            h="100%"
            w="10px"
          ></Box>

          <Slider
            // isDisabled={!stepControlOn[i]}
            aria-label="slider-ex-1"
            defaultValue={30}
            w="100%"
            colorScheme="blue"
          >
            <SliderTrack>{/* <SliderFilledTrack /> */}</SliderTrack>
            <SliderThumb boxSize={6}>
              <Box
                w="100%"
                h="100%"
                background={stepControlOn[i] ? "blue" : "grey"}
                borderRadius={"50%"}
              />
            </SliderThumb>
          </Slider>
        </HStack>
      ))}
    </>
  );
};

const buttonColours = [
  "#fa6ed4",
  "#db65c5",
  "#be5cb5",
  "#a252a4",
  "#874992",
  "#6e3f7f",
  "#57346c",
  "#412a58",
];

const StepSeq = ({
  counter,
  toggleStep,
  stepControlOn,
}: {
  counter: number;
  toggleStep: (i: number) => void;
  stepControlOn: boolean[];
}) => {
  const [buttonState, setButtonState] = useState(
    mapN(STEPS, () => mapN(8, () => false))
  );

  const toggleButton = (row: number, button: number) => {
    setButtonState((prev) => {
      const next = [...prev.map((x) => [...x])];
      next[row][button] = !next[row][button];
      return next;
    });
  };

  return (
    <>
      <HStack ml="16px" h="10px">
        {mapN(8, (i) => (
          <Box key={i} bg={buttonColours[i]} h="10px" w="12.5%"></Box>
        ))}
      </HStack>

      {mapN(STEPS, (rowIndex) => (
        <HStack h="25px" key={`row-${rowIndex}`}>
          <Box
            onClick={() => toggleStep(rowIndex)}
            bg={
              counter === rowIndex
                ? "magenta"
                : stepControlOn[rowIndex]
                ? "blue"
                : "grey"
            }
            h="100%"
            w="10px"
          ></Box>

          <HStack w="100%">
            {mapN(8, (buttonIndex) => (
              <Button
                key={`row-${rowIndex}-button-${buttonIndex}`}
                size="xs"
                w="12.5%"
                onClick={() => toggleButton(rowIndex, buttonIndex)}
                background={
                  buttonState[rowIndex][buttonIndex] ? "blue" : "lightgrey"
                }
              ></Button>
            ))}
          </HStack>
        </HStack>
      ))}
    </>
  );
};

function App() {
  const [stepControlOn, setStepControlOn] = useState(
    new Array(STEPS).fill(null).map((_) => false)
  );
  const [counter, setCounter] = useState(0);

  const toggleStep = (i: number) => {
    setStepControlOn((prev) => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((count) => (count === STEPS ? 0 : count + 1));
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <Grid
      templateColumns="1fr"
      templateRows="8vh 92vh"
      as="main"
      h="100vh"
      background="white"
    >
      <Flex w="100%" as="nav" background="blue">
        <Text my="auto" ml="25px">
          penpal
        </Text>
      </Flex>
      <Box h="92vh" p="10px" w="100%">
        <Stack w="100%" h="100%" overflow="scroll">
          <HStack>
            <Box bg="blue" h="10px" w="100%"></Box>
            <Box bg="turquoise" h="10px" w="100%"></Box>
            <Box bg="magenta" h="10px" w="100%"></Box>
          </HStack>

          <Box bg="magenta" h="180px" w="100%" mb="10px">
            <Grid
              h="100%"
              gap="5px"
              p="5px"
              templateColumns="repeat(4, 1fr)"
              templateRows="repeat(2,1fr)"
            >
              {mapN(8, (i) => (
                <Flex
                  key={i}
                  justify="space-between"
                  p="5px 10px"
                  // border="1px solid white"
                  background={buttonColours[i]}
                >
                  <Text>{i + 1}</Text>
                  <Text>+</Text>
                </Flex>
              ))}
            </Grid>
          </Box>
          <StepSeq
            counter={counter}
            stepControlOn={stepControlOn}
            toggleStep={toggleStep}
          />
        </Stack>
      </Box>
    </Grid>
  );
}

export default App;
