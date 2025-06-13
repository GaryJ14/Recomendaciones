# administratorWant_adapter.py

from Backend.AdministratorWant.dominio.repositorios.administratorWant_port import EstadisticaUsuarioRepositorio
from Backend.AdministratorWant.infraestructura.models import EstadisticaUsuario

from dominio.entidades.administratorWant_modelo import EstadisticaUsuario
from infraestructura.models import EstadisticaUsuarioORM

class EstadisticaUsuarioRepositorioORM:
    def guardar(self, estadistica_dominio: EstadisticaUsuario) -> EstadisticaUsuario:
        orm = EstadisticaUsuarioORM(
            total_usuarios=estadistica_dominio.total_usuarios,
            total_activos=estadistica_dominio.total_activos,
            fecha_registro=estadistica_dominio.fecha_registro
        )
        orm.save()
        return EstadisticaUsuario(
            total_usuarios=orm.total_usuarios,
            total_activos=orm.total_activos,
            fecha_registro=orm.fecha_registro
        )

    def obtener_ultimo(self) -> EstadisticaUsuario:
        orm = EstadisticaUsuarioORM.objects.order_by('-fecha_registro').first()
        if orm is None:
            return None
        return EstadisticaUsuario(
            total_usuarios=orm.total_usuarios,
            total_activos=orm.total_activos,
            fecha_registro=orm.fecha_registro
        )
        estad = EstadisticaUsuario(total_usuarios=total_usuarios, total_activos=total_activos)
        estad.save()
        return estad



