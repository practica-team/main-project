import { ThemeProvider as MuiThemeProvider,createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
    palette:{
        mode: 'light',
        primary:{
            main: '#0077FF'
        },
    },
});

export const ThemeProvider = ({children}: {children: React.ReactNode}) => (
    <MuiThemeProvider theme={theme}>
        <CssBaseline>
            {children}
        </CssBaseline>
    </MuiThemeProvider>
);