from rest_framework.test import APITestCase
from rest_framework import status
from Backend.WantMusic.infraestructura.models import Contenido, Etiqueta, Usuario
from django.core.files.uploadedfile import SimpleUploadedFile

class CrearContenidoViewTest(APITestCase):

    def setUp(self):
        # Crear un usuario para la autenticación usando 'email' en lugar de 'username'
        self.user = Usuario.objects.create_user(
            email="testuser@example.com",  # Usar email en lugar de username
            nombre="Test User",  # Nombre requerido
            password="testpassword"
        )
        
        # Realizamos el login para obtener el token JWT
        response = self.client.post('/api/login/', {
            'email': 'testuser@example.com',
            'password': 'testpassword'
        })

        # Verificamos que el login fue exitoso y obtenemos el token
        self.assertEqual(response.status_code, status.HTTP_200_OK)  # Verificar que el login fue exitoso
        self.token = response.data['access_token']  # Guardar el token en un atributo

        # Crear una etiqueta de prueba
        self.etiqueta = Etiqueta.objects.create(nombre="pop")

    def test_crear_contenido_con_etiquetas(self):
        # Crear un archivo de prueba con la extensión correcta (.mp4)
        archivo = SimpleUploadedFile("video.mp4", b"video content", content_type="video/mp4")

        # Asegurémonos de que las etiquetas sean enviadas como una lista de cadenas de texto
        data = {
            "titulo": "Mi video",
            "tipo": "video",
            "etiquetas": ["pop"],  # Etiquetas como lista de cadenas de texto
            "archivo": archivo
        }

        # Usar el token JWT en los encabezados de autorización
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        # Realizar la solicitud POST
        response = self.client.post("/api/contenidos/crear/", data, format="multipart")

        # Imprimir la respuesta para depuración
        print(response.data)

        # Verificar que la respuesta sea correcta
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("id", response.data)  # Verificar que se ha creado un contenido
        self.assertEqual(response.data["titulo"], "Mi video")  # Verificar el título
        self.assertEqual(response.data["tipo"], "video")  # Verificar el tipo
        self.assertIn("pop", [etiqueta["nombre"] for etiqueta in response.data["etiquetas"]])  # Verificar que la etiqueta esté asociada al contenido

    def test_crear_contenido_sin_etiquetas(self):
        # Crear un archivo de prueba con la extensión correcta (.mp4)
        archivo = SimpleUploadedFile("video.mp4", b"video content", content_type="video/mp4")

        # Crear el payload para la solicitud POST sin etiquetas
        data = {
            "titulo": "Mi video sin etiquetas",
            "tipo": "video",
            "etiquetas": [],  # No enviamos etiquetas
            "archivo": archivo
        }

        # Usar el token JWT en los encabezados de autorización
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        # Realizar la solicitud POST
        response = self.client.post("/api/contenidos/crear/", data, format="multipart")

        # Imprimir la respuesta para depuración
        print(response.data)

        # Verificar que la respuesta sea correcta
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn("id", response.data)  # Verificar que se ha creado un contenido
        self.assertEqual(response.data["titulo"], "Mi video sin etiquetas")  # Verificar el título
        self.assertEqual(response.data["tipo"], "video")  # Verificar el tipo
        self.assertEqual(response.data["etiquetas"], [])  # Verificar que no hay etiquetas

    def test_crear_contenido_con_etiquetas_invalidas(self):
        # Crear un archivo de prueba con la extensión correcta (.mp4)
        archivo = SimpleUploadedFile("video.mp4", b"video content", content_type="video/mp4")

        # Crear el payload para la solicitud POST con una etiqueta no válida
        data = {
            "titulo": "Mi video",
            "tipo": "video",
            "etiquetas": ["1234"],  # Usamos un nombre no válido
            "archivo": archivo
        }

        # Usar el token JWT en los encabezados de autorización
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        # Realizar la solicitud POST
        response = self.client.post("/api/contenidos/crear/", data, format="multipart")

        # Imprimir la respuesta para depuración
        print(response.data)

        # Verificar que la respuesta es un error de validación
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Las etiquetas deben ser cadenas de texto", str(response.data))  # Mensaje de error esperado

    def test_crear_contenido_con_archivo_no_valido(self):
        # Crear un archivo de prueba con una extensión no válida (por ejemplo, un archivo de texto)
        archivo = SimpleUploadedFile("documento.txt", b"texto contenido", content_type="text/plain")

        # Crear el payload para la solicitud POST
        data = {
            "titulo": "Mi video",
            "tipo": "video",
            "etiquetas": ["pop"],  # Etiqueta válida
            "archivo": archivo
        }

        # Usar el token JWT en los encabezados de autorización
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)

        # Realizar la solicitud POST
        response = self.client.post("/api/contenidos/crear/", data, format="multipart")

        # Imprimir la respuesta para depuración
        print(response.data)

        # Verificar que la respuesta es un error de validación de formato
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("Formato de video no permitido", str(response.data))  # Mensaje de error esperado
