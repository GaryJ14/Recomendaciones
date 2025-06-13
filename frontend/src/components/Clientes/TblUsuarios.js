import React, { useState, useEffect } from 'react';
import {
  DataGrid,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Delete, Edit, Add } from '@mui/icons-material';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { useNavigate } from 'react-router-dom';

import {
  obtenerUsuarios,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
} from '../../services/usuarios';

const MySwal = withReactContent(Swal);

export default function TblUsuarios() {
  const navigate = useNavigate(); // Hook para navegar a otras páginas
  const [usuarios, setUsuarios] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({
    id: null,
    nombre: '',
    email: '',
    password: '',
  });

  useEffect(() => {
    // Validación si el usuario está autenticado
    const token = localStorage.getItem('access_token');
    if (!token) {
      // Si no hay token, redirigir al login
      navigate('/');
    } else {
      fetchUsuarios();
    }
  }, [navigate]);

  const fetchUsuarios = async () => {
    try {
      const res = await obtenerUsuarios();
      setUsuarios(res.data);
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      MySwal.fire({
        title: 'Error',
        text: 'Hubo un problema al obtener los usuarios.',
        icon: 'error',
        confirmButtonText: 'OK',
        zIndex: 2000,
      });
    }
  };

  const handleOpenModal = async (usuario = { id: null, nombre: '', email: '', password: '' }) => {
    if (usuario.id) {
      const result = await MySwal.fire({
        title: 'Confirmar edición',
        text: '¿Estás seguro de editar estos campos?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, editar',
        cancelButtonText: 'Cancelar',
        zIndex: 2000,
      });
      if (!result.isConfirmed) return;
    }
    setUsuarioActual(usuario);
    setModoEdicion(!!usuario.id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setUsuarioActual({ id: null, nombre: '', email: '', password: '' });
    setOpenModal(false);
  };

  const handleSave = async () => {
    try {
      if (modoEdicion) {
        await actualizarUsuario(usuarioActual.id, usuarioActual);
      } else {
        await crearUsuario(usuarioActual);
      }
      fetchUsuarios();
      handleCloseModal();
      await MySwal.fire({
        title: 'Éxito',
        text: 'Usuario guardado correctamente',
        icon: 'success',
        confirmButtonText: 'OK',
        zIndex: 2000,
      });
    } catch (err) {
      handleCloseModal();
      if (err.response && err.response.status === 409) {
        console.log('Error: No se pudo guardar el usuario (conflicto de usuario)');
      } else {
        console.error('Error al guardar:', err);
      }

      await MySwal.fire({
        title: 'Error',
        text: 'El usuario ya está registrado o hubo un error al guardar.',
        icon: 'error',
        confirmButtonText: 'OK',
        zIndex: 2000,
      });
    }
  };

  const handleDelete = async (id) => {
    const result = await MySwal.fire({
      title: 'Confirmar eliminación',
      text: '¿Estás seguro de eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      zIndex: 2000,
    });

    if (result.isConfirmed) {
      try {
        await eliminarUsuario(id);
        fetchUsuarios();
        await MySwal.fire({
          title: 'Eliminado',
          text: 'Usuario eliminado correctamente',
          icon: 'success',
          confirmButtonText: 'OK',
          zIndex: 2000,
        });
      } catch (err) {
        console.error('Error al eliminar:', err);
        await MySwal.fire({
          title: 'Error',
          text: 'No se pudo eliminar el usuario',
          icon: 'error',
          confirmButtonText: 'OK',
          zIndex: 2000,
        });
      }
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
    { field: 'password', headerName: 'Contraseña', flex: 1 },
    {
      field: 'acciones',
      type: 'actions',
      headerName: 'Acciones',
      width: 120,
      getActions: (params) => [
        <GridActionsCellItem
          key="editar"
          icon={<Edit />}
          label="Editar"
          onClick={() => handleOpenModal(params.row)}
        />,
        <GridActionsCellItem
          key="eliminar"
          icon={<Delete />}
          label="Eliminar"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenModal()}>
          Crear Usuario
        </Button>
      </Box>
      <DataGrid
        rows={usuarios}
        columns={columns}
        getRowId={(row) => row.id}
        autoHeight
        pageSize={5}
        rowsPerPageOptions={[5]}
      />

      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>{modoEdicion ? 'Editar Usuario' : 'Crear Usuario'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nombre"
            fullWidth
            value={usuarioActual.nombre}
            onChange={(e) => setUsuarioActual({ ...usuarioActual, nombre: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            value={usuarioActual.email}
            onChange={(e) => setUsuarioActual({ ...usuarioActual, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Contraseña"
            type="password"
            fullWidth
            value={usuarioActual.password}
            onChange={(e) => setUsuarioActual({ ...usuarioActual, password: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancelar</Button>
          <Button onClick={handleSave} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
