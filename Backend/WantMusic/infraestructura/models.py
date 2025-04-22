from django.db import models

class Usuario(models.Model):
    nombre = models.CharField(max_length=100)
    correo = models.EmailField(unique=True)
    contrasena = models.CharField(max_length=255)
    gustos_musicales = models.TextField(blank=True, null=True)
    historial_reproducciones = models.TextField(blank=True, null=True)
    favoritos = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.nombre


class Contenido(models.Model):
    TIPO_CHOICES = [
        ('audio', 'Audio'),
        ('video', 'Video'),
    ]

    titulo = models.CharField(max_length=255)
    tipo = models.CharField(max_length=10, choices=TIPO_CHOICES)
    url = models.URLField(max_length=500)
    etiquetas = models.TextField()
    fecha_subida = models.DateTimeField(auto_now_add=True)
    subido_por = models.ForeignKey(
        Usuario,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='contenidos_subidos'
    )

    def __str__(self):
        return self.titulo

