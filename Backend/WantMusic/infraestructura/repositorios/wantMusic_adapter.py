#Se encarga de hablar con la base de datos 
# Implementa el adaptador que conecta el servicio con el modelo Django. PARTE 4
import os
from time import timezone
import uuid
import datetime
from django.conf import settings
from typing import List, Optional
from django.core.files.storage import default_storage
from Backend.WantMusic.dominio.repositorios.wantMusic_port import *
from Backend.WantMusic.dominio.entidades.wantMusic_modelo import Usuario as UsuarioDominio
from Backend.WantMusic.dominio.entidades.wantMusic_modelo import Contenido as ContenidoDominio
from Backend.WantMusic.infraestructura.models import Usuario as UsuarioModel
from Backend.WantMusic.infraestructura.models import Contenido as ContenidoModel
from Backend.WantMusic.dominio.repositorios.wantMusic_port import UsuarioEtiquetaFavoritaRepositorio
from Backend.WantMusic.dominio.entidades.wantMusic_modelo import UsuarioEtiquetaFavorita as UsuarioEtiquetaFavoritaDominio
from Backend.WantMusic.infraestructura.models import UsuarioEtiquetaFavorita as UsuarioEtiquetaFavoritaModel
from Backend.WantAdministrator.infraestructura.models import ContenidoEliminado as ContenidoEliminadoModel
from Backend.WantMusic.infraestructura.models import UsuarioEtiquetaFavorita as UsuarioEtiquetaFavoritaModel
from Backend.WantMusic.dominio.entidades.wantMusic_modelo import UsuarioEtiquetaFavorita as UsuarioEtiquetaFavoritaEntidad
from Backend.WantMusic.infraestructura.models import UsuarioEtiquetaFavorita as UsuarioEtiquetaFavoritaModel
from Backend.WantMusic.dominio.repositorios.wantMusic_port import HistorialReproduccionRepositorio
from Backend.WantMusic.dominio.entidades.wantMusic_modelo import HistorialReproduccion as HistorialDominio
from Backend.WantMusic.infraestructura.models import HistorialReproduccion as HistorialModel
from Backend.WantMusic.infraestructura.models import HistorialReproduccion as HistorialReproduccionModel
from Backend.WantMusic.dominio.entidades.wantMusic_modelo import HistorialReproduccion as HistorialReproduccionEntidad

from django.contrib.auth.hashers import make_password
class UsuarioRepositorioORM(UsuarioRepositorio):
    def obtener_por_email(self, email: str):
        try:
            user = UsuarioModel.objects.get(email=email)
            return UsuarioDominio(
                user.id, 
                user.nombre, 
                user.email, 
                user.password, 
                user.is_active, 
                user.is_staff, 
                user.is_superuser  
            )
        except UsuarioModel.DoesNotExist:
            return None

    def guardar(self, usuario: UsuarioDominio):
        user = UsuarioModel(
            id=usuario.id,
            nombre=usuario.nombre,
            email=usuario.email,
            is_active=usuario.is_active,
            is_staff=usuario.is_staff,
            is_superuser=usuario.is_superuser 
        )
        user.set_password(usuario.password)
        user.save()
        return user
    def obtener_por_id(self, id: int):
        try:
            user = UsuarioModel.objects.get(id=id)
            return UsuarioDominio(
                id=user.id,
                nombre=user.nombre,
                email=user.email,
                password=user.password,
                is_active=user.is_active,
                is_staff=user.is_staff,
                is_superuser=user.is_superuser
            )
        except UsuarioModel.DoesNotExist:
            return None
    def obtener_todos(self):
        usuarios = UsuarioModel.objects.all()
        return [
            UsuarioDominio(
                user.id, 
                user.nombre, 
                user.email, 
                user.password, 
                user.is_active, 
                user.is_staff, 
                user.is_superuser  
            ) for user in usuarios
        ]
    def eliminar(self, id: int):
        try:
            user = UsuarioModel.objects.get(id=id)
            user.delete()
        except UsuarioModel.DoesNotExist:
            raise Exception("Usuario no encontrado")
    def actualizar(self, usuario_dominio: UsuarioDominio):
        user = UsuarioModel.objects.get(id=usuario_dominio.id)
        user.nombre = usuario_dominio.nombre
        user.email = usuario_dominio.email
        user.is_active = usuario_dominio.is_active

        # Solo actualizar contraseña si viene
        if usuario_dominio.password:
            if not usuario_dominio.password.startswith("pbkdf2_"):
                user.set_password(usuario_dominio.password)

        user.save()
        return usuario_dominio


