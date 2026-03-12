import { IMaskInput } from "react-imask";

interface InputMaskProps {
  value: string | undefined;
  onChange: (value: string) => void;
  mask: any;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  unmask?: boolean;
  className?: string;
}

export function InputMask({
  value,
  onChange,
  mask,
  placeholder,
  id,
  disabled,
  unmask = true,
  className,
}: InputMaskProps) {
  return (
    <IMaskInput
      mask={mask}
      value={value || ""}
      onAccept={(value: string) => onChange(value)}
      placeholder={placeholder}
      id={id}
      disabled={disabled}
      unmask={unmask}
      className={className}
    />
  );
}
