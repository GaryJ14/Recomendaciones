from django.db import models
from Backend.WantMusic.infraestructura.models import Contenido

class Etiqueta(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

class ContenidoEtiqueta(models.Model):
    contenido = models.ForeignKey(Contenido, on_delete=models.CASCADE, related_name='contenido_etiquetas')
    etiqueta = models.ForeignKey(Etiqueta, on_delete=models.CASCADE, related_name='contenido_etiquetas')

    class Meta:
        unique_together = ('contenido', 'etiqueta')
