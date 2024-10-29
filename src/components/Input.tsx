interface InputProps {
    placeholder: string;
    defaultValue?: string;
    className?: string;
    props?: any;
}

const Input: React.FC<InputProps> = ({ placeholder, defaultValue, className, ...props }) => {
    return <input type='text'
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={`h-11 w-full px-4 py-3 bg-[#f2f2f7] placeholder-[#8f9099] rounded-lg focus:outline-none ${className}`} />
}

export default Input;