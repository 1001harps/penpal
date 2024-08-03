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
import { createRoom, joinRoom } from "../store/thunk";

const TempNav = () => (
  <HStack justify="space-between" bg="blue" p="10px" h="64px"></HStack>
);

export const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const [nameInputState, setNameInputState] = useState("");
  const [roomIdInputState, setRoomIDInputState] = useState("");

  const dispatch = useAppDispatch();

  const roomId = useAppSelector((state) => state.room.local.roomId);

  const onCreateRoomClick = async () => {
    window.localStorage.setItem("penpal.user.name", nameInputState);

    setIsLoading(true);

    await dispatch(createRoom({ username: nameInputState }));

    setNameInputState("");
    // setIsLoading(false);
  };

  const onJoinRoomClick = async () => {
    window.localStorage.setItem("penpal.user.name", nameInputState);

    setIsLoading(true);

    await dispatch(
      joinRoom({ username: nameInputState, roomId: roomIdInputState })
    );

    setNameInputState("");
    setRoomIDInputState("");
    // setIsLoading(false);
  };

  useEffect(() => {
    console.log("room id effect");
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
