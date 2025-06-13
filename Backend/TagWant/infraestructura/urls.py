# Backend/TagWant/infraestructura/urls.py
from django.urls import path
from Backend.TagWant.infraestructura.views import (
    BuscarContenidoPorEtiquetaView,
    ListaEtiquetasView,
    ObtenerEtiquetaView,
    CrearEtiquetaView,
    ActualizarEtiquetaView,
    EliminarEtiquetaView
)


urlpatterns = [
    path('etiquetas/', ListaEtiquetasView.as_view(), name='lista_etiquetas'),
    path('etiquetas/<int:id>/', ObtenerEtiquetaView.as_view(), name='obtener_etiqueta'),
    path('etiquetas/crear/', CrearEtiquetaView.as_view(), name='crear_etiqueta'),
    path('etiquetas/actualizar/<int:id>/', ActualizarEtiquetaView.as_view(), name='actualizar_etiqueta'),
    path('etiquetas/eliminar/<int:id>/', EliminarEtiquetaView.as_view(), name='eliminar_etiqueta'),
    path('buscar-contenidos-por-etiqueta/<str:etiqueta_nombre>/', BuscarContenidoPorEtiquetaView.as_view(), name='buscar_contenidos_por_etiqueta'),

]
