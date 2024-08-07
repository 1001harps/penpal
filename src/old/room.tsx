import { Box, Button, Flex, Image, List, Stack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { Penpal } from "../penpal/Penpal";
import { AppContext } from "./AppContext";

export const Room = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const { engine } = useContext(AppContext);

  const togglePlaying = () => {
    engine.value.scheduler.togglePlaying();
    console.log(engine.value.scheduler);
    setIsPlaying(engine.value.scheduler.playing);
  };

  return (
    <Stack as="main" h="100vh" w="100vw" bg="white" gap="0">
      <Flex as="header" p="24px" bg="blue" align="center">
        <Box>
          {isPlaying ? (
            <Button onClick={togglePlaying} variant="ghost">
              <Image
                ml="auto"
                w="20px"
                src="/pause-icon.svg"
                filter="invert(100%)"
              />
            </Button>
          ) : (
            <Button onClick={togglePlaying} variant="ghost">
              <Image
                ml="auto"
                w="20px"
                src="/play-icon.svg"
                filter="invert(100%)"
              />
            </Button>
          )}
          <Button color="white" variant="ghost">
            120
          </Button>
        </Box>
        <Image
          ml="auto"
          w="140px"
          src="/logo.svg"
          filter="invert(42%) sepia(93%) saturate(1352%) hue-rotate(0deg) brightness(119%) contrast(119%)"
        />
      </Flex>

      {/* <Grid
        templateColumns={{
          base: "repeat(1,1fr)",
          lg: "repeat(3,1fr)",
        }}
        gap="16px"
        templateRows={{ base: "repeat(3,1fr)" }}
        h="100%"
        p="16px"
      >
        <Box
          gridColumn={{ base: "1/2" }}
          gridRow={{ base: "1/2" }}
          bg="red"
          w="100%"
          h="300px"
          mr="20px"
        ></Box>
        <Box
          gridColumn={{ base: "1/2", lg: "2/3" }}
          gridRow={{ base: "2/3", lg: "1/2" }}
          bg="orange"
          w="100%"
          h="300px"
        ></Box>
        <Box
          gridColumn={{ base: "1/2", md: "3/4" }}
          gridRow={{ base: "3/4", md: "1/2" }}
          bg="lightblue"
          w="100%"
          h="300px"
        ></Box>
      </Grid> */}

      <Penpal />

      <Box
        position="fixed"
        bottom={0}
        left={0}
        bg="black"
        h="10vh"
        w="100vw"
        p="16px"
      >
        <List display="flex" gap="10px">
          <li>
            <Button variant="ghost">👍</Button>
          </li>
          <li>
            <Button variant="ghost">❤️</Button>
          </li>
          <li>
            <Button variant="ghost">😂</Button>
          </li>
          <li>
            <Button variant="ghost">🔥</Button>
          </li>
          <li>
            <Button variant="ghost">😮‍💨</Button>
          </li>
        </List>
      </Box>
    </Stack>
  );
};
