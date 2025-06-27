import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Button, 
  Modal, 
  TextField, 
  Typography, 
  IconButton, 
  Box,
  Chip,
  Card,
  CardContent,
  Avatar,
  Divider,
  Grid,
  Paper
} from "@mui/material";
import Swal from "sweetalert2";
import { 
  Edit, 
  Visibility, 
  VisibilityOff, 
  Person,
  Email,
  Lock,
  Tag,
  PhotoCamera
} from "@mui/icons-material";

const Perfil = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newFotoPerfil, setNewFotoPerfil] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState(null);
  const [etiquetasFavoritas, setEtiquetasFavoritas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos del perfil
        const perfilResponse = await axios.get("http://localhost:8000/api/perfil/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        const { id, nombre, email, foto_perfil, password } = perfilResponse.data;
        setNombreUsuario(nombre);
        setEmail(email);
        setPassword(password);
        setFotoPerfil(foto_perfil ? `http://localhost:8000${foto_perfil}` : "");
        setUserId(id);

        // Obtener etiquetas favoritas del usuario
        try {
          const etiquetasResponse = await axios.get("http://localhost:8000/api/etiquetas/", {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            },
          });
          setEtiquetasFavoritas(etiquetasResponse.data || []);
        } catch (etiquetasError) {
          console.log("No se pudieron cargar las etiquetas favoritas:", etiquetasError);
          setEtiquetasFavoritas([]);
        }

      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
        Swal.fire({
          title: "Error",
          text: "No se pudo obtener los datos del usuario.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Función para recargar los datos del usuario
  const refreshUserData = async () => {
    try {
      const perfilResponse = await axios.get("http://localhost:8000/api/perfil/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      const { nombre, email, foto_perfil } = perfilResponse.data;
      setNombreUsuario(nombre);
      setEmail(email);
      setFotoPerfil(foto_perfil ? `http://localhost:8000${foto_perfil}` : "");
    } catch (error) {
      console.error("Error al recargar los datos del usuario:", error);
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNewPassword("");
    setNewFotoPerfil(null);
    setShowPassword(false);
    
    // Limpiar URL del objeto si existe para evitar memory leaks
    if (newFotoPerfil) {
      URL.revokeObjectURL(URL.createObjectURL(newFotoPerfil));
    }
  };

  const handleUpdateProfile = async () => {
    if (!nombreUsuario || !email) {
      Swal.fire({
        title: "Error",
        text: "Por favor, complete todos los campos obligatorios.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
      return;
    }

    try {
      setUpdating(true);
      
      const formData = new FormData();
      formData.append("nombre", nombreUsuario);
      formData.append("email", email);
      if (newPassword) formData.append("password", newPassword);
      if (newFotoPerfil) formData.append("foto_perfil", newFotoPerfil);

      await axios.put(
        `http://localhost:8000/api/actualizar/${userId}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        }
      );

      // Cerrar modal primero
      handleCloseModal();

      // Mostrar mensaje de éxito
      await Swal.fire({
        title: "¡Perfil actualizado!",
        text: "Tu perfil se ha actualizado correctamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      // Recargar los datos del usuario para mostrar los cambios
      await refreshUserData();

    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el perfil. Inténtalo de nuevo.",
        icon: "error",
        confirmButtonText: "Aceptar",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validImageTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (!validImageTypes.includes(file.type)) {
        Swal.fire({
          title: "Error",
          text: "Por favor, selecciona un archivo de imagen válido (JPG, PNG, JPEG).",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }
      
      // Validar tamaño del archivo (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        Swal.fire({
          title: "Error",
          text: "El archivo es demasiado grande. Máximo 5MB permitido.",
          icon: "error",
          confirmButtonText: "Aceptar",
        });
        return;
      }
      
      setNewFotoPerfil(file);
    }
  };

  if (loading) {
    return (
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '100vh',
        }}
      >
        <Typography variant="h5" sx={{ color: 'white' }}>
          Cargando perfil...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        padding: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
        {/* Header del Perfil */}
        <Paper
          elevation={6}
          sx={{
            borderRadius: 4,
            overflow: 'hidden',
            mb: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(45deg,rgb(0, 0, 0) 30%,rgb(103, 83, 255) 90%)',
              padding: 3,
              color: 'white',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              <Grid item>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    src={fotoPerfil}
                    sx={{
                      width: 100,
                      height: 100,
                      border: '4px solid rgba(255, 255, 255, 0.3)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
                    }}
                  >
                    <Person sx={{ fontSize: 40 }} />
                  </Avatar>
                </Box>
              </Grid>
              <Grid item xs>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {nombreUsuario || 'Usuario'}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                  {email}
                </Typography>
                <Button
                  variant="contained"
                  onClick={handleOpenModal}
                  startIcon={<Edit />}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(45deg,rgb(0, 0, 0) 30%,rgb(103, 83, 255) 90%)',
                    },
                  }}
                >
                  Editar Perfil
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Paper>

        {/* Sección de Etiquetas Favoritas */}
        <Card
          elevation={6}
          sx={{
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Tag sx={{ mr: 1, color: '#666' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                Etiquetas Favoritas
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            
            {etiquetasFavoritas.length > 0 ? (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {etiquetasFavoritas.map((etiqueta, index) => (
                  <Chip
                    key={index}
                    label={etiqueta.nombre || etiqueta}
                    variant="outlined"
                    sx={{
                      background: 'linear-gradient(45deg,rgb(0, 0, 0) 30%,rgb(103, 83, 255) 90%)',
                      color: 'white',
                      border: 'none',
                      fontWeight: 'medium',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                      },
                      transition: 'all 0.3s ease',
                    }}
                  />
                ))}
              </Box>
            ) : (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#666', 
                  fontStyle: 'italic',
                  textAlign: 'center',
                  py: 3
                }}
              >
                No tienes etiquetas favoritas aún. ¡Explora y marca tus favoritas!
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>

      {/* Modal para editar perfil */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            maxHeight: '90vh',
            overflow: 'auto',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: 3,
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
            p: 4,
          }}
        >
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              mb: 3, 
              fontWeight: 'bold',
              textAlign: 'center',
              background: 'linear-gradient(45deg,rgb(0, 0, 0) 30%,rgb(103, 83, 255) 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Editar Perfil
          </Typography>

          {/* Previsualización de imagen */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={newFotoPerfil ? URL.createObjectURL(newFotoPerfil) : fotoPerfil}
                sx={{ width: 100, height: 100 }}
              >
                <Person sx={{ fontSize: 40 }} />
              </Avatar>
              <IconButton
                sx={{
                  position: 'absolute',
                  bottom: -5,
                  right: -5,
                  background: 'linear-gradient(45deg,rgb(0, 0, 0) 30%,rgb(103, 83, 255) 90%)',
                  color: 'white',
                  width: 35,
                  height: 35,
                  '&:hover': {
                    background: 'linear-gradient(45deg,rgb(0, 0, 0) 30%,rgb(103, 83, 255) 90%)',
                  },
                }}
                onClick={() => document.getElementById("file-input").click()}
              >
                <PhotoCamera sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>

          <TextField
            label="Nombre"
            fullWidth
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: '#666' }} />,
            }}
          />

          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <Email sx={{ mr: 1, color: '#666' }} />,
            }}
          />

          <TextField
            label="Contraseña Actual"
            type="password"
            fullWidth
            value="••••••••"
            sx={{ mb: 2 }}
            disabled
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: '#666' }} />,
            }}
          />

          <TextField
            label="Nueva Contraseña (opcional)"
            type={showPassword ? "text" : "password"}
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: '#666' }} />,
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />

          <input
            type="file"
            id="file-input"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              onClick={handleCloseModal}
              variant="outlined"
              fullWidth
              sx={{ 
                borderColor: '#666',
                color: '#666',
                '&:hover': {
                  borderColor: '#999',
                  background: 'rgba(0,0,0,0.05)',
                }
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateProfile}
              variant="contained"
              fullWidth
              sx={{
                background: 'linear-gradient(45deg,rgb(0, 0, 0) 30%,rgb(103, 83, 255) 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg,rgb(0, 0, 0) 30%,rgb(103, 83, 255) 90%)',
                },
              }}
            >
              Actualizar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Perfil;