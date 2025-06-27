import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

const mainListItems = [
  { text: 'Inicio', icon: <HomeRoundedIcon /> },
  { text: 'Musica', icon: <AnalyticsRoundedIcon /> },
  { text: 'Musica Eliminada', icon: <AnalyticsRoundedIcon /> }, 
  { text: 'Clientes', icon: <PeopleRoundedIcon /> },
  { text: 'Contenido', icon: <AssignmentRoundedIcon /> },
];


export default function MenuContent() {
  const navigate = useNavigate();

  const handleNavigation = (text) => {
    switch (text) {
      case 'Inicio':
        navigate('/Home');
        break;
      case 'Musica':
        navigate('/Musica');
        break;
      case 'Musica Eliminada':
        navigate('/musicaEliminada');
        break;
      case 'Clientes':
        navigate('/Clientes');
        break;
      case 'Contenido':
        navigate('/Contenido');
        break;
      default:
        break;
    }
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton onClick={() => handleNavigation(item.text)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
