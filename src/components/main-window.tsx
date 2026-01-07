import { observer } from "mobx-react-lite";
import React from "react";
import appModel from "../app-model";
import { sourceLanguageOptions, targetLanguageOptions } from "../language";
import LoadingScreen from "./loading-screen";
import LanguageChooser from "./tools/language-chooser";
import Tools from "./tools/tools";
import WindowFrame from "./window-frame";

const MainWindow = observer(() => {
  const {
    targetLang,
    sourceLang,
    textOutput,
    textSize,
    initConfig,
    configLoading,
  } = appModel;

  React.useEffect(() => {
    initConfig();
  }, []);

  return (
    <WindowFrame title="Main">
      <div className="flex h-full w-full flex-col items-start gap-4 border-blue-100 border-t-2 bg-gray-800 p-4">
        {configLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <div className="flex w-full max-w-[500px] flex-col items-center gap-4">
              <LanguageChooser
                label="Source"
                onChange={(v) => {
                  appModel.sourceLang = v;
                  appModel.updateConfig({ SOURCE_LANG: v });
                }}
                options={sourceLanguageOptions}
                value={sourceLang}
              />
              <LanguageChooser
                label="Target"
                onChange={(v) => {
                  appModel.targetLang = v;
                  appModel.updateConfig({ TARGET_LANG: v });
                }}
                options={targetLanguageOptions}
                value={targetLang}
              />
              <Tools />
            </div>
            <div className="h-full w-full overflow-auto whitespace-break-spaces rounded-l border-2 border-blue-100 p-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-300 [&::-webkit-scrollbar-track]:bg-blue-100 [&::-webkit-scrollbar]:w-2">
              <p
                className="text-blue-100"
                style={{ fontSize: `${textSize}rem` }}
              >
                {textOutput || "No text"}
              </p>
            </div>
          </>
        )}
      </div>
    </WindowFrame>
  );
});

export default MainWindow;
