import InputMask from "react-input-mask";

interface MaskedInputProps {
  value: string | undefined;
  onChange: (value: string) => void;
  mask: string;
  placeholder?: string;
  id?: string;
  disabled?: boolean;
  className?: string;
}

export function MaskedInput({
  value,
  onChange,
  mask,
  placeholder,
  id,
  disabled,
  className,
}: MaskedInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <InputMask
      mask={mask}
      value={value || ""}
      onChange={handleChange}
      placeholder={placeholder}
      id={id}
      disabled={disabled}
      className={className}
      maskChar={null}
    />
  );
}
