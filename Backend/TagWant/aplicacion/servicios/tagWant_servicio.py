from Backend.TagWant.dominio.repositorios.tagWant_port import *
from Backend.WantMusic.dominio.repositorios.wantMusic_port import ContenidoRepositorio
from Backend.TagWant.dominio.entidades.tagWant_modelo import Etiqueta

class TagWantServicio:
    def __init__(self, etiqueta_repo: EtiquetaRepositorio, contenido_repo: ContenidoRepositorio, repositorio_relacion: ContenidoEtiquetaRepositorio):
        self.etiqueta_repo = etiqueta_repo
        self.contenido_repo = contenido_repo
        self.repositorio_relacion = repositorio_relacion

    def crear_etiqueta(self, nombre):
        nombre_normalizado = nombre.strip().lower()
        etiqueta_existente = self.etiqueta_repo.obtener_por_nombre(nombre_normalizado)
        if etiqueta_existente:
            raise Exception("La etiqueta ya existe")
        nueva_etiqueta = Etiqueta(nombre=nombre_normalizado)
        return self.etiqueta_repo.guardar(nueva_etiqueta)

    def obtener_etiqueta_por_id(self, id):
        etiqueta = self.etiqueta_repo.obtener_por_id(id)
        if not etiqueta:
            raise Exception("Etiqueta no encontrada")
        return etiqueta
    
    def listar_todas(self):
        return self.etiqueta_repo.obtener_todas()

    def eliminar_etiqueta(self, id): 
        etiqueta = self.etiqueta_repo.obtener_por_id(id)
        if not etiqueta:
            raise Exception("Etiqueta no encontrada")
        self.etiqueta_repo.eliminar(id)

    def actualizar_etiqueta(self, id, nombre):
        etiqueta = self.etiqueta_repo.obtener_por_id(id)
        if not etiqueta:
            raise Exception("Etiqueta no encontrada")
        
        nombre_normalizado = nombre.strip().lower()
        etiqueta_existente = self.etiqueta_repo.obtener_por_nombre(nombre_normalizado)
        
        # Verifica si existe otra etiqueta con ese nombre distinto al actual
        if etiqueta_existente and etiqueta_existente.id != id:
            raise Exception("La etiqueta ya existe con ese nombre")

        etiqueta.nombre = nombre_normalizado
        return self.etiqueta_repo.actualizar(etiqueta)


    # Método para crear una relación contenido-etiqueta
    def asociar_etiqueta_a_contenido(self, contenido_id: int, etiqueta_id: int):
        return self.repositorio_relacion.crear_relacion(contenido_id, etiqueta_id)

    def obtener_etiquetas_de_contenido(self, contenido_id: int):
        pass

    def eliminar_relacion(self, contenido_id: int, etiqueta_id: int):
        pass
    def buscar_contenidos_por_etiqueta(self, etiqueta_nombre: str):
            # Obtener la etiqueta por nombre
            etiqueta = self.etiqueta_repo.obtener_por_nombre(etiqueta_nombre)
            if not etiqueta:
                raise Exception(f"Etiqueta '{etiqueta_nombre}' no encontrada")

            # Obtener los contenidos relacionados con la etiqueta
            contenidos = self.repositorio_relacion.obtener_contenidos_por_etiqueta(etiqueta.id)
            return contenidos