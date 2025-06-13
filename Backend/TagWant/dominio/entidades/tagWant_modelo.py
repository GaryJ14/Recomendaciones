# INICIO DE LA CLASE TAG
# # Aquí se define la entidad de dominio, independiente de Django. INICIO
class Etiqueta:
    def __init__(self, nombre: str, id: int = None):
        self.id = id
        self.nombre = nombre

    def __str__(self):
        return self.nombre

class ContenidoEtiqueta:
    def __init__(self, contenido_id: int, etiqueta_id: int, id: int = None):
        self.id = id
        self.contenido_id = contenido_id
        self.etiqueta_id = etiqueta_id

    def __str__(self):
        return f"ContenidoEtiqueta: contenido_id={self.contenido_id}, etiqueta_id={self.etiqueta_id}"
