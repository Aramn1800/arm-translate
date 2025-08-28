import React from 'react'
import Typography from '@mui/material/Typography'
import { observer } from 'mobx-react-lite'
import appModel from '../AppModel'
import Button from '@mui/material/Button'
import ToolsOptions from './ToolsOptions'

const Tools: React.FC = observer(() => {
  const [open, setOpen] = React.useState(false)
  const { targetLang, sourceLang, captureAndTranslate, autoCapture } = appModel

  const isMissingValue = !sourceLang || !targetLang

  React.useEffect(() => {
    window.ipcRenderer.on('global-shortcut-pressed', () => {
      captureAndTranslate()
    })
  }, [])

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full gap-6 items-center">
        <Button
          variant="text"
          onClick={() => setOpen(!open)}
          size="small"
          className="text-blue-100 hover:text-blue-300"
        >
          {`${open ? '▼' : '►'} Options`}
        </Button>
        <Button
          className="bg-blue-100 text-gray-800 hover:bg-blue-300 disabled:bg-gray-700"
          variant="contained"
          size="small"
          onClick={captureAndTranslate}
          disabled={isMissingValue || autoCapture}
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
