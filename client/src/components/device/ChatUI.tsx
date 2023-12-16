import {
  Box,
  Button,
  Grid,
  HStack,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";

import { EMOJIS } from "../../shared";
import { useRef, useState } from "react";

interface Message {
  user: string;
  message: string;
}

export const ChatUI = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleEmojiClick = (emoji: string) => {
    const user = window.localStorage.getItem("penpal.user.name") || "??";

    setMessages(() => [
      ...messages,
      {
        user,
        message: emoji,
      },
    ]);

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box w="420px" background="silver">
      <HStack
        justify="space-between"
        align="baseline"
        border="2px solid grey"
        bg="grey"
        p="8px"
        color="silver"
      >
        <Text fontSize="lg">Chatting with your best friend :)</Text>

        <Button fontSize="lg">X</Button>
      </HStack>

      <Box h="260px" overflow="scroll" p="0 16px" m="16px 0">
        <List>
          {messages.map(({ user, message }) => (
            <ListItem fontSize="4xl">
              {user}: {message}
            </ListItem>
          ))}
        </List>

        <Box ref={messagesEndRef} h="64px" />
      </Box>

      <Box bg="grey" p="16px">
        <Grid templateColumns="repeat(8, 1fr)" templateRows="1fr 1fr" gap="8px">
          {EMOJIS.map((x) => (
            <Button fontSize="3xl" onClick={() => handleEmojiClick(x)}>
              {x}
            </Button>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
