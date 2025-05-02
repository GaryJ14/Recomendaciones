#traduce datos para enviarlos o recibirlos
from rest_framework import serializers
from Backend.WantMusic.infraestructura.models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'email', 'is_active', 'is_staff', 'creado_en']
        read_only_fields = ['id', 'is_active', 'is_staff', 'creado_en']

class RegistroSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
