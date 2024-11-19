// import Icon from '../../../public/svgs/icon';
import ToggleButton from './Toggle';
import ScreenIcon from '../../../public/svgs/screen.svg';
import KeyboardIcon from '../../../public/svgs/keyboard.svg';

interface Accessibility {
  isToggled: boolean;
  onClick: () => void;
  children: string;
}

const Accessibility: React.FC<Accessibility> = ({
  isToggled,
  onClick,
  children,
}) => {
  return (
    <div className="mb-6 flex w-full flex-row justify-between px-1">
      <div className="flex">
        {children === '스크린 리더' ? <ScreenIcon /> : <KeyboardIcon />}
        {/* <Icon
          id={`${children === '스크린 리더' ? 'screen' : 'keyboard'}`}
          className="h-8 w-8"
        /> */}
        <div className="px-2 text-xl font-semibold">{children}</div>
      </div>
      <div>
        <ToggleButton isToggled={isToggled} onClick={onClick}></ToggleButton>
      </div>
    </div>
  );
};

export default Accessibility;
