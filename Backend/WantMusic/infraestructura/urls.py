from django.urls import include, path
from Backend.WantMusic.infraestructura.views import *
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static

# Create a router for ContenidoMultimediaViewSet
router = DefaultRouter()

urlpatterns = [
    # usuarios
    path('registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),
    path('usuarios/', ListaUsuariosView.as_view(), name='lista_usuarios'),
    path('perfil/', ObtenerUsuarioView.as_view(), name='obtener_usuario'),
    path('login/', LoginUsuarioView.as_view(), name='login'),
    path('actualizar/<int:id>/', ActualizarUsuarioView.as_view(), name='actualizar_usuario'),
    path('eliminar/<int:id>/', EliminarUsuarioView.as_view(), name='eliminar_usuario'),

    # Contenido Multimedia
    path('contenidos/', ListarContenidoView.as_view(), name='listar_contenidos'),
    path('contenidos/<int:pk>/', ObtenerContenidoView.as_view(), name='obtener_contenido'),
    path('contenidos/crear/', CrearContenidoView.as_view(), name='crear_contenido'),
    path('contenidos/eliminar/<int:pk>/', EliminarContenidoView.as_view(), name='eliminar_contenido'),
    path('contenidos/actualizar/<int:pk>/', ActualizarContenidoView.as_view(), name='actualizar_contenido'),
    path('contenidos/eliminados/', ListarContenidosEliminadosView.as_view(), name='contenidos-eliminados'),
    path('contenidos/por-etiquetas-favoritas/', ContenidosPorEtiquetasFavoritasView.as_view(), name='contenidos_por_etiquetas_favoritas'),
    path('contenidos/buscar/<str:query>/', BuscarContenidoView.as_view(), name='buscar_contenido'),
    path('contenidos/buscar-etiqueta/<str:etiqueta_nombre>/', BuscarContenidoPorEtiquetaView.as_view(), name='buscar_contenidos_por_etiqueta'),
    path('registrar-busqueda/', RegistrarBusquedaView.as_view(), name='registrar_busqueda'),
    path('contenidos/buscar-artista/<str:artista>/', BuscarContenidoPorArtistaView.as_view(), name='buscar_contenido_artista'),

    #Etiquetas Favoritas
    path('usuario/etiquetas-favoritas/', ListarEtiquetasFavoritasView.as_view(), name='listar_etiquetas_favoritas'),  # GET
    path('usuario/etiquetas-favoritas/crear/', CrearEtiquetaFavoritaView.as_view(), name='crear_etiqueta_favorita'),  # POST
    path('usuario/etiquetas-favoritas/actualizar/<int:id>/', ActualizarEtiquetaFavoritaView.as_view(), name='actualizar_etiqueta_favorita'),  # PUT/PATCH
    path('usuario/etiquetas-favoritas/eliminar/<int:id>/', EliminarEtiquetaFavoritaView.as_view(), name='eliminar_etiqueta_favorita'),  # DELETE
    # Contendio favoritos
    path('favoritos/<int:contenido_id>/toggle/', ToggleFavoritoView.as_view(), name='toggle-favorito'),
    path('favoritos/<int:contenido_id>/eliminar/', EliminarFavoritoView.as_view(), name='eliminar-favorito'),
    path('favoritos/', ListarFavoritosView.as_view(), name='listar_favoritos'),
    path('usuario/etiquetas-favoritas/guardar/', GuardarMisEtiquetasFavoritasView.as_view()),

    # Historial de Reproducción
    path('historial/', HistorialReproduccionView.as_view(), name='historial_reproduccion'),
    path('recomendaciones/', RecomendacionesAleatoriasView.as_view(), name='recomendaciones'),
    path('eliminarhistorial/<int:contenido_id>/', EliminarHistorial.as_view(), name='eliminar_historial'),
    path('eliminarTodohistorial/', EliminarTodoHistorial.as_view(), name='eliminar_todo_historial'),

    
]

