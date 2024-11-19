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
      className={`hover:bg-primary-hover flex h-12 w-full items-center justify-center rounded-lg bg-primary font-semibold text-white ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
