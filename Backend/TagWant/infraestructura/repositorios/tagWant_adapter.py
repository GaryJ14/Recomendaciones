#Se encarga de hablar con la base de datos 
# Implementa el adaptador que conecta el servicio con el modelo Django. PARTE 4
# tagWant_adapter.py

from typing import List, Optional
from Backend.TagWant.dominio.entidades.tagWant_modelo import Etiqueta as EtiquetaEntidad, ContenidoEtiqueta as ContenidoEtiquetaEntidad
from Backend.TagWant.dominio.repositorios.tagWant_port import EtiquetaRepositorio, ContenidoEtiquetaRepositorio
from Backend.TagWant.infraestructura.models import ContenidoEtiqueta, Etiqueta as EtiquetaModel
from Backend.TagWant.infraestructura.models import ContenidoEtiqueta as ContenidoEtiquetaModel
from Backend.WantMusic.infraestructura.models import Contenido as ContenidoModel

class EtiquetaRepositorioImpl(EtiquetaRepositorio):
    def obtener_por_nombre(self, nombre: str) -> Optional[EtiquetaEntidad]:
        try:
            etiqueta_model = EtiquetaModel.objects.get(nombre=nombre.lower())  
            return self._map_model_to_entity(etiqueta_model)
        except EtiquetaModel.DoesNotExist:
            return None

    def guardar(self, etiqueta: EtiquetaEntidad) -> EtiquetaEntidad:
    # Normalizar el nombre a minúsculas y sin espacios al inicio o final
        etiqueta.nombre = etiqueta.nombre.strip().lower()
        
        etiqueta_model = EtiquetaModel(
            id=etiqueta.id,
            nombre=etiqueta.nombre
        )
        etiqueta_model.save()
        return self._map_model_to_entity(etiqueta_model)


    def obtener_por_id(self, id: int) -> Optional[EtiquetaEntidad]:
        try:
            etiqueta_model = EtiquetaModel.objects.get(pk=id)
            return self._map_model_to_entity(etiqueta_model)
        except EtiquetaModel.DoesNotExist:
            return None

    def obtener_todas(self) -> List[EtiquetaEntidad]:
        etiquetas = EtiquetaModel.objects.all()
        return [self._map_model_to_entity(e) for e in etiquetas]

    def eliminar(self, id: int) -> None:
        EtiquetaModel.objects.filter(pk=id).delete()

    def actualizar(self, etiqueta: EtiquetaEntidad) -> EtiquetaEntidad:
        etiqueta_model = EtiquetaModel.objects.get(pk=etiqueta.id)
        etiqueta_model.nombre = etiqueta.nombre
        etiqueta_model.save()
        return self._map_model_to_entity(etiqueta_model)

    def _map_model_to_entity(self, model: EtiquetaModel) -> EtiquetaEntidad:
        return EtiquetaEntidad(
            id=model.id,
            nombre=model.nombre
        )


class ContenidoEtiquetaRepositorioImpl(ContenidoEtiquetaRepositorio):
    def crear_relacion(self, contenido_id: int, etiqueta_id: int) -> None:
        contenido = ContenidoModel.objects.get(id=contenido_id)
        etiqueta = EtiquetaModel.objects.get(id=etiqueta_id)
        ContenidoEtiquetaModel.objects.get_or_create(contenido=contenido, etiqueta=etiqueta)

    def eliminar_relacion(self, contenido_id: int, etiqueta_id: int) -> None:
        ContenidoEtiquetaModel.objects.filter(contenido_id=contenido_id, etiqueta_id=etiqueta_id).delete()

    def obtener_etiquetas_por_contenido(self, contenido_id: int) -> List[EtiquetaEntidad]:
        relaciones = ContenidoEtiquetaModel.objects.filter(contenido_id=contenido_id)
        return [self._map_model_to_entity(rel.etiqueta) for rel in relaciones]

    def obtener_contenidos_por_etiqueta(self, etiqueta_id: int):
        # Obtener los contenidos relacionados con la etiqueta
        relaciones = ContenidoEtiquetaModel.objects.filter(etiqueta_id=etiqueta_id)
        return [rel.contenido for rel in relaciones]
    def obtener_relaciones_por_etiquetas(self, etiquetas_ids):
        return ContenidoEtiquetaModel.objects.filter(etiqueta_id__in=etiquetas_ids)


    def _map_model_to_entity(self, model: EtiquetaModel) -> EtiquetaEntidad:
        return EtiquetaEntidad(
            id=model.id,
            nombre=model.nombre
        )

