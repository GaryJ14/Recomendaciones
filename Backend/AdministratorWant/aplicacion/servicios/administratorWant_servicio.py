# AdministratorWant_Servicio
# Backend/AdministratorWant/aplicacion/servicios/estadisticas_servicio.py
from Backend.WantMusic.dominio.repositorios.usuario_repositorio import UsuarioRepositorio
from Backend.WantMusic.dominio.repositorios.contenido_repositorio import ContenidoRepositorio
from Backend.TagWant.dominio.repositorios.etiqueta_repositorio import EtiquetaRepositorio
from Backend.AdministratorWant.dominio.repositorios.estadisticas_repositorio import EstadisticaUsuarioRepositorio, EstadisticaFavoritoRepositorio

class EstadisticasServicio:
    def __init__(self, usuario_repo: UsuarioRepositorio,
                 contenido_repo: ContenidoRepositorio,
                 etiqueta_repo: EtiquetaRepositorio,
                 estad_usuario_repo: EstadisticaUsuarioRepositorio,
                 estad_favorito_repo: EstadisticaFavoritoRepositorio):
        self.usuario_repo = usuario_repo
        self.contenido_repo = contenido_repo
        self.etiqueta_repo = etiqueta_repo
        self.estad_usuario_repo = estad_usuario_repo
        self.estad_favorito_repo = estad_favorito_repo

    def generar_estadisticas(self):
        total_usuarios = self.usuario_repo.contar_todos()
        total_activos = self.usuario_repo.contar_activos()

        self.estad_usuario_repo.guardar_total(total_usuarios, total_activos)

        etiqueta_favoritos = self.etiqueta_repo.obtener_por_nombre("Mis Favoritos")
        if etiqueta_favoritos:
            total_contenidos = self.contenido_repo.contar_por_etiqueta(etiqueta_favoritos.id)
        else:
            total_contenidos = 0

        self.estad_favorito_repo.guardar_total("Mis Favoritos", total_contenidos)
