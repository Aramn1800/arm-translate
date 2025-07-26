import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { StyledEngineProvider } from '@mui/material/styles';
import GlobalStyles from '@mui/material/GlobalStyles';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <StyledEngineProvider enableCssLayer>
    <GlobalStyles styles="@layer theme, base, mui, components, utilities;" />
    <App />
  </StyledEngineProvider>
);
