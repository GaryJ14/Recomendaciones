#Se encarga de hablar con la base de datos 
# Implementa el adaptador que conecta el servicio con el modelo Django. PARTE 4

from Backend.WantAdministrator.infraestructura.models import ContenidoEliminado as ContenidoEliminadoModel
from Backend.WantAdministrator.dominio.entidades.wantAdministrator_modelo import ContenidoEliminado
from Backend.WantAdministrator.dominio.repositorios.wantAdministrator_port import ContenidoEliminadoRepositorioPort

class ContenidoEliminadoRepositorioImpl(ContenidoEliminadoRepositorioPort):

    def crear(self, entidad: ContenidoEliminado) -> ContenidoEliminado:
        modelo = ContenidoEliminadoModel.objects.create(
            contenido_id=entidad.contenido_id,
            fecha_eliminacion=entidad.fecha_eliminacion,
            motivo=entidad.motivo,
            eliminado_por_id=entidad.eliminado_por_id
        )
        entidad.id = modelo.id
        return entidad

    def listar_todos(self) -> list[ContenidoEliminado]:
        modelos = ContenidoEliminadoModel.objects.all().order_by('-fecha_eliminacion')
        return [
            ContenidoEliminado(
                id=m.id,
                contenido_id=m.contenido_id,
                fecha_eliminacion=m.fecha_eliminacion,
                motivo=m.motivo,
                eliminado_por_id=m.eliminado_por_id
            ) for m in modelos
        ]

    def obtener_por_id(self, id: int) -> ContenidoEliminado:
        m = ContenidoEliminadoModel.objects.get(id=id)
        return ContenidoEliminado(
            id=m.id,
            contenido_id=m.contenido_id,
            fecha_eliminacion=m.fecha_eliminacion,
            motivo=m.motivo,
            eliminado_por_id=m.eliminado_por_id
        )

    def eliminar(self, id: int) -> None:
        modelo = ContenidoEliminadoModel.objects.get(id=id)
        modelo.delete()

