
import * as React from 'react';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';

import AppNavbar from '../components/Dashboard/AppNavbar';
import SideMenu from '../components/Dashboard/SideMenu';
import Header from '../components/Dashboard/Header';
import AppTheme from '../components/shared-theme/AppTheme';
import TblMusica from '../components/Musica/tblMusica';

import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from '../components/Dashboard/theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Musica() {
  const nombre = localStorage.getItem('nombre') || 'Invitado';
  const email = localStorage.getItem('email') || 'email@default.com';

  return (
    <AppTheme themeComponents={xThemeComponents}>
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
            <TblMusica />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
