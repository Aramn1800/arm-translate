import clsx from "clsx";

interface IIconButton {
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const Button = ({ onClick, children, className, disabled }: IIconButton) => {
  return (
    <button
      className={clsx(
        className,
        "focus-visible:text-blue-300 focus-visible:outline-0",
        "h-8 w-8 cursor-pointer p-1 text-blue-100 hover:text-blue-300 disabled:cursor-default disabled:text-gray-700"
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
};

export default Button;
