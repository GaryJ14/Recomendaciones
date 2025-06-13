#Aquí se define la entidad de dominio, independiente de Django. INICIO
class Usuario:
    def __init__(self, id, nombre, email, password, is_active=True, is_staff=False, is_superuser=False):
        self.id = id
        self.nombre = nombre
        self.email = email
        self.password = password
        self.is_active = is_active
        self.is_staff = is_staff
        self.is_superuser = is_superuser

    def verificar_password(self, password):
        # El hash se queda en la infraestructura
        return self.password == password

class Contenido:
    """Entidad de dominio para contenido multimedia."""
    
    def __init__(self,id=None,titulo="",tipo="", url="",etiquetas="",fecha_subida=None,subido_por=None,
        eliminado=False,fecha_eliminacion=None,motivo_eliminacion=None):
        self.id = id
        self.titulo = titulo
        self.tipo = tipo  # 'audio' o 'video'
        self.url = url
        self.etiquetas = etiquetas
        self.fecha_subida = fecha_subida
        self.subido_por = subido_por
        self.eliminado = eliminado
        self.motivo_eliminacion = motivo_eliminacion
        self.fecha_eliminacion = fecha_eliminacion
    def validar(self):
        """Validación de reglas de negocio para la entidad."""
        errores = []
        
        if not self.titulo:
            errores.append("El título es obligatorio")
        
        if self.tipo not in ['audio', 'video']:
            errores.append("El tipo debe ser 'audio' o 'video'")
        
        if not self.url:
            errores.append("La URL es obligatoria")
            
        return errores

class UsuarioEtiquetaFavorita:
    def __init__(self, usuario_id, etiqueta_id):
        self.usuario_id = usuario_id
        self.etiqueta_id = etiqueta_id

class HistorialReproduccion:
    def __init__(self, usuario_id, contenido_id, fecha_reproduccion=None, duracion_visto=None):
        self.usuario_id = usuario_id
        self.contenido_id = contenido_id
        self.fecha_reproduccion = fecha_reproduccion
        self.duracion_visto = duracion_visto


