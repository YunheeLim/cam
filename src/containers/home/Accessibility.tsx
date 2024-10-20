import Icon from '../../../public/svgs/icon';
import ToggleButton from './Toggle';

interface Accessibility {
  children: string;
}

const Accessibility: React.FC<Accessibility> = ({ children }) => {
  return (
    <div className="mb-6 w-96 flex flex-row justify-between">
      <div className="flex">
        <Icon
          id={`${children === '스크린 리더' ? 'screen' : 'keyboard'}`}
          className="h-8 w-8"
        />
        <div className="px-2 text-xl font-semibold">{children}</div>
      </div>
      <div>
        <ToggleButton></ToggleButton>
      </div>
    </div>
  );
};

export default Accessibility;
