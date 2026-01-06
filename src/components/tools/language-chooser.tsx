import Autocomplete, { type IAutocomplete } from "../basic/autocomplete";

interface ILanguageChooser<T extends string> {
  label: string;
  value: T | undefined;
  options: IAutocomplete<T>["options"];
  onChange: IAutocomplete<T>["onChange"];
}

const LanguageChooser = <T extends string>({
  label,
  value,
  options,
  onChange,
}: ILanguageChooser<T>) => {
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <p className="text-blue-100">{label}</p>
      <Autocomplete
        className="max-w-[80%]"
        onChange={onChange}
        options={options}
        value={value}
      />
    </div>
  );
};

export default LanguageChooser;
