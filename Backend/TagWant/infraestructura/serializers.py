#traduce datos para enviarlos o recibirlos
# Define los serializadores para exponer los datos por API REST en formato JSON. PARTE 5
# Backend/TagWant/infraestructura/serializers.py
from rest_framework import serializers
from Backend.TagWant.dominio.entidades.tagWant_modelo import Etiqueta

class EtiquetaSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)
    nombre = serializers.CharField(max_length=100)

    def create(self, validated_data):
        return Etiqueta(**validated_data)

    def update(self, instance, validated_data):
        instance.nombre = validated_data.get('nombre', instance.nombre)
        return instance
class ContenidoEtiquetaSerializer(serializers.Serializer):
    contenido_id = serializers.IntegerField()
    etiqueta_id = serializers.IntegerField()
