import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import type React from "react";

interface Props<V extends string> {
  label: string;
  value: { code: V; label: string } | null;
  options: Readonly<{ code: V; label: string }[]>;
  onChange: (
    e: React.SyntheticEvent,
    value: { code: V; label: string } | null
  ) => void;
}

const LanguageChooser = <V extends string>(props: Props<V>) => {
  return (
    <div className="flex w-full flex-row items-center justify-between">
      <Typography variant="subtitle1">{props.label}</Typography>
      <Autocomplete
        className="max-w-[80%]"
        fullWidth
        renderInput={(params) => <TextField {...params} />}
        size="small"
        sx={{
          "& .MuiOutlinedInput-root": {
            border: "1px solid #dbeafe",
            color: "#dbeafe",
          },
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "& .MuiIconButton-root": {
            color: "#dbeafe",
          },
        }}
        {...props}
      />
    </div>
  );
};

export default LanguageChooser;
