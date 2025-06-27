import * as React from 'react';
import Stack from '@mui/material/Stack';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import ColorModeIconDropdown from '../../components/shared-theme/ColorModeIconDropdown';
import Search from './Search';
import Typography from '@mui/material/Typography';  // Asegúrate de importar Typography

export default function Header({ nombre }) {  // Recibimos 'nombre' y 'email' como props
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '100%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={{ gap: 1 }}>
        <Search />
        <ColorModeIconDropdown />
      </Stack>
      {/* Mostrar nombre y email aquí */}
      <Stack direction="row" spacing={1} alignItems="center">
        <Typography variant="h6">{nombre}</Typography>  {/* Nombre del usuario */}
        
      </Stack>
    </Stack>
  );
}
