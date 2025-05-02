#Tiene la lógica: qué hacer con los datos recividos y qué devolver Lógica de aplicación que orquesta el proceso:
from django.contrib.auth.hashers import check_password
from Backend.WantMusic.dominio.entidades.wantMusic_modelo import Usuario
from Backend.WantMusic.dominio.repositorios.wantMusic_port import UsuarioRepositorio

class WantMusicServicio:
    def __init__(self, repositorio: UsuarioRepositorio):
        self.repositorio = repositorio

    def registrar_usuario(self, nombre, email, password):
        existente = self.repositorio.obtener_por_email(email)
        if existente:
            raise Exception("El usuario ya existe")
        
        nuevo_usuario = Usuario(None, nombre, email, password)
        return self.repositorio.guardar(nuevo_usuario)

 
    def autenticar_usuario(self, email, password):
        usuario = self.repositorio.obtener_por_email(email)
        if usuario and check_password(password, usuario.password):
            return usuario
        return None
    