#Escucha pedidos del frontend y responde
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Backend.WantMusic.aplicacion.servicios.wantMusic_servicio import WantMusicServicio
from Backend.WantMusic.infraestructura.repositorios.wantMusic_adapter import UsuarioRepositorioORM
from Backend.WantMusic.infraestructura.serializers import UsuarioSerializer, RegistroSerializer
from Backend.WantMusic.infraestructura.models import Usuario
from rest_framework.generics import ListAPIView
repositorio = UsuarioRepositorioORM()
servicio = WantMusicServicio(repositorio)



class RegistroUsuarioView(APIView):
    def post(self, request):
        serializer = RegistroSerializer(data=request.data)
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                usuario = servicio.registrar_usuario(data['nombre'], data['email'], data['password'])
                return Response({"mensaje": "Usuario registrado exitosamente"}, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
class ListaUsuariosView(ListAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
class LoginUsuarioView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email y contraseña son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        usuario = servicio.autenticar_usuario(email, password)
        if usuario:
            return Response({'mensaje': 'Inicio de sesión exitoso'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
