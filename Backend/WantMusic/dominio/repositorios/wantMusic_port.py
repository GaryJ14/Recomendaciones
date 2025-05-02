#Interfaz que abstrae las operaciones sobre usuarios:
from abc import ABC, abstractmethod
from Backend.WantMusic.dominio.entidades.wantMusic_modelo import Usuario

class UsuarioRepositorio(ABC):
    @abstractmethod
    def obtener_por_email(self, email: str) -> Usuario:
        pass

    @abstractmethod
    def guardar(self, usuario: Usuario) -> Usuario:
        pass
