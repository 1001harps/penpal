import { Box, BoxProps } from "@chakra-ui/react";

interface BigLinkProps extends BoxProps {
  children: React.ReactNode;
}

export const BigLink = ({ children, ...props }: BigLinkProps) => {
  return (
    <Box
      w="100%"
      textAlign="center"
      m="auto"
      display="block"
      color="white"
      {...props}
    >
      {children}
    </Box>
  );
};
