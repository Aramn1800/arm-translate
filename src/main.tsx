import GlobalStyles from '@mui/material/GlobalStyles'
import { StyledEngineProvider } from '@mui/material/styles'
import ReactDOM from 'react-dom/client'
import App from './app'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StyledEngineProvider enableCssLayer>
    <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
    <App />
  </StyledEngineProvider>
)
