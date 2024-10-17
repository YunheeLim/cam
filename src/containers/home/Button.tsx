interface Meeting {
  children: string;
}

const Button: React.FC<Meeting> = ({ children }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="h-28 w-36 rounded-3xl bg-primary"></div>
      <div>{children}</div>
    </div>
  );
};

export default Button;
