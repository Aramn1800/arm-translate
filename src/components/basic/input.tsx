import clsx from "clsx";

interface IInput {
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  value: string | number;
  label: string;
  type?: "text" | "number";
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

const Input = ({
  onChange,
  value,
  label,
  type = "text",
  className,
  disabled,
  error,
}: IInput) => {
  return (
    <div className="relative mt-2 w-full">
      <input
        className={clsx(
          className,
          "peer h-10 w-full rounded-sm border-1 border-blue-100 px-4 py-1 text-blue-100",
          "focus-visible:border-blue-300 focus-visible:outline-0 disabled:border-gray-700",
          error && "border-red-500 text-red-500"
        )}
        disabled={disabled}
        min={0.25}
        onChange={onChange}
        placeholder={label}
        step={0.25}
        type={type}
        value={value}
      />
      {value === "" ? null : (
        <p
          className={clsx(
            "absolute -top-3 left-4 bg-gray-800 text-blue-100 peer-focus-visible:text-blue-300",
            disabled && "text-gray-700",
            error && "text-red-500"
          )}
        >
          {label}
        </p>
      )}
    </div>
  );
};

export default Input;
