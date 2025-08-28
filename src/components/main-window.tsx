import Typography from '@mui/material/Typography'
import { observer } from 'mobx-react-lite'
import React from 'react'
import appModel from '../app-model'
import { sourceLanguageOptions, targetLanguageOptions } from '../Language'
import LanguageChooser from './language-chooser'
import Tools from './tools'
import WindowFrame from './window-frame'

const MainWindow: React.FC = observer(() => {
  const { targetLang, sourceLang, textTranslate, textSize, initConfig } = appModel

  React.useEffect(() => {
    initConfig()
  }, [])

  return (
    <WindowFrame title="Main">
      <div className="flex h-full w-full flex-col items-start gap-4 border-blue-100 border-t-2 bg-gray-800 p-4 text-blue-100">
        <div className="flex w-full max-w-[500px] flex-col items-center gap-4">
          <LanguageChooser
            label="Source"
            onChange={(_, value) => {
              appModel.sourceLang = value
            }}
            options={sourceLanguageOptions}
            value={sourceLang}
          />
          <LanguageChooser
            label="Target"
            onChange={(_, value) => {
              appModel.targetLang = value
            }}
            options={targetLanguageOptions}
            value={targetLang}
          />
          <Tools />
        </div>
        <div className="h-full w-full overflow-auto whitespace-break-spaces rounded-l border-2 border-blue-100 p-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-blue-300 [&::-webkit-scrollbar-track]:bg-blue-100 [&::-webkit-scrollbar]:w-2">
          <Typography fontSize={`${textSize}rem`}>{textTranslate || 'No text'}</Typography>
        </div>
      </div>
    </WindowFrame>
  )
})

export default MainWindow
