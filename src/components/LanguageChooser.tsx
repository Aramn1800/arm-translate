import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type React from 'react'

type Props<V extends string> = {
  label: string
  value: { code: V; label: string } | null
  options: Readonly<{ code: V; label: string }[]>
  onChange: (e: React.SyntheticEvent, value: { code: V; label: string } | null) => void
}

const LanguageChooser = <V extends string>(props: Props<V>) => {
  return (
    <div className="flex flex-row w-full justify-between items-center">
      <Typography variant="subtitle1">{props.label}</Typography>
      <Autocomplete
        fullWidth
        size="small"
        className="max-w-[80%]"
        renderInput={(params) => <TextField {...params} />}
        sx={{
          '& .MuiOutlinedInput-root': {
            border: '1px solid #dbeafe',
            color: '#dbeafe',
          },
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '& .MuiIconButton-root': {
            color: '#dbeafe',
          },
        }}
        {...props}
      />
    </div>
  )
}

export default LanguageChooser
