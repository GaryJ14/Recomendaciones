# Se crea el servicio de la aplicación, que contiene la lógica de negocio y se comunica con los repositorios.
# No accede a modelos de Django, solo usa la interfaz WantMusicRepositorioPort. 
#PARTE 3
import random
from django.utils import timezone

import os
import uuid
from datetime import datetime
from django.contrib.auth.hashers import check_password
from typing import List, Optional, Dict, Union
from Backend.TagWant.dominio.repositorios.tagWant_port import *
from Backend.TagWant.dominio.entidades.tagWant_modelo import *
from Backend.WantMusic.dominio.entidades.wantMusic_modelo import *
from Backend.WantMusic.dominio.repositorios.wantMusic_port import *
from Backend.WantAdministrator.infraestructura.repositorios.wantAdministrator_adapter import ContenidoEliminadoRepositorioImpl
from Backend.WantAdministrator.aplicacion.servicios.wantAdministrator_servicio import ContenidoEliminadoServicio
from Backend.WantAdministrator.infraestructura.repositorios.wantAdministrator_adapter import ContenidoEliminadoRepositorioImpl
from Backend.WantAdministrator.dominio.entidades.wantAdministrator_modelo import ContenidoEliminado as EntidadContenidoEliminado
from Backend.WantMusic.infraestructura.models import Contenido as ContenidoModel, Favorito as FavoritoModel
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist

from Backend.WantMusic.infraestructura.models import Favorito
from SistemaRecomendaciones import settings

class WantMusicServicio:
    def __init__(self, usuario_repo: UsuarioRepositorio, historial_repo: HistorialReproduccionRepositorio, contenido_repo: ContenidoRepositorio):
        self.usuario_repo = usuario_repo
        self.historial_repo = historial_repo
        self.contenido_repo = contenido_repo
        self.repo_adm = ContenidoEliminadoRepositorioImpl()
        self.servicio_adm = ContenidoEliminadoServicio(self.repo_adm)



#------------------ ---------------- USUARIO  -------------------------------

    def registrar_usuario(self, nombre, email, password):
        existente = self.usuario_repo.obtener_por_email(email)
        if existente:
            raise Exception("El usuario ya existe")
        
        nuevo_usuario = Usuario(None, nombre, email, password)
        usuario_guardado = self.usuario_repo.guardar(nuevo_usuario)
        return usuario_guardado  # debe retornar la instancia del modelo Django, no un objeto dominio


 
    def autenticar_usuario(self, email, password):
        usuario = self.usuario_repo.obtener_por_email(email)
        if usuario and check_password(password, usuario.password):
            return usuario
        return None
    def obtener_usuario_por_id(self, id):
        usuario = self.usuario_repo.obtener_por_id(id)
        if not usuario:
            raise Exception("Usuario no encontrado")
        return usuario
    def obtener_todos_usuarios(self):
        return self.usuario_repo.obtener_todos()
    def eliminar_usuario(self, id):
        usuario = self.usuario_repo.obtener_por_id(id)
        if not usuario:
            raise Exception("Usuario no encontrado")
        self.usuario_repo.eliminar(id)
    def actualizar_usuario(self, id, nombre, email, password, is_active):
        usuario = self.usuario_repo.obtener_por_id(id)
        if not usuario:
            raise Exception("Usuario no encontrado")

        usuario.nombre = nombre
        usuario.email = email
        usuario.password = password
        usuario.is_active = is_active

        return self.usuario_repo.actualizar(usuario)
    def suspender_usuario(self, usuario_id: int):
        usuario = self.usuario_repo.obtener_por_id(usuario_id)
        if not usuario:
            raise Exception("Usuario no encontrado")
        usuario.is_active = False
        self.usuario_repo.actualizar(usuario)

    def agregar_historial(self, usuario_id: int, contenido_id: int, duracion_visto: int = None):
        if self.historial_repo is None:
            raise Exception("Repositorio de historial no configurado")
        historial = HistorialReproduccion(usuario_id, contenido_id, duracion_visto=duracion_visto)
        return self.historial_repo.agregar_historial(historial)

    def obtener_historial_usuario(self, usuario_id: int):
        if self.historial_repo is None:
            raise Exception("Repositorio de historial no configurado")
        return self.historial_repo.listar_por_usuario(usuario_id)
    
    def eliminar_historial(self, usuario_id, contenido_id):
        # Lógica de negocio (si la hay) para validar la eliminación
        return self.historial_repo.eliminar_historial(usuario_id, contenido_id)
    def obtener_recomendaciones_aleatorias(self, cantidad: int = 10):
        contenidos = self.contenido_repo.listar_todos()
        random.shuffle(contenidos)
        return contenidos[:cantidad]

