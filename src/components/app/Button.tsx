import { Button as ChakraButton, ButtonProps } from "@chakra-ui/react";

const baseProps: ButtonProps = {
  variant: "link",
  color: "white",
  textDecor: "underline",
  fontSize: "80px",
};

export const Button = (props: ButtonProps) => {
  return <ChakraButton {...baseProps} {...props} />;
};

export const ErrorButton = (props: ButtonProps) => {
  return <ChakraButton {...baseProps} color="red" {...props} />;
};
