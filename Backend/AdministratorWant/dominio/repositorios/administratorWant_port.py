# administratorWant_port.py

from abc import ABC, abstractmethod

class EstadisticaUsuarioRepositorio(ABC):
    @abstractmethod
    def guardar_total(self, total_usuarios: int, total_activos: int):
        pass