class ContenidoServicio:
    def __init__(self, contenido_repo, etiqueta_repo, repositorio_relacion, usuario_etiqueta_repo=None, historial_repo=None):
        self.contenido_repo = contenido_repo
        self.etiqueta_repo = etiqueta_repo
        self.repositorio_relacion = repositorio_relacion
        self.usuario_etiqueta_repo = usuario_etiqueta_repo  # Ahora se pasa como parámetro
        self.historial_repo = historial_repo  # Ahora se pasa como parámetro
        self.repo_adm = ContenidoEliminadoRepositorioImpl()
        self.servicio_adm = ContenidoEliminadoServicio(self.repo_adm)

    def crear_contenido_con_etiquetas(self, datos, archivo):
        contenido_dominio = Contenido(
            id=None,
            titulo=datos['titulo'],
            tipo=datos['tipo'],
            url='',
            subido_por=datos['subido_por']
        )

        contenido_guardado = self.contenido_repo.guardar(contenido_dominio, archivo)

        etiquetas_nombres = datos.get('etiquetas', [])
        for nombre in etiquetas_nombres:
            etiqueta = self.etiqueta_repo.obtener_por_nombre(nombre)
            if not etiqueta:
                etiqueta = self.etiqueta_repo.guardar(Etiqueta(nombre=nombre))
            self.repositorio_relacion.crear_relacion(contenido_guardado.id, etiqueta.id)

        return contenido_guardado

    def listar_contenidos(self):
        return self.contenido_repo.listar_todos()

    def obtener_contenido(self, contenido_id):
        return self.contenido_repo.obtener_por_id(contenido_id)

    def listar_por_tipo(self, tipo: str) -> List[Contenido]:
        if tipo not in ['audio', 'video']:
            return []
        return self.contenido_repo.listar_por_tipo(tipo)

    
    def actualizar_contenido(self, contenido, datos, archivo=None):
        if 'titulo' in datos:
            contenido.titulo = datos['titulo']
        if 'tipo' in datos:
            contenido.tipo = datos['tipo']

        # Si hay archivo nuevo, guardar y actualizar URL
        if archivo:
            url_archivo = self.contenido_repo.guardar_archivo_multimedia(contenido.tipo, archivo)
            contenido.url = url_archivo

        # Guardar cambios en contenido
        contenido = self.contenido_repo.guardar(contenido)

        # Actualizar etiquetas si vienen
        etiquetas_nombres = datos.get('etiquetas', None)
        if etiquetas_nombres is not None:
            # Eliminar relaciones anteriores
            relaciones_previas = self.repositorio_relacion.obtener_etiquetas_por_contenido(contenido.id)
            for etiqueta in relaciones_previas:
                self.repositorio_relacion.eliminar_relacion(contenido.id, etiqueta.id)

            # Crear nuevas relaciones con normalización para evitar duplicados
            for nombre in etiquetas_nombres:
                nombre_normalizado = nombre.strip().lower()  # Normaliza nombre
                etiqueta = self.etiqueta_repo.obtener_por_nombre(nombre_normalizado)
                if not etiqueta:
                    etiqueta = self.etiqueta_repo.guardar(Etiqueta(nombre=nombre_normalizado))
                self.repositorio_relacion.crear_relacion(contenido.id, etiqueta.id)

        return contenido
    def buscar_contenido(self, query: str):
        # Filtrar el contenido por título o etiquetas
        return ContenidoModel.objects.filter(
            Q(titulo__icontains=query) |
            Q(contenido_etiquetas__etiqueta__nombre__icontains=query)
        ).distinct() 
    def eliminar_contenido(self, contenido_id: int, usuario_eliminador, motivo: str = None):
        contenido = self.contenido_repo.obtener_por_id(contenido_id)
        if not contenido:
            raise Exception("Contenido no encontrado")
        
        if contenido.eliminado:
            raise Exception("Contenido ya eliminado")

        contenido.eliminado = True
        contenido.fecha_eliminacion = datetime.now()
        contenido.motivo_eliminacion = motivo
        self.contenido_repo.guardar(contenido)

        entidad = EntidadContenidoEliminado(
            contenido_id=contenido.id,
            fecha_eliminacion=contenido.fecha_eliminacion,
            motivo=motivo,
            eliminado_por_id=usuario_eliminador.id
        )
        servicio_adm = ContenidoEliminadoServicio(ContenidoEliminadoRepositorioImpl())
        servicio_adm.crear_eliminacion(entidad)
    
    def listar_contenidos_eliminados(self):
        return self.contenido_repo.listar_eliminados()
    def listar_contenidos_por_etiquetas(self, etiquetas_ids: list[int]):
        # Filtrar los contenidos que están relacionados con las etiquetas
        contenidos = ContenidoModel.objects.filter(
            contenido_etiquetas__etiqueta_id__in=etiquetas_ids,  # Usamos la relación 'contenido_etiquetas' para acceder a las etiquetas
            eliminado=False  # Filtramos contenidos que no están eliminados
        ).distinct()  # Usamos 'distinct' para evitar duplicados debido a la relación muchos a muchos

        return contenidos

    def obtener_contenidos_recomendados(self, usuario_id: int):
        etiquetas_favoritas = self.obtener_etiquetas_favoritas(usuario_id)

        if not etiquetas_favoritas:
            return []  # Si no hay etiquetas favoritas, retornar lista vacía

        # Filtrar los contenidos que están asociados a las etiquetas favoritas
        contenidos_recomendados = self.contenido_repo.listar_contenidos_por_etiquetas(etiquetas_favoritas)
        return contenidos_recomendados
    def obtener_etiquetas_favoritas(self, usuario_id: int):
        # Este método está ahora en UsuarioEtiquetaFavoritaServicio, así que no lo necesitas aquí.
        pass

