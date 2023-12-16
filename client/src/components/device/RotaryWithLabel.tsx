import { ControlWithLabel, ControlWithLabelProps } from "./ControlWithLabel";
import { Rotary, RotaryProps } from "./Rotary";

interface RotaryWithLabelProps
  extends RotaryProps,
    Omit<ControlWithLabelProps, "children"> {}

export const RotaryWithLabel: React.FC<RotaryWithLabelProps> = ({
  label,
  ...props
}) => {
  return (
    <ControlWithLabel label={label}>
      <Rotary {...props} />
    </ControlWithLabel>
  );
};
