#Se encarga de hablar con la base de datos 
from Backend.WantMusic.dominio.repositorios.wantMusic_port import UsuarioRepositorio
from Backend.WantMusic.dominio.entidades.wantMusic_modelo import Usuario as UsuarioDominio
from Backend.WantMusic.infraestructura.models import Usuario as UsuarioModel

class UsuarioRepositorioORM(UsuarioRepositorio):
    def obtener_por_email(self, email: str):
        try:
            user = UsuarioModel.objects.get(email=email)
            return UsuarioDominio(user.id, user.nombre, user.email, user.password, user.is_active, user.is_staff)
        except UsuarioModel.DoesNotExist:
            return None

    def guardar(self, usuario: UsuarioDominio):
        user = UsuarioModel(
            id=usuario.id,
            nombre=usuario.nombre,
            email=usuario.email,
            is_active=usuario.is_active,
            is_staff=usuario.is_staff,
        )
        user.set_password(usuario.password)
        user.save()
        return usuario
