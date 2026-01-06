import { observer } from "mobx-react-lite";
import type React from "react";
import appModel from "../../app-model";
import Collapse from "../basic/collapse";
import Input from "../basic/input";
import AutoCapture from "./auto-capture";
import HotkeyInput from "./hotkey-input";

interface IToolsOptions {
  open: boolean;
}

const ToolsOptions = observer(({ open }: IToolsOptions) => {
  const { textSize } = appModel;

  const handleTextSize = (event: React.ChangeEvent<HTMLInputElement>) => {
    appModel.textSize = Number(event.target.value);
  };

  return (
    <Collapse open={open}>
      <Input
        label="Text size (rem)"
        onChange={handleTextSize}
        type="number"
        value={textSize}
      />
      <HotkeyInput />
      <AutoCapture />
    </Collapse>
  );
});

export default ToolsOptions;
