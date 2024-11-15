// import Icon from '../../../public/svgs/icon';
import ToggleButton from './Toggle';
import ScreenIcon from '../../../public/svgs/screen.svg';
import KeyboardIcon from '../../../public/svgs/keyboard.svg';

interface Accessibility {
  children: string;
}

const Accessibility: React.FC<Accessibility> = ({ children }) => {
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
        <ToggleButton></ToggleButton>
      </div>
    </div>
  );
};

export default Accessibility;
