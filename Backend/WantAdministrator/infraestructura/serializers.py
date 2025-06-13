#traduce datos para enviarlos o recibirlos
# Define los serializadores para exponer los datos por API REST en formato JSON. PARTE 5

from rest_framework import serializers
from Backend.WantAdministrator.infraestructura.models import ContenidoEliminado

class ContenidoEliminadoSerializer(serializers.ModelSerializer):
    contenido_titulo = serializers.CharField(source='contenido.titulo', read_only=True)
    eliminado_por_nombre = serializers.CharField(source='eliminado_por.nombre', read_only=True)

    class Meta:
        model = ContenidoEliminado
        fields = ['id', 'contenido_titulo', 'fecha_eliminacion', 'motivo', 'eliminado_por_nombre']

