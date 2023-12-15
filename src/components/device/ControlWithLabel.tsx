import { Box, Spacer, Stack, Text } from "@chakra-ui/react";
import React from "react";
import { ReactNode } from "react";

export interface ControlWithLabelProps {
  label: string;
  children: ReactNode;
}

export const ControlWithLabel: React.FC<ControlWithLabelProps> = ({
  label,
  children,
}) => {
  return (
    <Stack alignItems="center" userSelect="none" spacing="0">
      {children}
      <Text color="grey" fontSize="sm">
        {label}
      </Text>
    </Stack>
  );
};
