import CloseIcon from '@mui/icons-material/Close'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import { observer } from 'mobx-react-lite'
import React from 'react'
import appModel from '../app-model'

const HotkeyInput: React.FC = observer(() => {
  const [recording, setRecording] = React.useState(false)
  const [error, setError] = React.useState(false)
  let modifiers: string[] = []

  const toggleRecord = () => {
    setError(false)
    setRecording(!recording)
  }

  const handleRemoveHotkey = async () => {
    setError(false)
    await window.ipcRenderer.invoke('globalShortcut-unregister')
    appModel.hotkey = ''
  }

  const codeFormat = (code: string) => {
    if (code.startsWith('KEY')) {
      return code.substring(3)
    }
    if (code.startsWith('DIGIT')) {
      return code.substring(5)
    }
    if (code.endsWith('LEFT')) {
      return code.substring(0, code.length - 4)
    }
    if (code.endsWith('RIGHT')) {
      return code.substring(0, code.length - 5)
    }
    return code
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    event.preventDefault()
    event.stopPropagation()

    const code = codeFormat(event.code.toUpperCase())

    if (!modifiers.includes(code)) {
      modifiers.push(code)
    }

    const formattedHotkey = modifiers
      .sort((a, b) => {
        const order = ['COMMANDORCONTROL', 'CONTROL', 'SHIFT', 'ALT', 'SPACE']
        const aIndex = order.indexOf(a)
        const bIndex = order.indexOf(b)
        if (aIndex !== -1 && bIndex !== -1) {
          return aIndex - bIndex
        }
        if (aIndex !== -1) {
          return -1
        }
        if (bIndex !== -1) {
          return 1
        }
        return a.localeCompare(b)
      })
      .join('+')

    appModel.hotkey = formattedHotkey
  }

  const handleKeyUp = async () => {
    if (modifiers.length >= 2) {
      await window.ipcRenderer.invoke('globalShortcut-register', appModel.hotkey)
    } else {
      setError(true)
    }
    modifiers = []
    setRecording(false)
  }

  React.useEffect(() => {
    if (!recording) {
      return
    }
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [recording])

  return (
    <div className="flex w-full flex-row items-center gap-2">
      <TextField
        error={error}
        focused
        fullWidth
        helperText={error ? 'The hotkey must contain at least 2 values.' : undefined}
        label="Capture hotkey"
        size="small"
        slotProps={{
          input: {
            readOnly: true,
            className: 'cursor-default',
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  className="group"
                  disabled={appModel.hotkey === ''}
                  onClick={handleRemoveHotkey}
                  size="small"
                >
                  <CloseIcon className="h-5 w-5 text-blue-100 group-disabled:text-gray-700" />
                </IconButton>
              </InputAdornment>
            ),
          },
          inputLabel: {
            className: `${error ? 'text-red-500' : 'text-blue-100'} text-lg bg-gray-800`,
          },
          formHelperText: {
            className: 'text-red-500 absolute bottom-[-22px] left-0 w-full m-0',
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            position: 'relative',
            border: '1px solid',
            borderColor: error ? '#fb2c36' : '#dbeafe',
            color: '#dbeafe',
          },
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
        }}
        value={appModel.hotkey}
      />
      <Button
        className={`${recording ? 'bg-blue-300' : 'bg-blue-100'} min-w-[120px] text-gray-800 hover:bg-blue-300`}
        onClick={toggleRecord}
        size="small"
        variant="contained"
      >
        Set hotkey
      </Button>
    </div>
  )
})

export default HotkeyInput
