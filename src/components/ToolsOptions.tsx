import React from "react";
import { observer } from "mobx-react-lite";
import appModel from "../AppModel";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Collapse from "@mui/material/Collapse";
import HotkeyInput from "./HotkeyInput";

type Props = {
  open: boolean,
};

const ToolsOptions: React.FC<Props> = observer(({ open }) => {
  const { capture, translate, autoCapture, textSize } = appModel;

  let bufferText: string = '';
  let timeoutId: NodeJS.Timeout | undefined = undefined;

  const handleAutoCapture = async () => {
    const image = await window.ipcRenderer.invoke('take-screenshot');
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
        '& .MuiCollapse-wrapperInner': {
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          gap: 2,
          padding: 2,
          paddingBottom: 0,
        },
      }}
    >
      <TextField
        value={textSize}
        type="number"
        size="small"
        label="Text size (rem)"
        sx={{
          "& .MuiOutlinedInput-root": {
            border: "1px solid #dbeafe",
            color: '#dbeafe',
          },
          "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
            border: 'none',
          },
        }}
        slotProps={{
          inputLabel: { className: 'text-blue-100 text-lg bg-gray-800' }
        }}
        onChange={(event) => appModel.textSize = Number(event.target.value)}
      />
      <HotkeyInput />
      <FormControlLabel
        label="Auto capture (unstable)"
        className="group text-blue-100 hover:text-blue-300"
        control={
          <Checkbox
            value={autoCapture}
            onChange={(_, checked) => appModel.autoCapture = checked}
            size="small"
            className="text-blue-100 group-hover:text-blue-300"
          />
        }
      />
    </Collapse>
  );
});

export default ToolsOptions;
