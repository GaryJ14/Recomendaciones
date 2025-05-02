#Aquí se define la entidad de dominio Usuario, independiente de Django.
class Usuario:
    def __init__(self, id, nombre, email, password, is_active=True, is_staff=False):
        self.id = id
        self.nombre = nombre
        self.email = email
        self.password = password
        self.is_active = is_active
        self.is_staff = is_staff

    def verificar_password(self, password):
        # Aquí no haces el hash; eso queda en la infraestructura
        return self.password == password
