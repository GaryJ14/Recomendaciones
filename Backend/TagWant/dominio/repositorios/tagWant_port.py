# tagWant_port
# Paso 2
from abc import ABC, abstractmethod
from typing import List, Optional
from Backend.TagWant.dominio.entidades.tagWant_modelo import Etiqueta
from Backend.WantMusic.dominio.entidades.wantMusic_modelo import Contenido
class EtiquetaRepositorio(ABC):
    @abstractmethod
    def obtener_por_nombre(self, nombre: str) -> Optional[Etiqueta]:
        pass

    @abstractmethod
    def guardar(self, etiqueta: Etiqueta) -> Etiqueta:
        pass

    @abstractmethod
    def obtener_por_id(self, id: int) -> Optional[Etiqueta]:
        pass

    @abstractmethod
    def obtener_todas(self) -> List[Etiqueta]:
        pass

    @abstractmethod
    def eliminar(self, id: int) -> None:
        pass

    @abstractmethod
    def actualizar(self, etiqueta: Etiqueta) -> Etiqueta:
        pass

class ContenidoEtiquetaRepositorio(ABC):
    @abstractmethod
    def crear_relacion(self, contenido_id: int, etiqueta_id: int) -> None:
        pass

    @abstractmethod
    def eliminar_relacion(self, contenido_id: int, etiqueta_id: int) -> None:
        pass

    @abstractmethod
    def obtener_etiquetas_por_contenido(self, contenido_id: int) -> List[Etiqueta]:
        pass

    @abstractmethod
    def obtener_contenidos_por_etiqueta(self, etiqueta_id: int) -> List[Contenido]:
        pass