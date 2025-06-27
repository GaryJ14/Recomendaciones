import React, { useState, useRef } from 'react';
import {
  Box, Typography, Button, Paper, IconButton, LinearProgress,
  List, ListItem, ListItemAvatar, ListItemText, Avatar, Snackbar, Alert,
  TextField, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import {
  Add, PlayArrow, Pause, CloudUpload, CheckCircle, Cancel, Movie, MusicNote
} from '@mui/icons-material';

export default function TblContenido() {
  const [archivos, setArchivos] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [currentPreview, setCurrentPreview] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [notification, setNotification] = useState(null);
  const [etiquetas, setEtiquetas] = useState('');
  const [titulo, setTitulo] = useState('');
  const [tipo, setTipo] = useState('');
  const [artista, setArtista] = useState('');
  const [archivo, setArchivo] = useState(null);

  const fileInputRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const videoPlayerRef = useRef(null);

  const API_URL = 'http://localhost:8000/api/contenidos/crear/'; // Ajusta si es necesario

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleDrag = (e, state) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(state);
  };

  const handleDrop = (e) => {
    handleDrag(e, false);
    const newFiles = Array.from(e.dataTransfer.files).filter(
      file => file.type.startsWith('audio/') || file.type.startsWith('video/')
    );
    if (newFiles.length > 0) processFiles(newFiles);
    else showNotification('Solo se permiten archivos de audio y video', 'error');
  };

  const processFiles = (files) => {
    const processed = files.map(file => ({
      id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      type: file.type,
      file,
      url: URL.createObjectURL(file)
    }));
    setArchivos(prev => [...prev, ...processed]);
    showNotification(`${processed.length} archivo(s) añadido(s)`);
    processed.forEach(file => simulateUploadProgress(file.id));
  };

  const simulateUploadProgress = (id) => {
    let progress = 0;
    setUploadProgress(prev => ({ ...prev, [id]: progress }));
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 10) + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      setUploadProgress(prev => ({ ...prev, [id]: progress }));
    }, 300);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(
      file => file.type.startsWith('audio/') || file.type.startsWith('video/')
    );
    if (files.length > 0) {
      setArchivo(files[0]);
      processFiles(files);
    } else {
      showNotification('Solo se permiten archivos de audio y video', 'error');
    }
    e.target.value = '';
  };

  const removeFile = (id) => {
    setArchivos(prev => prev.filter(f => f.id !== id));
    if (currentPreview?.id === id) {
      setCurrentPreview(null);
      setIsPlaying(false);
    }
    showNotification('Archivo eliminado');
  };

  const previewFile = (file) => {
    setCurrentPreview(file);
    setIsPlaying(false);
    audioPlayerRef.current?.pause();
    videoPlayerRef.current?.pause();
  };

  const togglePlay = () => {
    if (!currentPreview) return;
    const media = currentPreview.type.startsWith('audio/') ? audioPlayerRef.current : videoPlayerRef.current;
    if (isPlaying) media.pause();
    else media.play();
    setIsPlaying(!isPlaying);
  };

  const uploadToServer = async () => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      showNotification('No estás autenticado. Por favor inicia sesión.', 'error');
      // Redirigir a login si no hay token
      window.location.href = '/login';
      return;
    }

    if (!archivo) {
      showNotification('No hay archivos para subir', 'error');
      return;
    }
    if (!titulo.trim()) {
      showNotification('El título es obligatorio', 'error');
      return;
    }
    if (!tipo) {
      showNotification('El tipo de contenido es obligatorio', 'error');
      return;
    }
    if (!artista.trim()) {
      showNotification('El artista es obligatorio', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('titulo', titulo.trim());
    formData.append('tipo', tipo);
    formData.append('artista', artista.trim());  // Asegúrate de enviar el campo 'artista'

    const etiquetasArray = etiquetas
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    etiquetasArray.forEach(etiqueta => {
      formData.append('etiquetas', etiqueta);
    });

    formData.append('archivo', archivo);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,  // Aquí se agrega el token
        },
      });

      if (res.status === 401) {
        showNotification('Tu sesión ha expirado. Por favor inicia sesión de nuevo.', 'error');
        localStorage.removeItem('access_token'); // Eliminar el token
        window.location.href = '/login'; // Redirigir a login
        return;
      }

      if (!res.ok) {
        const errorMessage = await res.text();
        showNotification(`Error al subir: ${errorMessage}`, 'error');
        return;
      }

      showNotification('¡Contenido subido exitosamente!');

      // Limpiar estados luego de subir
      setTitulo('');
      setTipo('');
      setArtista('');  // Limpiar el campo artista después de la carga
      setEtiquetas('');
      setArchivo(null);
      setArchivos([]);
      setCurrentPreview(null);
      setIsPlaying(false);
      setUploadProgress({});

    } catch (error) {
      console.error('Error al subir contenido:', error);
      showNotification('Error al subir contenido', 'error');
    }
  };


  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5">Subir Contenido Multimedia</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CloudUpload />}
          onClick={uploadToServer}
        >
          Subir
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        sx={{ mb: 2 }}
        required
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Tipo de Contenido</InputLabel>
        <Select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          label="Tipo de Contenido"
          required
        >
          <MenuItem value="audio">Audio</MenuItem>
          <MenuItem value="video">Video</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Etiquetas (separadas por coma)"
        value={etiquetas}
        onChange={(e) => setEtiquetas(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Artista"
        value={artista}
        onChange={(e) => setArtista(e.target.value)}  // Para el campo artista
        sx={{ mb: 2 }}
        required
      />

      <Paper
        variant="outlined"
        sx={{
          p: 3,
          borderStyle: 'dashed',
          borderColor: isDragging ? 'primary.main' : 'grey.400',
          bgcolor: isDragging ? 'primary.lighter' : 'background.paper',
          mb: 2,
          textAlign: 'center'
        }}
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDragOver={(e) => handleDrag(e, true)}
        onDrop={handleDrop}
      >
        <Add fontSize="large" color="primary" />
        <Typography variant="h6">Arrastra tus archivos aquí</Typography>
        <Typography variant="body2" color="textSecondary">o selecciona desde tu dispositivo</Typography>
        <Button variant="outlined" onClick={() => fileInputRef.current.click()} sx={{ mt: 2 }}>
          Seleccionar archivos
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          accept="audio/*,video/*"
          hidden
        />
      </Paper>

      <List>
        {archivos.map(file => (
          <ListItem key={file.id} onClick={() => previewFile(file)} divider>
            <ListItemAvatar>
              <Avatar>
                {file.type.startsWith('audio/') ? <MusicNote /> : <Movie />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={file.name}
              secondary={`${(file.size / 1024).toFixed(2)} KB • ${file.type.split('/')[1].toUpperCase()}`}
            />
            {uploadProgress[file.id] !== undefined && uploadProgress[file.id] < 100 ? (
              <Box sx={{ width: '30%', mr: 2 }}>
                <LinearProgress variant="determinate" value={uploadProgress[file.id]} />
              </Box>
            ) : uploadProgress[file.id] === 100 ? (
              <CheckCircle color="success" sx={{ mr: 2 }} />
            ) : null}
            <IconButton onClick={(e) => { e.stopPropagation(); removeFile(file.id); }}>
              <Cancel color="error" />
            </IconButton>
          </ListItem>
        ))}
      </List>

      {currentPreview && (
        <Paper sx={{ mt: 3, p: 2 }}>
          <Typography variant="h6" gutterBottom>Previsualización</Typography>
          {currentPreview.type.startsWith('audio/') ? (
            <>
              <Typography>{currentPreview.name}</Typography>
              <audio ref={audioPlayerRef} src={currentPreview.url} controls style={{ width: '100%' }} />
            </>
          ) : (
            <video ref={videoPlayerRef} src={currentPreview.url} controls style={{ width: '100%' }} />
          )}
          <Button
            variant="contained"
            color="secondary"
            startIcon={isPlaying ? <Pause /> : <PlayArrow />}
            onClick={togglePlay}
            sx={{ mt: 2 }}
          >
            {isPlaying ? 'Pausar' : 'Reproducir'}
          </Button>
        </Paper>
      )}

      <Snackbar
        open={Boolean(notification)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={notification?.type} sx={{ width: '100%' }}>
          {notification?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
