from django.urls import path
from Backend.WantMusic.infraestructura.views import *



urlpatterns = [
    path('registro/', RegistroUsuarioView.as_view(), name='registro_usuario'),
    path('usuarios/', ListaUsuariosView.as_view(), name='lista_usuarios'),
    path('login/', LoginUsuarioView.as_view(), name='login'),

]
