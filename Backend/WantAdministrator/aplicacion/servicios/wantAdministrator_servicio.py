# Se crea el servicio de la aplicación, que contiene la lógica de negocio y se comunica con los repositorios.
# No accede a modelos de Django, solo usa la interfaz WantMusicRepositorioPort. 
#PARTE 3

from typing import List
from Backend.WantAdministrator.dominio.entidades.wantAdministrator_modelo import ContenidoEliminado
from Backend.WantAdministrator.dominio.repositorios.wantAdministrator_port import ContenidoEliminadoRepositorioPort

class ContenidoEliminadoServicio:
    def __init__(self, repo: ContenidoEliminadoRepositorioPort):
        self.repo = repo

    def crear_eliminacion(self, entidad: ContenidoEliminado):
        # Aquí la fecha se puede establecer antes o al crear la entidad
        if entidad.fecha_eliminacion is None:
            entidad.fecha_eliminacion = datetime.now()
        return self.repo.crear(entidad)
    def listar_eliminados(self) -> List[ContenidoEliminado]:
        return self.repo.listar_todos()

    def obtener_eliminado(self, id: int) -> ContenidoEliminado:
        return self.repo.obtener_por_id(id)

    def eliminar_registro(self, id: int) -> None:
        self.repo.eliminar(id)
