interface CheckboxItemProps {
  id: string;
  label: string;
  checked: boolean | undefined;
  onChange: () => void;
}

export function CheckboxItem({
  id,
  label,
  checked,
  onChange,
}: CheckboxItemProps) {
  return (
    <div
      className="checkbox-item"
      onClick={(e) => {
        e.preventDefault();
        onChange();
      }}
      style={{ cursor: 'pointer' }}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={() => onChange()}
        onClick={(e) => e.stopPropagation()}
      />
      <label htmlFor={id}>{label}</label>
    </div>
  );
}
