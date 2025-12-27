import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import { observer } from "mobx-react-lite";
import React from "react";
import appModel from "../app-model";
import HotkeyInput from "./hotkey-input";

interface Props {
  open: boolean;
}

const ToolsOptions: React.FC<Props> = observer(({ open }) => {
  const { capture, translate, autoCapture, textSize } = appModel;

  let bufferText = "";
  let timeoutId: NodeJS.Timeout | undefined;

  const handleAutoCapture = async () => {
    const image = await window.ipcRenderer.invoke("take-screenshot");
    const captureText = await capture(image);

    if (bufferText !== captureText) {
      bufferText = captureText;
      const translateText = await translate(captureText);
      appModel.textTranslate = translateText;
    }

    if (appModel.autoCapture) {
      timeoutId = setTimeout(() => {
        handleAutoCapture();
      }, 250);
    }
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  React.useEffect(() => {
    if (autoCapture) {
      handleAutoCapture();
    } else if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = undefined;
    }
  }, [autoCapture]);

  return (
    <Collapse
      in={open}
      sx={{
        "& .MuiCollapse-wrapperInner": {
          display: "flex",
          flexDirection: "column",
          width: "100%",
          gap: 2,
          padding: 2,
          paddingBottom: 0,
        },
      }}
    >
      <TextField
        label="Text size (rem)"
        onChange={(event) => {
          appModel.textSize = Number(event.target.value);
        }}
        size="small"
        slotProps={{
          inputLabel: { className: "text-blue-100 text-lg bg-gray-800" },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            border: "1px solid #dbeafe",
            color: "#dbeafe",
          },
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
        }}
        type="number"
        value={textSize}
      />
      <HotkeyInput />
      <FormControlLabel
        className="group text-blue-100 hover:text-blue-300"
        control={
          <Checkbox
            className="text-blue-100 group-hover:text-blue-300"
            onChange={(_, checked) => {
              appModel.autoCapture = checked;
            }}
            size="small"
            value={autoCapture}
          />
        }
        label="Auto capture (unstable)"
      />
    </Collapse>
  );
});

export default ToolsOptions;
