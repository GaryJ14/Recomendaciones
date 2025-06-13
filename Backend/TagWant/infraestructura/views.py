# Backend/TagWant/infraestructura/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Backend.TagWant.infraestructura.serializers import EtiquetaSerializer
from Backend.TagWant.dominio.entidades.tagWant_modelo import Etiqueta
from Backend.TagWant.infraestructura.repositorios.tagWant_adapter import EtiquetaRepositorioImpl, ContenidoEtiquetaRepositorioImpl
from Backend.TagWant.aplicacion.servicios.tagWant_servicio import TagWantServicio
from Backend.WantMusic.infraestructura.repositorios.wantMusic_adapter import ContenidoRepositorioImpl
from Backend.WantMusic.infraestructura.serializers import ContenidoSerializer


class ListaEtiquetasView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        etiqueta_repo = EtiquetaRepositorioImpl()
        contenido_repo = ContenidoRepositorioImpl()
        relacion_repo = ContenidoEtiquetaRepositorioImpl()
        self.servicio = TagWantServicio(etiqueta_repo, contenido_repo, relacion_repo)

    def get(self, request):
        etiquetas = self.servicio.listar_todas()
        serializer = EtiquetaSerializer(etiquetas, many=True)
        return Response(serializer.data)


class ObtenerEtiquetaView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        etiqueta_repo = EtiquetaRepositorioImpl()
        contenido_repo = ContenidoRepositorioImpl()
        relacion_repo = ContenidoEtiquetaRepositorioImpl()
        self.servicio = TagWantServicio(etiqueta_repo, contenido_repo, relacion_repo)

    def get(self, request, id):
        try:
            etiqueta = self.servicio.obtener_etiqueta_por_id(int(id))
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        serializer = EtiquetaSerializer(etiqueta)
        return Response(serializer.data)


class CrearEtiquetaView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        etiqueta_repo = EtiquetaRepositorioImpl()
        contenido_repo = ContenidoRepositorioImpl()
        relacion_repo = ContenidoEtiquetaRepositorioImpl()
        self.servicio = TagWantServicio(etiqueta_repo, contenido_repo, relacion_repo)

    def post(self, request):
        nombre = request.data.get('nombre')
        if not nombre:
            return Response({"error": "El campo 'nombre' es obligatorio"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            etiqueta = self.servicio.crear_etiqueta(nombre)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        serializer = EtiquetaSerializer(etiqueta)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ActualizarEtiquetaView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        etiqueta_repo = EtiquetaRepositorioImpl()
        contenido_repo = ContenidoRepositorioImpl()
        relacion_repo = ContenidoEtiquetaRepositorioImpl()
        self.servicio = TagWantServicio(etiqueta_repo, contenido_repo, relacion_repo)

    def put(self, request, id):
        nombre = request.data.get('nombre')
        if not nombre:
            return Response({"error": "El campo 'nombre' es obligatorio"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            etiqueta = self.servicio.actualizar_etiqueta(int(id), nombre)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        serializer = EtiquetaSerializer(etiqueta)
        return Response(serializer.data)


class EliminarEtiquetaView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        etiqueta_repo = EtiquetaRepositorioImpl()
        contenido_repo = ContenidoRepositorioImpl()
        relacion_repo = ContenidoEtiquetaRepositorioImpl()
        self.servicio = TagWantServicio(etiqueta_repo, contenido_repo, relacion_repo)

    def delete(self, request, id):
        try:
            self.servicio.eliminar_etiqueta(int(id))
            return Response({"La etiqueta a sido elimana correctamente"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        return Response(status=status.HTTP_204_NO_CONTENT)
class BuscarContenidoPorEtiquetaView(APIView):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        etiqueta_repo = EtiquetaRepositorioImpl()
        contenido_repo = ContenidoRepositorioImpl()
        relacion_repo = ContenidoEtiquetaRepositorioImpl()
        self.servicio = TagWantServicio(etiqueta_repo, contenido_repo, relacion_repo)

    def get(self, request, etiqueta_nombre):
        try:
            contenidos = self.servicio.buscar_contenidos_por_etiqueta(etiqueta_nombre)
            if not contenidos:
                return Response({"mensaje": "No se encontraron contenidos para esta etiqueta."}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = ContenidoSerializer(contenidos, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)