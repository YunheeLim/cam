interface ButtonProps {
  children: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className }) => {
  return (
    <button
      className={`w-full h-11 flex justify-center items-center bg-primary text-white font-semibold rounded-lg ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
