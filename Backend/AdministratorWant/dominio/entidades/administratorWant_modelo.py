from datetime import datetime

class EstadisticaUsuario:
    def __init__(self, total_usuarios: int, total_activos: int, fecha_registro: datetime):
        self.total_usuarios = total_usuarios
        self.total_activos = total_activos
        self.fecha_registro = fecha_registro


class EstadisticaFavorito:
    def __init__(self, etiqueta: str, total_contenidos: int, fecha_registro: datetime):
        self.etiqueta = etiqueta
        self.total_contenidos = total_contenidos
        self.fecha_registro = fecha_registro