class ContenidoRepositorioImpl:
    """Adaptador para el repositorio de contenido multimedia."""

    def guardar_archivo_multimedia(self, tipo: str, archivo) -> str:
        """Guarda el archivo multimedia en el servidor y genera la URL relativa."""
        hoy = datetime.date.today()
        subcarpeta = f"{hoy.year}/{hoy.month:02d}"
        ruta_carpeta = os.path.join(settings.MEDIA_ROOT, tipo, subcarpeta)
        os.makedirs(ruta_carpeta, exist_ok=True)

        nombre_archivo = f"{uuid.uuid4()}_{archivo.name}"
        ruta_completa = os.path.join(ruta_carpeta, nombre_archivo)

        # Guardar archivo solo si no existe
        if not default_storage.exists(ruta_completa):
            with open(ruta_completa, 'wb+') as destino:
                for chunk in archivo.chunks():
                    destino.write(chunk)

        # Generar la URL relativa del archivo guardado
        url_relativa = f"{settings.MEDIA_URL}{tipo}/{subcarpeta}/{nombre_archivo}"
        return url_relativa

    def guardar(self, contenido: ContenidoDominio, archivo=None) -> ContenidoDominio:
        if archivo:
            url_archivo = self.guardar_archivo_multimedia(contenido.tipo, archivo)
        else:
            url_archivo = contenido.url

        if contenido.id:
            contenido_model = ContenidoModel.objects.get(pk=contenido.id)
            contenido_model.titulo = contenido.titulo
            contenido_model.tipo = contenido.tipo
            contenido_model.url = url_archivo
            contenido_model.subido_por_id = contenido.subido_por.id if contenido.subido_por else None
            
            # NUEVOS CAMPOS para eliminación lógica:
            if hasattr(contenido, 'eliminado'):
                contenido_model.eliminado = contenido.eliminado
            if hasattr(contenido, 'fecha_eliminacion'):
                contenido_model.fecha_eliminacion = contenido.fecha_eliminacion
            if hasattr(contenido, 'motivo_eliminacion'):
                contenido_model.motivo_eliminacion = contenido.motivo_eliminacion

            contenido_model.save()
        else:
            contenido_model = ContenidoModel.objects.create(
                titulo=contenido.titulo,
                tipo=contenido.tipo,
                url=url_archivo,
                subido_por_id=contenido.subido_por.id if contenido.subido_por else None,
                # si quieres, aquí puedes incluir eliminado=False por defecto
            )
        return self._mapear_a_entidad(contenido_model)

    def eliminar(self, contenido_id: int) -> bool:
        try:
            contenido = ContenidoModel.objects.get(id=contenido_id)
            contenido.eliminado = True
            contenido.fecha_eliminacion = timezone.now()
            contenido.save()
            # No borramos el registro físico
            return True
        except ContenidoModel.DoesNotExist:
            raise Exception("Contenido no encontrado")
        



    def obtener_por_id(self, contenido_id: int):
        try:
            return ContenidoModel.objects.get(pk=contenido_id)  # ORM instance
        except ContenidoModel.DoesNotExist:
            return None


    def listar_todos(self) -> list[ContenidoDominio]:
        modelos = ContenidoModel.objects.filter(eliminado=False).order_by('-fecha_subida')
        return [self._mapear_a_entidad(modelo) for modelo in modelos]
    

    def listar_por_tipo(self, tipo: str) -> list[ContenidoDominio]:
        """Lista los contenidos multimedia por tipo (audio o video)."""
        modelos = ContenidoModel.objects.filter(tipo=tipo).order_by('-fecha_subida')
        return [self._mapear_a_entidad(modelo) for modelo in modelos]
