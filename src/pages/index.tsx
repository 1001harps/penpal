import { Box, Flex, Image, Link, Stack, Text } from "@chakra-ui/react";

export const Index = () => {
  return (
    <Box as="main" h="100vh" w="100vw" bg="blue">
      <Flex p="16px" h="80%">
        <Image
          m="auto"
          w="90%"
          src="/logo.svg"
          filter="invert(42%) sepia(93%) saturate(1352%) hue-rotate(0deg) brightness(119%) contrast(119%)"
        />
      </Flex>

      <Stack p="16px" w="100%">
        <Link
          w="100%"
          textAlign="center"
          m="auto"
          display="block"
          textDecor="underline"
          href="/room"
        >
          <Text fontSize="80px">start</Text>
        </Link>
      </Stack>

      <Stack
        p="16px"
        w="100%"
        textAlign="center"
        m="auto"
        display="block"
        textDecor="underline"
      ></Stack>
    </Box>
  );
};
