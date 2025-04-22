from django.db import models

class Administrador(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    contrasena = models.CharField(max_length=255)

    def __str__(self):
        return self.nombre


class UsuarioInactivo(models.Model):
    usuario = models.ForeignKey('WantMusic_infraestructura.Usuario', on_delete=models.CASCADE)

    def __str__(self):
        return f"Usuario Inactivo: {self.usuario.nombre}"


class ContenidoEliminado(models.Model):
    contenido = models.ForeignKey('WantMusic_infraestructura.Contenido', on_delete=models.CASCADE)

    def __str__(self):
        return f"Contenido Eliminado: {self.contenido.titulo}"
