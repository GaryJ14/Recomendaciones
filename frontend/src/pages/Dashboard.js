import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from '../components/Dashboard/AppNavbar';
import Header from '../components/Dashboard/Header';
import MainGrid from '../components/Dashboard/MainGrid';
import SideMenu from '../components/Dashboard/SideMenu';
import AppTheme from '../components/shared-theme/AppTheme';

const xThemeComponents = {
  // ... tus configuraciones de tema
};

export default function Dashboard(props) {
  const navigate = useNavigate(); // Usamos useNavigate para redirigir
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Si no hay token, redirige al login
      navigate('/');
    }
  }, [navigate]);

  const nombre = localStorage.getItem('nombre') || 'Invitado';
  const email = localStorage.getItem('email') || 'email@default.com';

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu />
        <AppNavbar />
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header nombre={nombre} email={email} />
            <MainGrid />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