#Buscador de contenidos por nombres
    def buscar_por_titulo_o_etiqueta(self, query: str):
        return ContenidoModel.objects.filter(titulo__icontains=query)
    
    def listar_eliminados(self):
        eliminados = ContenidoEliminadoModel.objects.select_related('contenido').all().order_by('-fecha_eliminacion')
        resultados = []
        for eliminado in eliminados:
            contenido = eliminado.contenido
            contenido_dominio = self._mapear_a_entidad(contenido)
            contenido_dominio.eliminado = True
            contenido_dominio.motivo_eliminacion = eliminado.motivo
            contenido_dominio.fecha_eliminacion = eliminado.fecha_eliminacion
            resultados.append(contenido_dominio)
        return resultados

    def _mapear_con_eliminacion(self, eliminado_model):
        contenido = eliminado_model.contenido
        # Aquí construyes un objeto ContenidoDominio incluyendo campos de eliminación si quieres
        return ContenidoDominio(
            id=contenido.id,
            titulo=contenido.titulo,
            tipo=contenido.tipo,
            url=contenido.url,
            eliminado=True,
            # Otros campos...
            # Puedes agregar motivo y fecha de eliminado extraídos de eliminado_model
        )

    def _mapear_a_entidad(self, modelo: ContenidoModel) -> ContenidoDominio:
        """Convierte un modelo de Django a un objeto de dominio."""
        
        # Obtén las etiquetas relacionadas con el contenido
        etiquetas = [etiqueta.etiqueta.nombre for etiqueta in modelo.contenido_etiquetas.all()]
        
        return ContenidoDominio(
            id=modelo.id,
            titulo=modelo.titulo,
            tipo=modelo.tipo,
            url=modelo.url,
            subido_por=UsuarioDominio(
                id=modelo.subido_por.id,
                nombre=modelo.subido_por.nombre,
                email=modelo.subido_por.email,
                password=modelo.subido_por.password,
                is_active=modelo.subido_por.is_active,
                is_staff=modelo.subido_por.is_staff,
                is_superuser=modelo.subido_por.is_superuser
            ) if modelo.subido_por else None,
            etiquetas=etiquetas,  # Agregar las etiquetas aquí
            eliminado=modelo.eliminado
        )

    def listar_contenidos(self) -> List[ContenidoDominio]:
        """Lista todos los contenidos, incluyendo los relacionados con etiquetas favoritas"""
        # Asegúrate de usar la relación 'contenido_etiquetas' para filtrar correctamente
        return ContenidoModel.objects.filter(eliminado=False).prefetch_related('contenido_etiquetas')

    def listar_contenidos_por_etiquetas(self, etiquetas_ids: list[int]) -> List[ContenidoDominio]:
        """Filtra los contenidos basados en las etiquetas del usuario"""
        return ContenidoModel.objects.filter(
            contenido_etiquetas__etiqueta_id__in=etiquetas_ids,
            eliminado=False
        )
    def buscar_por_titulo_o_etiqueta(self, query: str):
        """
        Buscar contenidos por título o por etiquetas.
        """
        # Buscar por título
        contenidos_por_titulo = ContenidoModel.objects.filter(titulo__icontains=query)

        # Buscar por etiquetas utilizando la relación Many-to-Many
        contenidos_por_etiquetas = ContenidoModel.objects.filter(etiquetas__nombre__icontains=query)

        # Combina ambos resultados y elimina duplicados
        contenidos = contenidos_por_titulo | contenidos_por_etiquetas
        return contenidos.distinct()

class UsuarioEtiquetaFavoritaRepositorioImpl(UsuarioEtiquetaFavoritaRepositorio):

    def listar_favoritas_por_usuario(self, usuario_id: int):
        return UsuarioEtiquetaFavoritaModel.objects.filter(usuario_id=usuario_id)

    def listar_todas_favoritas(self):
        return UsuarioEtiquetaFavoritaModel.objects.all()

    def agregar_favorita(self, favorita_dominio):
        # Aquí deberías mapear de dominio a modelo, ejemplo simplificado:
        modelo = UsuarioEtiquetaFavoritaModel(
            usuario_id=favorita_dominio.usuario_id,
            etiqueta_id=favorita_dominio.etiqueta_id,
        )
        modelo.save()
        return modelo

    def eliminar_favorita(self, usuario_id, etiqueta_id):
        UsuarioEtiquetaFavoritaModel.objects.filter(usuario_id=usuario_id, etiqueta_id=etiqueta_id).delete()
    
    def listar_todas_favoritas(self):
        modelos = UsuarioEtiquetaFavoritaModel.objects.all()
        # Mapear modelos a entidades dominio si quieres
        return [self._mapear_a_entidad(m) for m in modelos]

    def _mapear_a_entidad(self, modelo):
        return UsuarioEtiquetaFavorita(
            usuario_id=modelo.usuario_id,
            etiqueta_id=modelo.etiqueta_id
        )


class HistorialRepositorioImpl(HistorialReproduccionRepositorio):
    def agregar_historial(self, historial: HistorialReproduccion) -> HistorialReproduccion:
        historial_model = HistorialReproduccionModel(
            usuario_id=historial.usuario_id,
            contenido_id=historial.contenido_id,
            fecha_reproduccion=historial.fecha_reproduccion,
            duracion_visto=historial.duracion_visto
        )
        historial_model.save()
        # Aquí deberías devolver el objeto mapeado a la entidad
        return self._mapear_a_entidad(historial_model)

    def listar_por_usuario(self, usuario_id: int) -> List[HistorialReproduccion]:
        historial_models = HistorialReproduccionModel.objects.filter(usuario_id=usuario_id)
        return [self._mapear_a_entidad(h) for h in historial_models]

    def eliminar_historial(self, usuario_id, contenido_id):
        try:
            historial = HistorialReproduccionModel.objects.get(usuario_id=usuario_id, contenido_id=contenido_id)
            historial.delete()
            return True
        except HistorialReproduccionModel.DoesNotExist:
            return False  # El historial no existe
        except Exception as e:
            # Aquí se puede registrar el error
            print(f"Error al eliminar historial: {e}")
            return False  # En caso de algún otro error, devolvemos False

    def _mapear_a_entidad(self, modelo: HistorialReproduccionModel) -> HistorialReproduccion:
        return HistorialReproduccion(
            usuario_id=modelo.usuario_id,
            contenido_id=modelo.contenido_id,
            fecha_reproduccion=modelo.fecha_reproduccion,
            duracion_visto=modelo.duracion_visto
        )
