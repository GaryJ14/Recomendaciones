from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class GestorUsuario(BaseUserManager):
    def create_user(self, email, nombre, password=None, **extra_fields):
        if not email:
            raise ValueError('El email es obligatorio')
        email = self.normalize_email(email)
        usuario = self.model(email=email, nombre=nombre, **extra_fields)
        usuario.set_password(password)
        usuario.save(using=self._db)
        return usuario

    def create_superuser(self, email, nombre, password=None, **extra_fields): 
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        return self.create_user(email, nombre, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    id = models.BigAutoField(primary_key=True)
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True, max_length=150)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)

    objects = GestorUsuario()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre']

    def __str__(self):
        return self.email


class Contenido(models.Model):
    TIPO_CHOICES = [
        ('audio', 'Audio'),
        ('video', 'Video'),
    ]

    titulo = models.CharField(max_length=255)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    url = models.URLField(max_length=500)
    fecha_subida = models.DateTimeField(auto_now_add=True)
    subido_por = models.ForeignKey(
        'Usuario',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='contenidos_subidos'
    )

    # Eliminación lógica simple
    eliminado = models.BooleanField(default=False)

    def __str__(self):
        return self.titulo


class Favorito(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='favoritos')
    contenido = models.ForeignKey(Contenido, on_delete=models.CASCADE, related_name='favoritos')
    fecha_favorito = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('usuario', 'contenido')


class HistorialReproduccion(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='historial_reproduccion')
    contenido = models.ForeignKey(Contenido, on_delete=models.CASCADE, related_name='historial_reproduccion')
    fecha_reproduccion = models.DateTimeField(auto_now_add=True)
    duracion_visto = models.PositiveIntegerField(null=True, blank=True)

class UsuarioEtiquetaFavorita(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name='etiquetas_favoritas')
    etiqueta = models.ForeignKey('TagWant.Etiqueta', on_delete=models.CASCADE, related_name='usuarios_que_la_prefieren')

    class Meta:
        unique_together = ('usuario', 'etiqueta')

class HistorialBusqueda(models.Model):
    usuario = models.ForeignKey(Usuario, on_delete=models.CASCADE, related_name="historial_busquedas")
    termino_busqueda = models.CharField(max_length=255)  # Aquí guardas el término de búsqueda
    fecha_busqueda = models.DateTimeField(auto_now_add=True)  # Guarda la fecha de la búsqueda

    def __str__(self):
        return f"Busqueda: {self.termino_busqueda} por {self.usuario.email}"
