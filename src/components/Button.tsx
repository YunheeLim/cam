import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string;
  className?: string;
  props?: any;
}

const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`w-full h-11 flex justify-center items-center bg-primary text-white font-semibold rounded-lg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
