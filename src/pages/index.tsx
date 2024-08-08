import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BigLink } from "../components/app/BigLink";
import { ErrorButton, Button } from "../components/app/Button";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Index = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleStartClick = async () => {
    setError(false);
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/room`);
      const data = await response.json();
      navigate(`/room/${data.id}`);
    } catch (error) {
      console.error(error);
      setError(true);
    }

    setLoading(false);
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
        {error ? (
          <BigLink onClick={handleStartClick}>
            <ErrorButton>retry?</ErrorButton>
          </BigLink>
        ) : loading ? (
          <BigLink>
            <Text fontSize="80px" fontWeight="600" className="blink">
              loading
            </Text>
          </BigLink>
        ) : (
          <BigLink onClick={handleStartClick}>
            <Button
              variant="link"
              color="white"
              textDecor="underline"
              fontSize="80px"
            >
              start
            </Button>
          </BigLink>
        )}
      </Stack>
    </Box>
  );
};
