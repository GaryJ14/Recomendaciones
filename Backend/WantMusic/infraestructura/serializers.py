#traduce datos para enviarlos o recibirlos
# Define los serializadores para exponer los datos por API REST en formato JSON. PARTE 5
from rest_framework import serializers
from Backend.WantMusic.infraestructura.models import *
from Backend.TagWant.infraestructura.models import *
from Backend.TagWant.infraestructura.repositorios.tagWant_adapter import EtiquetaRepositorioImpl, ContenidoEtiquetaRepositorioImpl
from rest_framework import serializers
from Backend.TagWant.infraestructura.serializers import EtiquetaSerializer
class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'email','password', 'is_active', 'is_staff', 'creado_en']
        read_only_fields = ['id', 'is_active', 'is_staff', 'creado_en']
        

class RegistroSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        # Crear el usuario con la contraseña cifrada
        usuario = Usuario.objects.create_user(
            email=validated_data['email'], 
            nombre=validated_data['nombre'],  # Asegúrate de que 'nombre' esté presente en el modelo Usuario
            password=validated_data['password'],  # Asegúrate de que la contraseña se cifre correctamente
        )
        return usuario

class ActualizarUsuarioSerializer(serializers.Serializer):
    nombre = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    password = serializers.CharField(max_length=128, required=False, allow_blank=True)
    is_active = serializers.BooleanField()

class eliminarUsuarioSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    def delete(self, instance):
        instance.delete()
        return instance



from Backend.TagWant.infraestructura.serializers import EtiquetaSerializer


class ContenidoSerializer(serializers.ModelSerializer):
    etiquetas = serializers.SerializerMethodField()
    subido_por_nombre = serializers.CharField(source='subido_por.nombre', read_only=True)
    motivo_eliminacion = serializers.CharField(read_only=True)
    fecha_eliminacion = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Contenido
        fields = ['id', 'titulo', 'tipo', 'url', 'fecha_subida', 'subido_por_nombre', 'etiquetas', 'eliminado', 'motivo_eliminacion', 'fecha_eliminacion']


    def get_etiquetas(self, obj):
        # Usar el repositorio de relaciones para traer las etiquetas relacionadas
        etiqueta_repo = EtiquetaRepositorioImpl()
        relacion_repo = ContenidoEtiquetaRepositorioImpl()
        etiquetas = relacion_repo.obtener_etiquetas_por_contenido(obj.id)
        return EtiquetaSerializer(etiquetas, many=True).data

    
class CrearContenidoSerializer(serializers.Serializer):
    titulo = serializers.CharField(max_length=255)
    tipo = serializers.ChoiceField(choices=[('audio', 'Audio'), ('video', 'Video')])
    etiquetas = serializers.ListField(
        child=serializers.CharField(max_length=100),
        allow_empty=True,
        required=False
    )
    archivo = serializers.FileField(required=True)
    
class ActualizarContenidoSerializer(serializers.Serializer):
    titulo = serializers.CharField(max_length=255, required=False)
    tipo = serializers.ChoiceField(choices=[('audio', 'Audio'), ('video', 'Video')], required=False)
    etiquetas = serializers.ListField(
        child=serializers.CharField(max_length=100),
        required=False
    )
    archivo = serializers.FileField(required=False)

    def validate(self, data):
        # Si el archivo está presente, validar su formato
        archivo = data.get('archivo')
        tipo = data.get('tipo')

        if archivo:
            if tipo == 'audio' and not archivo.name.lower().endswith(('.mp3', '.wav', '.ogg')):
                raise serializers.ValidationError("Formato de audio no permitido")
            elif tipo == 'video' and not archivo.name.lower().endswith(('.mp4', '.mov', '.avi')):
                raise serializers.ValidationError("Formato de video no permitido")

        return data

class ContenidoEliminadoSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    titulo = serializers.CharField()
    tipo = serializers.CharField()
    url = serializers.CharField()
    fecha_subida = serializers.DateTimeField(allow_null=True)
    etiquetas = serializers.ListField()
    eliminado = serializers.BooleanField()
    motivo_eliminacion = serializers.CharField(allow_null=True)
    fecha_eliminacion = serializers.DateTimeField(allow_null=True)
    
    

class FavoritoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Favorito
        fields = '__all__'

    
class HistorialSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistorialReproduccion
        fields = ['id', 'usuario', 'contenido', 'fecha_reproduccion']