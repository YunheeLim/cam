interface InputProps {
  placeholder: string;
  defaultValue?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  props?: any;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  defaultValue,
  onChange,
  className,
  ...props
}) => {
  return (
    <input
      type="text"
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
      className={`h-12 w-full rounded-lg bg-[#f2f2f7] px-4 py-3 placeholder-[#8f9099] focus:outline-none ${className}`}
    />
  );
};

export default Input;
