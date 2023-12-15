import { Box, Button, Flex, Spinner } from "@chakra-ui/react";
import { AudioApp } from "../AudioApp";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Room = () => {
  const [hasInteractedWithPage, setHasInteractedWithPage] = useState(
    (window.navigator as any).userActivation.hasBeenActive
  );
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const name = window.localStorage.getItem("penpal.user.name");
    const id = window.localStorage.getItem("penpal.user.id");

    if (!name) {
      navigate("/");
      return;
    }

    setIsLoading(false);
  }, []);

  // hack to be able to start AudioContext with no interaction
  if (!hasInteractedWithPage) {
    return (
      <Box as="main">
        <Button onClick={() => setHasInteractedWithPage(true)}>load</Button>
      </Box>
    );
  }

  return (
    <Box as="main">
      {isLoading ? (
        <Flex>
          <Spinner />
        </Flex>
      ) : (
        <AudioApp />
      )}
    </Box>
  );
};
