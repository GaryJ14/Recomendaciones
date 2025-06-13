#Aquí se define la entidad de dominio, independiente de Django. INICIO

from dataclasses import dataclass
from datetime import datetime
from typing import Optional

@dataclass
class ContenidoEliminado:
    id: Optional[int] = None
    contenido_id: int = 0
    fecha_eliminacion: datetime = None
    motivo: Optional[str] = None
    eliminado_por_id: Optional[int] = None
