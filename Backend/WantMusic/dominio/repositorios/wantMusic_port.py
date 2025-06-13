#Interfaz que abstrae las operaciones sobre usuarios y contenidos
# Define la interfaz (puerto) del repositorio que usará el servicio. PASO 2

from abc import ABC, abstractmethod
from typing import List, Optional
from Backend.WantMusic.dominio.entidades.wantMusic_modelo import *

class UsuarioRepositorio(ABC):
    @abstractmethod
    def obtener_por_email(self, email: str) -> Usuario:
        pass

    @abstractmethod
    def guardar(self, usuario: Usuario) -> Usuario:
        pass
    
    @abstractmethod
    def obtener_por_id(self, id: int) -> Usuario:
        pass
    
    @abstractmethod
    def obtener_todos(self) -> List[Usuario]:
        pass
    
    @abstractmethod
    def eliminar(self, id: int) -> None:
        pass
    
    @abstractmethod
    def actualizar(self, usuario: Usuario) -> Usuario:
        pass



class ContenidoRepositorio(ABC):
    @abstractmethod
    def guardar(self, contenido: Contenido) -> Contenido:
        """Guarda o actualiza un contenido multimedia."""
        pass
    
    @abstractmethod
    def obtener_por_id(self, contenido_id: int) -> Optional[Contenido]:
        """Obtiene un contenido por ID, incluye eliminados si necesario."""
        pass
    
    @abstractmethod
    def listar_todos(self, incluir_eliminados: bool = False) -> List[Contenido]:
        """Lista contenidos, por defecto sin eliminados."""
        pass
    
    @abstractmethod
    def listar_por_tipo(self, tipo: str, incluir_eliminados: bool = False) -> List[Contenido]:
        """Lista por tipo, opcional incluir eliminados."""
        pass
    
    @abstractmethod
    def eliminar(self, contenido_id: int, motivo: Optional[str] = None) -> bool:
        """Marca el contenido como eliminado (eliminación lógica)."""
        pass

    @abstractmethod
    def restaurar(self, contenido_id: int) -> bool:
        """Restaura un contenido previamente eliminado."""
        pass
    @abstractmethod
    def listar_contenidos_por_etiquetas(self, etiquetas_ids: list[int]) -> List[Contenido]:
        pass


class UsuarioEtiquetaFavoritaRepositorio(ABC):
    @abstractmethod
    def agregar_favorita(self, favorita: UsuarioEtiquetaFavorita) -> UsuarioEtiquetaFavorita:
        pass

    @abstractmethod
    def eliminar_favorita(self, usuario_id: int, etiqueta_id: int) -> None:
        pass

    @abstractmethod
    def listar_favoritas_por_usuario(self, usuario_id: int) -> List[UsuarioEtiquetaFavorita]:
        pass


class HistorialReproduccionRepositorio(ABC):
    @abstractmethod
    def agregar_historial(self, historial: HistorialReproduccion) -> HistorialReproduccion:
        pass

    @abstractmethod
    def listar_por_usuario(self, usuario_id: int) -> List[HistorialReproduccion]:
        pass    

    @abstractmethod
    def eliminar_historial(self, usuario_id, contenido_id):
        pass
