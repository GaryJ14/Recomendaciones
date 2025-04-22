from django.db import models

class Etiqueta(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre


class ContenidoEtiqueta(models.Model):
    contenido = models.ForeignKey('WantMusic_infraestructura.Contenido', on_delete=models.CASCADE, related_name='etiquetas_tag')
    etiqueta = models.ForeignKey(Etiqueta, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('contenido', 'etiqueta')
