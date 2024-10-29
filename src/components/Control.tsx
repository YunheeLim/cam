import MoreIcon from "../../public/svgs/more.svg"

interface ControlProps {
    name: string;
    OnClick: () => void;
    children: React.ReactNode;
    className?: string;
}

const Control: React.FC<ControlProps> = (props) => {
    return (
        <button className={props.className}><div className="flex h-12 w-[90px] rounded-lg bg-primary">
            <div onClick={props.OnClick} className="flex flex-grow-[5.5] justify-center items-center"><div>
                {props.children}
            </div></div>
            <div className="w-px bg-[#4645ab]"></div>
            <div className="flex flex-grow-[4.5] justify-center items-center"><div>
                <MoreIcon />
            </div></div>
        </div></button >);
}

export default Control;