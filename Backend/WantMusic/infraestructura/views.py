# Escucha pedidos del frontend y responde
# Usa el servicio y el adaptador, no el modelo directamente. PARTE 6

import os
import uuid
import datetime
from django.conf import settings
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework_simplejwt.tokens import RefreshToken  # JWT o token
from rest_framework.permissions import AllowAny  # permitir acceso sin autenticación
from rest_framework.permissions import IsAuthenticated  # vistas protegidas

from django.core.files.storage import default_storage

# Adaptadores y servicios
from Backend.TagWant.aplicacion.servicios.tagWant_servicio import TagWantServicio
from Backend.WantMusic.aplicacion.servicios.wantMusic_servicio import *
from Backend.WantMusic.infraestructura.repositorios.wantMusic_adapter import *
from Backend.TagWant.infraestructura.repositorios.tagWant_adapter import ContenidoEtiquetaRepositorioImpl, EtiquetaRepositorioImpl
from rest_framework.permissions import IsAdminUser

# Serializadores y Modelos
from Backend.WantMusic.infraestructura.serializers import *
from Backend.WantMusic.infraestructura.models import *

from django.utils import timezone  # Correcto para manejar fechas y tiempos

from Backend.WantMusic.infraestructura.repositorios.wantMusic_adapter import UsuarioRepositorioORM, HistorialRepositorioImpl

usuario_repo = UsuarioRepositorioORM()
historial_repo = HistorialRepositorioImpl()
contenido_repo = ContenidoRepositorioImpl()
servicio = WantMusicServicio(usuario_repo, historial_repo, contenido_repo)

