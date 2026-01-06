import clsx from "clsx";
import React from "react";

interface IAutocompleteOption<T extends string> {
  code: T;
  label: string;
}

export interface IAutocomplete<T extends string> {
  value: T | undefined;
  options: IAutocompleteOption<T>[];
  onChange: (v: T | undefined) => void;
  className?: string;
  disabled?: boolean;
}

const Autocomplete = <T extends string>({
  value,
  options,
  onChange,
  className,
  disabled,
}: IAutocomplete<T>) => {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState<string | undefined>(
    undefined
  );
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFocus = () => {
    setInputValue(undefined);
    setOpen(true);
  };

  const handleBlur = () => {
    handleValueLabel();
    setOpen(false);
  };

  const filteredOptions = React.useMemo(() => {
    if (!inputValue) {
      return options;
    }
    const lowerInput = inputValue.toLowerCase();
    return options.filter((option) =>
      option.label.toLowerCase().includes(lowerInput)
    );
  }, [inputValue, options]);

  const handleSelect = (option: T | undefined) => {
    onChange(option);
    inputRef.current?.blur();
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  const handleValueLabel = () => {
    if (!value) {
      setInputValue(undefined);
      return;
    }
    const findValue = options.find((o) => o.code === value);
    setInputValue(findValue?.label);
  };

  React.useEffect(() => {
    handleValueLabel();
  }, [value]);

  return (
    <div className={clsx(className, "relative w-full")}>
      <input
        className="h-10 w-full rounded-sm border-1 border-blue-100 px-4 py-1 text-blue-100 focus-visible:border-blue-300 focus-visible:outline-0 disabled:border-gray-700"
        disabled={disabled}
        onBlur={handleBlur}
        onChange={handleChangeInput}
        onFocus={handleFocus}
        ref={inputRef}
        type="text"
        value={inputValue}
      />
      {open ? (
        // biome-ignore lint/a11y/noNoninteractiveElementInteractions: prevent blur on click on the list
        <ul
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-sm border-1 border-blue-100 bg-gray-800 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-300 [&::-webkit-scrollbar-track]:bg-blue-100 [&::-webkit-scrollbar]:w-2"
          onMouseDown={handleMouseDown}
        >
          {filteredOptions.map(({ code, label }) => (
            <li
              className={clsx(
                code === value ? "bg-blue-300" : "hover:bg-gray-500"
              )}
              key={code}
            >
              <button
                className="h-full w-full cursor-pointer px-4 py-2 text-start text-blue-100"
                onClick={() => handleSelect(code)}
                type="button"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default Autocomplete;
