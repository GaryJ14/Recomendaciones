from django.db import models
from django.utils import timezone
class EstadisticaUsuario(models.Model):
    total_usuarios = models.IntegerField()
    total_activos = models.IntegerField(null=True, blank=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Usuarios totales: {self.total_usuarios} (Activos: {self.total_activos})"

class EstadisticaFavorito(models.Model):
    etiqueta = models.CharField(max_length=100, default="Mis Favoritos")
    total_contenidos = models.IntegerField()
    fecha_registro = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Contenidos con etiqueta '{self.etiqueta}': {self.total_contenidos}"