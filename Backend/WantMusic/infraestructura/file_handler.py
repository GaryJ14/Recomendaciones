import os
import uuid
import datetime
from django.conf import settings

def guardar_archivo_multimedia(tipo: str, archivo) -> str:
    hoy = datetime.date.today()
    subcarpeta = f"{hoy.year}/{hoy.month:02d}"
    ruta_carpeta = os.path.join(settings.MEDIA_ROOT, tipo, subcarpeta)

    # Crear las carpetas si no existen
    os.makedirs(ruta_carpeta, exist_ok=True)

    # Generar un nombre único para el archivo
    nombre_archivo = f"{uuid.uuid4()}_{archivo.name}"

    # Definir la ruta completa del archivo
    ruta_completa = os.path.join(ruta_carpeta, nombre_archivo)

    # Guardar el archivo en el sistema de archivos
    with open(ruta_completa, 'wb+') as destino:
        for chunk in archivo.chunks():
            destino.write(chunk)

    # Generar la URL relativa del archivo
    url_relativa = f"{settings.MEDIA_URL}{tipo}/{subcarpeta}/{nombre_archivo}"
    return url_relativa
