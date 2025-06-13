from django.db import models
from Backend.WantMusic.infraestructura.models import Usuario, Contenido


class ContenidoEliminado(models.Model):
    contenido = models.ForeignKey(Contenido, on_delete=models.CASCADE)
    fecha_eliminacion = models.DateTimeField(auto_now_add=True)
    motivo = models.TextField(blank=True, null=True)
    eliminado_por = models.ForeignKey(Usuario, null=True, blank=True, on_delete=models.SET_NULL)


    def __str__(self):
        return f"Eliminado: {self.contenido.titulo} en {self.fecha_eliminacion.strftime('%Y-%m-%d %H:%M')}"
