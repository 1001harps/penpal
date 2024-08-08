import { Box, Button, Flex, Image, Link, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Index = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleStartClick = async () => {
    setLoading(true);

    const response = await fetch(`${API_BASE_URL}/api/room`);
    const data = await response.json();

    navigate(`/room/${data.id}`);

    setLoading(false);

    console.log(data);
  };

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
        {loading ? (
          <Box
            w="100%"
            textAlign="center"
            m="auto"
            display="block"
            color="white"
            className="blink"
          >
            <Text fontSize="80px">loading</Text>
          </Box>
        ) : (
          <Button
            w="100%"
            textAlign="center"
            m="auto"
            display="block"
            textDecor="underline"
            variant="link"
            color="white"
            onClick={handleStartClick}
          >
            <Text fontSize="80px">start</Text>
          </Button>
        )}
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
