import { Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Button } from "../app/Button";

const userActivationEvents = [
  "keydown",
  "mousedown",
  "pointerdown",
  "pointerup",
  "touchend",
];

const testUserActivationEvent = (eventName: string, e: Event) => {
  if (!e.isTrusted) return false;
  if (!userActivationEvents.includes(eventName)) return false;

  if (eventName === "keydown" && (e as KeyboardEvent).key === "escape") {
    return false;
  }

  if (
    eventName === "pointerdown" &&
    (e as PointerEvent).pointerType !== "mouse"
  ) {
    return false;
  }

  if (
    eventName === "pointerup" &&
    (e as PointerEvent).pointerType === "mouse"
  ) {
    return false;
  }

  return true;
};

interface UserActivationLoaderProps {
  children?: React.ReactNode;
}

export const UserActivationLoader = ({
  children,
}: UserActivationLoaderProps) => {
  const [hasBeenActive, setHasBeenActive] = useState(
    !!window?.navigator.userActivation.hasBeenActive
  );

  useEffect(() => {
    if (hasBeenActive) return;

    const listeners = userActivationEvents.map((eventName) => ({
      name: eventName,
      listener: (e: Event) => {
        if (testUserActivationEvent(eventName, e)) setHasBeenActive(true);
      },
    }));

    listeners.forEach(({ name, listener }) =>
      document.addEventListener(name, listener)
    );

    return () => {
      listeners.forEach(({ name, listener }) =>
        document.removeEventListener(name, listener)
      );
    };
  }, [hasBeenActive]);

  const handleLoadClick = () => {
    setHasBeenActive(true);
  };

  if (!hasBeenActive) {
    return (
      <Flex w="100%" h="100%">
        <Button m="auto" color="orange" onClick={handleLoadClick}>
          load
        </Button>
      </Flex>
    );
  }

  return children;
};