# usuario con etiquetas favoritas
class UsuarioEtiquetaFavoritaServicio:
    def __init__(self, repo: UsuarioEtiquetaFavoritaRepositorio):
        self.repo = repo

    def obtener_favoritas(self, usuario_id: int):
        return self.repo.listar_favoritas_por_usuario(usuario_id)

    def agregar_favorita(self, usuario_id: int, etiqueta_id: int):
        favorita = UsuarioEtiquetaFavorita(usuario_id=usuario_id, etiqueta_id=etiqueta_id)
        return self.repo.agregar_favorita(favorita)

    def eliminar_favorita(self, usuario_id: int, etiqueta_id: int):
        self.repo.eliminar_favorita(usuario_id, etiqueta_id)

    def actualizar_favorita(self, usuario_id: int, etiqueta_id_vieja: int, etiqueta_id_nueva: int):
        self.repo.eliminar_favorita(usuario_id, etiqueta_id_vieja)
        favorita_nueva = UsuarioEtiquetaFavorita(usuario_id, etiqueta_id_nueva)
        return self.repo.agregar_favorita(favorita_nueva)



class FavoritoService:
    @staticmethod
    def agregar_favorito(usuario, contenido_id):
        contenido = ContenidoModel.objects.get(id=contenido_id) 
        favorito, creado = FavoritoModel.objects.get_or_create(usuario=usuario, contenido=contenido)
        return favorito, creado

    @staticmethod
    def eliminar_favorito(usuario, contenido_id):
        try:
            favorito = Favorito.objects.get(usuario=usuario, contenido_id=contenido_id)
            favorito.delete()
            return True
        except ObjectDoesNotExist:
            raise Exception("Favorito no encontrado")

    @staticmethod
    def es_favorito(usuario, contenido_id):
        return FavoritoModel.objects.filter(usuario=usuario, contenido_id=contenido_id).exists()

    @staticmethod
    def obtener_favoritos(usuario):
        return FavoritoModel.objects.filter(usuario=usuario).select_related('contenido')

class RecomendacionesPorBusquedaServicio:
    def __init__(self, historial_busqueda_repo, contenido_repo):
        self.historial_busqueda_repo = historial_busqueda_repo
        self.contenido_repo = contenido_repo

    def obtener_recomendaciones_por_busqueda(self, usuario_id: int):
        # Obtener los términos de búsqueda previos del usuario
        historial_busquedas = self.historial_busqueda_repo.filter(usuario_id=usuario_id)

        # Extraer los términos de búsqueda
        terminos_busqueda = [busqueda.termino_busqueda for busqueda in historial_busquedas]

        if not terminos_busqueda:
            return []  # Si no hay historial de búsquedas, no recomendar nada

        # Buscar contenidos que coincidan con los términos de búsqueda
        contenidos_recomendados = []
        for termino in terminos_busqueda:
            contenidos = self.contenido_repo.buscar_por_titulo_o_etiqueta(termino)
            contenidos_recomendados.extend(contenidos)

        # Eliminar duplicados
        contenidos_recomendados = list(set(contenidos_recomendados))

        return contenidos_recomendados
