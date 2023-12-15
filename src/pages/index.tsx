import { Box, Text, Flex, HStack, Input, Spinner } from "@chakra-ui/react";
import { useState } from "react";
import { nanoid } from "nanoid";
import { useNavigate } from "react-router-dom";

const TempNav = () => (
  <HStack justify="space-between" bg="blue" p="10px" h="64px"></HStack>
);

export const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [nameInputState, setNameInputState] = useState("");

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    setIsLoading(true);
    const userId = nanoid();
    const roomId = nanoid();

    window.localStorage.setItem("penpal.user.name", nameInputState);
    window.localStorage.setItem("penpal.user.id", userId);

    navigate(`/room/${roomId}`);

    setNameInputState("");
  };

  return (
    <Box as="main" h="100vh" w="100vw">
      <TempNav />

      <Flex w="100%" h="100%">
        {isLoading ? (
          <Spinner m="64px auto" />
        ) : (
          <Box
            as="form"
            onSubmit={handleSubmit}
            p="32px"
            w="400px"
            h="min-content"
            m="64px auto"
          >
            <Text fontSize="2xl" as="label">
              hi! what is your name?
            </Text>
            <Input
              autoFocus
              size="lg"
              value={nameInputState}
              onChange={(e) => setNameInputState(e.target.value)}
            ></Input>
          </Box>
        )}
      </Flex>
    </Box>
  );
};
