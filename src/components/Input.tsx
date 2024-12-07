interface InputProps {
  placeholder?: string;
  type?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  props?: any;
}

const Input: React.FC<InputProps> = ({
  placeholder,
  type,
  defaultValue,
  onChange,
  onClick,
  className,
  disabled,
  icon,
  ...props
}) => {
  return (
    <div className={`relative w-full`}>
      <input
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        onChange={onChange}
        disabled={disabled}
        {...props}
        className={`h-12 w-full overflow-hidden rounded-lg bg-[#f2f2f7] px-4 py-3 placeholder-[#8f9099] focus:outline-none ${className}`}
      />
      {icon && (
        <div
          onClick={onClick}
          className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-full text-gray-500 hover:bg-gray-300"
        >
          {icon}
        </div>
      )}
    </div>
  );
};

export default Input;