class RegistroUsuarioView(APIView):
    permission_classes = [AllowAny]  # Permitir que cualquier usuario pueda registrarse

    def post(self, request):
        print("Datos recibidos en el backend:", request.data)  # Para depurar los datos

        # Recibir los datos de la solicitud
        serializer = RegistroSerializer(data=request.data)

        # Validar los datos con el serializer
        if serializer.is_valid():
            data = serializer.validated_data
            try:
                # Crear el usuario usando la lógica original
                usuario = servicio.registrar_usuario(data['nombre'], data['email'], data['password'])

                # Crear un token JWT para el usuario
                refresh = RefreshToken.for_user(usuario)
                access_token = str(refresh.access_token)

                # Retornar el mensaje con el token de acceso
                return Response({
                    'mensaje': 'Usuario registrado exitosamente',
                    'access_token': access_token,  # Token de acceso
                    'email': usuario.email,  # Información adicional
                    'nombre': usuario.nombre,
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                mensaje = str(e)
                if "ya existe" in mensaje.lower():
                    return Response({"error": "El correo ya está registrado."}, status=status.HTTP_400_BAD_REQUEST)
                return Response({"error": "Error al registrar usuario."}, status=status.HTTP_400_BAD_REQUEST)

        # Si el serializer no es válido, devolver los errores
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListaUsuariosView(ListAPIView):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer

class LoginUsuarioView(APIView):
    permission_classes = [AllowAny]  # Permitir que cualquier usuario pueda acceder

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email y contraseña son obligatorios'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            usuario = servicio.autenticar_usuario(email, password)
            if usuario:
                # Generar el token JWT
                refresh = RefreshToken.for_user(usuario)
                access_token = str(refresh.access_token)

                # Determinar el rol del usuario
                if usuario.is_superuser:
                    role = 'superadmin'  # Rol de superadministrador
                elif usuario.is_staff:
                    role = 'admin'  # Rol de administrador
                else:
                    role = 'usuario'  # Rol de usuario normal

                # Retornar el token JWT y los datos del usuario
                return Response({
                    'message': 'Inicio de sesión exitoso',
                    'access_token': access_token,  # Token de acceso
                    'role': role,  # Rol del usuario (superadmin, admin, usuario)
                    'email': usuario.email,
                    'nombre': usuario.nombre,
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Haz ingresado el email y/o contraseña incorrecta'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception:
            return Response({'error': 'Error interno del servidor'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
class ActualizarUsuarioView(APIView):
    def put(self, request, id):
        serializer = ActualizarUsuarioSerializer(data=request.data)
        if serializer.is_valid():
            datos = serializer.validated_data
            try:
                usuario_actualizado = servicio.actualizar_usuario(
                    id=id,
                    nombre=datos['nombre'],
                    email=datos['email'],
                    password=datos.get('password', None),
                    is_active=datos['is_active'],
                )
                return Response({"mensaje": "Usuario actualizado correctamente"}, status=status.HTTP_200_OK)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EliminarUsuarioView(APIView):
    def delete(self, request, id):
        try:
            servicio.eliminar_usuario(id)
            return Response({"mensaje": "Usuario eliminado exitosamente"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)


class CrearContenidoView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        etiqueta_repo = EtiquetaRepositorioImpl()
        relacion_repo = ContenidoEtiquetaRepositorioImpl()
        contenido_repo = ContenidoRepositorioImpl()
        self.servicio = ContenidoServicio(contenido_repo, etiqueta_repo, relacion_repo)

    def post(self, request):
        serializer = CrearContenidoSerializer(data=request.data)
        if serializer.is_valid():
            datos = serializer.validated_data
            datos['subido_por'] = request.user  # Asignar usuario actual
            archivo = request.FILES.get('archivo')

            contenido_creado = self.servicio.crear_contenido_con_etiquetas(datos, archivo)
            serializer_resp = ContenidoSerializer(contenido_creado)
            return Response(serializer_resp.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



    def _guardar_archivo(self, archivo, tipo):
        import os
        import uuid
        import datetime
        from django.conf import settings
        from django.core.files.storage import default_storage

        hoy = datetime.date.today()
        subcarpeta = f"{hoy.year}/{hoy.month:02d}"
        ruta_carpeta = os.path.join(settings.MEDIA_ROOT, tipo, subcarpeta)
        os.makedirs(ruta_carpeta, exist_ok=True)

        nombre_archivo = f"{uuid.uuid4()}_{archivo.name}"
        ruta_completa = os.path.join(ruta_carpeta, nombre_archivo)

        if not default_storage.exists(ruta_completa):
            with open(ruta_completa, 'wb+') as destino:
                for chunk in archivo.chunks():
                    destino.write(chunk)

        url_relativa = f"{settings.MEDIA_URL}{tipo}/{subcarpeta}/{nombre_archivo}"
        return url_relativa

class ListarContenidoView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        etiqueta_repo = EtiquetaRepositorioImpl()
        relacion_repo = ContenidoEtiquetaRepositorioImpl()
        contenido_repo = ContenidoRepositorioImpl()
        self.servicio = ContenidoServicio(contenido_repo, etiqueta_repo, relacion_repo)

    def get(self, request):
        contenidos = self.servicio.listar_contenidos()
        serializer = ContenidoSerializer(contenidos, many=True)
        return Response(serializer.data)

class ObtenerContenidoView(APIView):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Pasamos los repositorios al servicio
        etiqueta_repo = EtiquetaRepositorioImpl()
        relacion_repo = ContenidoEtiquetaRepositorioImpl()
        repositorio = ContenidoRepositorioImpl()
        self.servicio = ContenidoServicio(repositorio, etiqueta_repo, relacion_repo)

    def get(self, request, *args, **kwargs):
        contenido_id = kwargs.get('pk')
        contenido = self.servicio.obtener_contenido(contenido_id)

        if not contenido:
            return Response({"error": "Contenido no encontrado"}, status=404)

        serializer = ContenidoSerializer(contenido)
        return Response(serializer.data)

#Buscador de contendios mediante el titrulo

class BuscarContenidoView(APIView):
    def get(self, request, query=None):
        if query:
            # Crear las instancias de los repositorios
            contenido_repo = ContenidoRepositorioImpl()
            etiqueta_repo = EtiquetaRepositorioImpl()
            relacion_repo = ContenidoEtiquetaRepositorioImpl()

            # Crear el servicio y hacer la búsqueda
            contenido_servicio = ContenidoServicio(contenido_repo, etiqueta_repo, relacion_repo)
            contenidos = contenido_servicio.buscar_contenido(query)

            # Filtrar los contenidos eliminados
            contenidos_no_eliminados = [contenido for contenido in contenidos if not contenido.eliminado]

            # Registrar la búsqueda en el historial (si el usuario está autenticado)
            if request.user.is_authenticated:
                usuario_id = request.user.id  # Obtener el ID del usuario autenticado
                termino_busqueda = query

                # Guardar la búsqueda en el historial
                historial_busqueda = HistorialBusqueda(usuario_id=usuario_id, termino_busqueda=termino_busqueda)
                historial_busqueda.save()

            # Serializar los resultados
            serializer = ContenidoSerializer(contenidos_no_eliminados, many=True)
            return Response(serializer.data)
        
        return Response({"error": "No se proporcionó un término de búsqueda."}, status=status.HTTP_400_BAD_REQUEST)

class BuscarContenidoPorEtiquetaView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        etiqueta_repo = EtiquetaRepositorioImpl()
        contenido_repo = ContenidoRepositorioImpl()
        relacion_repo = ContenidoEtiquetaRepositorioImpl()
        self.servicio = TagWantServicio(etiqueta_repo, contenido_repo, relacion_repo)

    def get(self, request, etiqueta_nombre):
        try:
            # Buscar la etiqueta por nombre
            etiqueta = self.servicio.etiqueta_repo.obtener_por_nombre(etiqueta_nombre)
            
            if not etiqueta:
                return Response({"error": "Etiqueta no encontrada."}, status=status.HTTP_404_NOT_FOUND)
            
            # Obtener los contenidos relacionados con esta etiqueta que no están eliminados
            contenidos = self.servicio.repositorio_relacion.obtener_contenidos_por_etiqueta(etiqueta.id)

            # Filtrar los contenidos eliminados
            contenidos_no_eliminados = [contenido for contenido in contenidos if not contenido.eliminado]

            if not contenidos_no_eliminados:
                return Response({"mensaje": "No se encontraron contenidos para esta etiqueta."}, status=status.HTTP_404_NOT_FOUND)
            
            # Serializar los contenidos
            contenido_serializer = ContenidoSerializer(contenidos_no_eliminados, many=True)

            # Guardar la búsqueda en el historial
            if request.user.is_authenticated:
                usuario_id = request.user.id  # Obtener el ID del usuario autenticado
                historial_busqueda = HistorialBusqueda(usuario_id=usuario_id, termino_busqueda=etiqueta_nombre)
                historial_busqueda.save()  # Guardar la búsqueda en la base de datos

            return Response(contenido_serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RegistrarBusquedaView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        usuario_id = request.user.id  # Obtener el ID del usuario autenticado
        termino_busqueda = request.data.get('termino_busqueda')

        if not termino_busqueda:
            return Response({"error": "El término de búsqueda es obligatorio."}, status=400)

        # Guardar la búsqueda en el historial
        historial_busqueda = HistorialBusqueda(usuario_id=usuario_id, termino_busqueda=termino_busqueda)
        historial_busqueda.save()

        return Response({"mensaje": "Búsqueda registrada con éxito."}, status=201)

class ActualizarContenidoView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        etiqueta_repo = EtiquetaRepositorioImpl()
        relacion_repo = ContenidoEtiquetaRepositorioImpl()
        contenido_repo = ContenidoRepositorioImpl()
        self.servicio = ContenidoServicio(contenido_repo, etiqueta_repo, relacion_repo)

    def put(self, request, pk):
        contenido = self.servicio.obtener_contenido(pk)
        if not contenido:
            return Response({"error": "Contenido no encontrado"}, status=status.HTTP_404_NOT_FOUND)

        serializer = ActualizarContenidoSerializer(data=request.data)
        if serializer.is_valid():
            archivo = request.FILES.get('archivo')
            contenido_actualizado = self.servicio.actualizar_contenido(contenido, serializer.validated_data, archivo)
            serializer_resp = ContenidoSerializer(contenido_actualizado)
            return Response(serializer_resp.data, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
from rest_framework.permissions import IsAuthenticated

class EliminarContenidoView(APIView):
    permission_classes = [IsAuthenticated]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        etiqueta_repo = EtiquetaRepositorioImpl()
        relacion_repo = ContenidoEtiquetaRepositorioImpl()
        repositorio = ContenidoRepositorioImpl()
        self.servicio = ContenidoServicio(repositorio, etiqueta_repo, relacion_repo)

    def post(self, request, *args, **kwargs):
        contenido_id = kwargs.get('pk')
        usuario_eliminador = request.user
        motivo = request.data.get('motivo', None)  # Aquí recibes el motivo enviado en JSON

        try:
            contenido = self.servicio.obtener_contenido(contenido_id)
            if not contenido:
                return Response({"error": "Contenido no encontrado"}, status=status.HTTP_404_NOT_FOUND)

            self.servicio.eliminar_contenido(contenido_id, usuario_eliminador, motivo)

            return Response({"mensaje": "Contenido eliminado exitosamente"}, status=status.HTTP_200_OK)
        except Exception as e:
            mensaje = str(e)
            if "ya eliminado" in mensaje.lower():
                return Response({"error": "Contenido ya está eliminado"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"error": "Error al eliminar contenido: " + mensaje}, status=status.HTTP_400_BAD_REQUEST)

class ListarContenidosEliminadosView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        etiqueta_repo = EtiquetaRepositorioImpl()
        relacion_repo = ContenidoEtiquetaRepositorioImpl()
        contenido_repo = ContenidoRepositorioImpl()
        self.servicio = ContenidoServicio(contenido_repo, etiqueta_repo, relacion_repo)

    def get(self, request):
        contenidos = self.servicio.listar_contenidos_eliminados()
        serializer = ContenidoSerializer(contenidos, many=True)
        return Response(serializer.data)

class ContenidosPorEtiquetasFavoritasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario_id = request.user.id

        repo_etiquetas_fav = UsuarioEtiquetaFavoritaRepositorioImpl()
        repo_contenidos = ContenidoRepositorioImpl()
        repo_etiquetas = EtiquetaRepositorioImpl()
        repo_relaciones = ContenidoEtiquetaRepositorioImpl()  # Este es el repo de TagWant

        contenido_servicio = ContenidoServicio(repo_contenidos, repo_etiquetas, repo_relaciones)

        etiquetas_fav = repo_etiquetas_fav.listar_favoritas_por_usuario(usuario_id)
        etiquetas_ids = [ef.etiqueta_id for ef in etiquetas_fav]

        if not etiquetas_ids:
            return Response({"mensaje": "No tienes etiquetas favoritas registradas."}, status=200)

        contenidos_filtrados = contenido_servicio.listar_contenidos_por_etiquetas(etiquetas_ids)

        # Filtrar los contenidos eliminados
        contenidos_no_eliminados = [contenido for contenido in contenidos_filtrados if not contenido.eliminado]

        serializer = ContenidoSerializer(contenidos_no_eliminados, many=True)
        return Response(serializer.data)


class ListarEtiquetasFavoritasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = request.user
        usuario_etiqueta_repo = UsuarioEtiquetaFavoritaRepositorioImpl()
        servicio_etiquetas_fav = UsuarioEtiquetaFavoritaServicio(usuario_etiqueta_repo)
        
        if usuario.is_staff or usuario.is_superuser:
            # Admin: obtener todas las etiquetas favoritas
            favoritas = usuario_etiqueta_repo.listar_todas_favoritas()
        else:
            # Usuario normal: obtener solo sus etiquetas favoritas
            favoritas = servicio_etiquetas_fav.obtener_favoritas(usuario.id)

        if not favoritas:
            return Response({"mensaje": "No hay etiquetas favoritas."}, status=200)

        data = [{"usuario_id": f.usuario_id, "etiqueta_id": f.etiqueta_id} for f in favoritas]
        return Response(data)
    

class CrearEtiquetaFavoritaView(APIView):
    permission_classes = [IsAuthenticated]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        repo = UsuarioEtiquetaFavoritaRepositorioImpl()
        self.servicio = UsuarioEtiquetaFavoritaServicio(repo)

    def post(self, request):
        usuario_id = request.user.id  # Tomar el id del usuario autenticado
        etiquetas_ids = request.data.get('etiquetas_ids')  # Espera una lista

        if not etiquetas_ids or not isinstance(etiquetas_ids, list):
            return Response({"error": "etiquetas_ids (lista) es requerido"}, status=status.HTTP_400_BAD_REQUEST)
        
        errores = []
        for etiqueta_id in etiquetas_ids:
            try:
                self.servicio.agregar_favorita(usuario_id, etiqueta_id)
            except Exception as e:
                errores.append(f"Etiqueta {etiqueta_id}: {str(e)}")
        
        if errores:
            return Response({"mensaje": "Algunas etiquetas no se pudieron agregar", "errores": errores}, status=status.HTTP_207_MULTI_STATUS)
        
        return Response({"mensaje": "Todas las etiquetas favoritas agregadas"}, status=status.HTTP_201_CREATED)




class ActualizarEtiquetaFavoritaView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, id):  # id podría ser usuario o id de relación
        usuario_id = request.user.id
        etiqueta_vieja = request.data.get('etiqueta_vieja')
        etiqueta_nueva = request.data.get('etiqueta_nueva')

        if not etiqueta_vieja or not etiqueta_nueva:
            return Response({"error": "etiqueta_vieja y etiqueta_nueva son requeridos"}, status=400)

        repo = UsuarioEtiquetaFavoritaRepositorioImpl()
        servicio = UsuarioEtiquetaFavoritaServicio(repo)

        try:
            servicio.actualizar_favorita(usuario_id, etiqueta_vieja, etiqueta_nueva)
            return Response({"mensaje": "Etiqueta favorita actualizada correctamente"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)


class EliminarEtiquetaFavoritaView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, id):
        usuario = request.user
        repo = UsuarioEtiquetaFavoritaRepositorioImpl()
        servicio = UsuarioEtiquetaFavoritaServicio(repo)
        try:
            servicio.eliminar_favorita(usuario.id, id)
            return Response({"mensaje": "Etiqueta favorita eliminada"}, status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        


class ToggleFavoritoView(APIView):
    permission_classes = [IsAuthenticated]  # Verificación de autenticación mediante token

    def post(self, request, contenido_id):
        usuario = request.user  # El token es validado automáticamente aquí
        try:
            contenido = Contenido.objects.filter(id=contenido_id).first()
            if not contenido:
                return Response({"error": "Contenido no encontrado."}, status=404)

            if Favorito.objects.filter(usuario=usuario, contenido=contenido).exists():
                # Eliminar favorito
                Favorito.objects.filter(usuario=usuario, contenido=contenido).delete()
                return Response({"status": "eliminado"})
            else:
                # Agregar a favoritos
                Favorito.objects.create(usuario=usuario, contenido=contenido)
                return Response({"status": "agregado"})
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class EliminarFavoritoView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, contenido_id):
        usuario = request.user
        try:
            contenido = Contenido.objects.filter(id=contenido_id).first()
            if not contenido:
                return Response({"error": "Contenido no encontrado."}, status=404)

            if not Favorito.objects.filter(usuario=usuario, contenido=contenido).exists():
                return Response({"error": "Contenido no es favorito."}, status=400)

            # Eliminar favorito
            Favorito.objects.filter(usuario=usuario, contenido=contenido).delete()
            return Response({"mensaje": "Favorito eliminado correctamente"}, status=204)
        except Exception as e:
            return Response({"error": str(e)}, status=400)

class ListarFavoritosView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario = request.user
        try:
            # Obtener los favoritos del usuario
            favoritos = Favorito.objects.filter(usuario=usuario)
            contenidos = [fav.contenido for fav in favoritos]
            contenido_serializer = ContenidoSerializer(contenidos, many=True)
            return Response(contenido_serializer.data, status=200)
        except Exception as e:
            return Response({"error": str(e)}, status=500)
        
class HistorialReproduccionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario_id = request.user.id
        historial = servicio.obtener_historial_usuario(usuario_id)
        data = [{
            'contenido_id': h.contenido_id,
            'fecha_reproduccion': h.fecha_reproduccion,
            'duracion_visto': h.duracion_visto
        } for h in historial]
        return Response(data)

    def post(self, request):
        usuario_id = request.user.id
        contenido_id = request.data.get('contenido_id')
        duracion_visto = request.data.get('duracion_visto', None)

        if not contenido_id:
            return Response({"error": "contenido_id es requerido"}, status=status.HTTP_400_BAD_REQUEST)

        historial = servicio.agregar_historial(usuario_id, contenido_id, duracion_visto)
        return Response({"mensaje": "Historial registrado"}, status=status.HTTP_201_CREATED)
    

class EliminarHistorial(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, contenido_id):
        try:
            # Crear una instancia del repositorio
            historial_repo = HistorialRepositorioImpl()
            resultado = historial_repo.eliminar_historial(request.user.id, contenido_id)

            if resultado:
                return Response({'message': 'Contenido eliminado del historial exitosamente.'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Contenido no encontrado en el historial.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Registro de error para obtener detalles
            print(f"Error al eliminar historial: {str(e)}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        
        
class EliminarTodoHistorial(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        usuario_id = request.user.id
        try:
            # Eliminar todos los registros de historial para el usuario autenticado
            historial = HistorialReproduccionModel.objects.filter(usuario_id=usuario_id)
            historial.delete()

            return Response({'message': 'Todo el historial eliminado exitosamente.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': f'Error al eliminar el historial: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
     
class GuardarMisEtiquetasFavoritasView(APIView):
    permission_classes = [IsAuthenticated]

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        repo = UsuarioEtiquetaFavoritaRepositorioImpl()
        self.servicio = UsuarioEtiquetaFavoritaServicio(repo)

    def post(self, request):
        usuario_id = request.user.id
        etiquetas_ids = request.data.get('etiquetas_ids', [])

        if not etiquetas_ids or not isinstance(etiquetas_ids, list):
            return Response({"error": "etiquetas_ids (lista) es requerido"}, status=400)

        errores = []
        for etiqueta_id in etiquetas_ids:
            try:
                self.servicio.agregar_favorita(usuario_id, etiqueta_id)
            except Exception as e:
                errores.append(f"Etiqueta {etiqueta_id}: {str(e)}")

        if errores:
            return Response({"mensaje": "Algunas etiquetas no se pudieron guardar", "errores": errores}, status=207)

        return Response({"mensaje": "Preferencias guardadas exitosamente"}, status=201)

class RecomendacionesAleatoriasView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        usuario_id = request.user.id

        # Inyección de dependencias a través del constructor o un servicio de fábrica
        contenido_repo = ContenidoRepositorioImpl()  # Debe venir de un contenedor de dependencias
        servicio = WantMusicServicio(usuario_repo, historial_repo, contenido_repo)

        # Llamada al servicio para obtener las recomendaciones aleatorias
        recomendaciones = servicio.obtener_recomendaciones_aleatorias(cantidad=10)

        # Serializar y devolver las recomendaciones
        serializer = ContenidoSerializer(recomendaciones, many=True)
        return Response(serializer.data)
