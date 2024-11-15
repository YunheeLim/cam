import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: string | React.ReactNode;
  onClick?: () => void;
  className?: string;
  props?: any;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  ...props
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full h-12 flex justify-center items-center bg-primary text-white font-semibold rounded-lg ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
