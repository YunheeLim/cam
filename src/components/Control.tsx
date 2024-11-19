import MoreIcon from '../../public/svgs/more.svg';

interface ControlProps {
  name: string;
  OnClick?: () => void;
  OnMoreClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const Control: React.FC<ControlProps> = props => {
  return (
    <button className={`${props.className} rounded-lg`}>
      <div className="flex h-12 w-[90px] overflow-hidden rounded-lg">
        <div
          onClick={props.OnClick}
          className="hover:bg-primary-hover flex flex-grow-[5.5] items-center justify-center bg-primary"
        >
          <div>{props.children}</div>
        </div>
        <div className="w-px bg-[#4645ab]"></div>
        <div
          onClick={props.OnMoreClick}
          className="hover:bg-primary-hover flex flex-grow-[4.5] items-center justify-center bg-primary"
        >
          <div>
            <MoreIcon />
          </div>
        </div>
      </div>
    </button>
  );
};

export default Control;
