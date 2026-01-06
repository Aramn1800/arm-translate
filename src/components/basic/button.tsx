import clsx from "clsx";

interface IButton {
  onClick: () => void;
  label?: string;
  variant?: "text" | "contained";
  disabled?: boolean;
  className?: string;
}

const Button = ({
  onClick,
  label,
  className,
  disabled,
  variant = "contained",
}: IButton) => {
  return (
    <button
      className={clsx(
        className,
        "cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-blue-300 disabled:cursor-default",
        variant === "contained"
          ? "min-w-32 bg-blue-100 px-4 py-1 text-gray-800 hover:bg-blue-300 disabled:bg-gray-700"
          : "min-w-0 bg-transparent p-1 text-blue-100 hover:text-blue-300 disabled:text-gray-700"
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  );
};

export default Button;
