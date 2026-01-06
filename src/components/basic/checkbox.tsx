import clsx from "clsx";

interface ICheckbox {
  onChange: (checked: boolean) => void;
  value: boolean;
  label: string;
  disabled?: boolean;
  className?: string;
}

const Checkbox = ({
  onChange,
  value,
  label,
  className,
  disabled,
}: ICheckbox) => {
  const onClick = () => {
    onChange(!value);
  };

  return (
    <button
      className="group m-0.5 flex w-fit cursor-pointer items-center gap-2 rounded-sm focus-visible:outline-2 focus-visible:outline-blue-300"
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      <div
        className={clsx(
          className,
          "relative h-5 w-5 cursor-pointer rounded-sm border-2 border-blue-100",
          "group-hover:border-blue-300 group-disabled:border-gray-700",
          value && "bg-blue-100 group-disabled:bg-gray-700"
        )}
      >
        {value ? (
          <p className="absolute -top-1.5 left-[1px] font-bold text-gray-800 text-xl">
            ✓
          </p>
        ) : null}
      </div>
      <p className="text-blue-100 group-hover:text-blue-300 group-disabled:text-gray-700">
        {label}
      </p>
    </button>
  );
};

export default Checkbox;
