import { TopBar } from '@/components/TopBar';

const CommonLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className={`flex h-screen flex-col`}>
      <TopBar />
      <div className="flex h-full w-full">{children}</div>
    </div>
  );
};

export default CommonLayout;
