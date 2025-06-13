#Escucha pedidos del frontend y responde
# Usa el servicio y el adaptador, no el modelo directamente. PARTE 6

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Backend.WantAdministrator.aplicacion.servicios.wantAdministrator_servicio import ContenidoEliminadoServicio
from Backend.WantAdministrator.infraestructura.repositorios.wantAdministrator_adapter import ContenidoEliminadoRepositorioImpl
from Backend.WantAdministrator.infraestructura.serializers import ContenidoEliminadoSerializer

class ListarEliminadosView(APIView):
    def get(self, request):
        servicio = ContenidoEliminadoServicio(ContenidoEliminadoRepositorioImpl())
        eliminados = servicio.listar_eliminados()
        serializer = ContenidoEliminadoSerializer(eliminados, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

