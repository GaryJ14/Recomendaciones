#Interfaz que abstrae las operaciones sobre usuarios:
#Define la interfaz (puerto) del repositorio que usará el servicio. PASO 2
from abc import ABC, abstractmethod
from typing import List
from Backend.WantAdministrator.dominio.entidades.wantAdministrator_modelo import ContenidoEliminado

class ContenidoEliminadoRepositorioPort(ABC):

    @abstractmethod
    def crear(self, entidad: ContenidoEliminado) -> ContenidoEliminado:
        pass

    @abstractmethod
    def listar_todos(self) -> List[ContenidoEliminado]:
        pass

    @abstractmethod
    def obtener_por_id(self, id: int) -> ContenidoEliminado:
        pass

    @abstractmethod
    def eliminar(self, id: int) -> None:
        pass

