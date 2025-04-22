from django.db import models

class EstadisticaUsuario(models.Model):
    total_usuarios = models.IntegerField()
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Estadística Usuarios: {self.total_usuarios}"


class EstadisticaFavorito(models.Model):
    total_favoritos = models.IntegerField()
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Estadística Favoritos: {self.total_favoritos}"
