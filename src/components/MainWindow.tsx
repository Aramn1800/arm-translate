import React from "react";
import Typography from "@mui/material/Typography";
import { observer } from "mobx-react-lite";
import { sourceLanguageOptions, targetLanguageOptions } from "../Language";
import appModel from "../AppModel";
import LanguageChooser from "./LanguageChooser";
import WindowFrame from "./WindowFrame";
import Tools from "./Tools";

const MainWindow: React.FC = observer(() => {
  const { targetLang, sourceLang, textTranslate, textSize } = appModel;

  return (
    <WindowFrame title="Main">
      <div className="flex flex-col gap-4 items-start p-4 bg-gray-800 text-blue-100 w-full h-full border-t-2 border-blue-100">
        <div className="flex flex-col gap-4 w-full max-w-[500px] items-center">
          <LanguageChooser
            label='Source'
            value={sourceLang}
            onChange={(_, value) => appModel.sourceLang = value}
            options={sourceLanguageOptions}
          />
          <LanguageChooser
            label="Target"
            value={targetLang}
            onChange={(_, value) => appModel.targetLang = value}
            options={targetLanguageOptions}
          />
          <Tools />
        </div>
        <div
          className="
            p-2 border-2 border-blue-100 w-full rounded-l overflow-auto whitespace-break-spaces
            [&::-webkit-scrollbar]:w-2
          [&::-webkit-scrollbar-track]:bg-blue-100
            [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-blue-300
          "
        >
          <Typography fontSize={`${textSize}rem`}>{textTranslate || 'No text'}</Typography>
        </div>
      </div>
    </WindowFrame>
  );
});

export default MainWindow;
