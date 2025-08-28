import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { observer } from 'mobx-react-lite'
import React from 'react'
import appModel from '../app-model'
import ToolsOptions from './tools-options'

const Tools: React.FC = observer(() => {
  const [open, setOpen] = React.useState(false)
  const { targetLang, sourceLang, captureAndTranslate, autoCapture } = appModel

  const isMissingValue = !(sourceLang && targetLang)

  React.useEffect(() => {
    window.ipcRenderer.on('global-shortcut-pressed', () => {
      captureAndTranslate()
    })
  }, [])

  return (
    <div className="flex w-full flex-col">
      <div className="flex w-full flex-row items-center gap-6">
        <Button
          className="text-blue-100 hover:text-blue-300"
          onClick={() => setOpen(!open)}
          size="small"
          variant="text"
        >
          {`${open ? '▼' : '►'} Options`}
        </Button>
        <Button
          className="bg-blue-100 text-gray-800 hover:bg-blue-300 disabled:bg-gray-700"
          disabled={isMissingValue || autoCapture}
          onClick={captureAndTranslate}
          size="small"
          variant="contained"
        >
          Capture
        </Button>
        {isMissingValue ? (
          <Typography className="text-red-500">Select target/source lang</Typography>
        ) : null}
      </div>
      <ToolsOptions open={open} />
    </div>
  )
})

export default Tools
