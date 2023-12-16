import {
  Box,
  Text,
  Flex,
  HStack,
  Input,
  Spinner,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store";
import { createRoom, joinRoom } from "../store/roomSlice";

const TempNav = () => (
  <HStack justify="space-between" bg="blue" p="10px" h="64px"></HStack>
);

export const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [nameInputState, setNameInputState] = useState("");
  const [roomIdInputState, setRoomIDInputState] = useState("");

  const dispatch = useAppDispatch();

  const roomId = useAppSelector((state) => state.room.roomId);

  const onCreateRoomClick = () => {
    setIsLoading(true);

    dispatch(createRoom({ username: nameInputState }));

    setNameInputState("");
  };

  const onJoinRoomClick = () => {
    setIsLoading(true);

    dispatch(joinRoom({ username: nameInputState, roomId: roomIdInputState }));

    setNameInputState("");
    setRoomIDInputState("");
  };

  // TODO: figure out how to navigate inside listeners
  useEffect(() => {
    if (!roomId) return;

    navigate(`/room/${roomId}`);
  }, [roomId]);

  return (
    <Box as="main" h="100vh" w="100vw">
      <TempNav />

      <Flex w="100%" h="100%">
        {isLoading ? (
          <Spinner m="64px auto" />
        ) : (
          <Box p="32px" w="400px" h="min-content" m="64px auto">
            <Box mb="16px">
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

            <Box mb="16px">
              <Button onClick={onCreateRoomClick}>Create new room</Button>
            </Box>

            <Box>
              <label>
                room id
                <Input
                  value={roomIdInputState}
                  onChange={(e) => setRoomIDInputState(e.target.value)}
                ></Input>
              </label>

              <Button onClick={onJoinRoomClick}>Join existing room</Button>
            </Box>
          </Box>
        )}
      </Flex>
    </Box>
  );
};
