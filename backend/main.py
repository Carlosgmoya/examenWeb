from fastapi import FastAPI, HTTPException, Request, UploadFile, File
from pydantic import BaseModel
from google.oauth2 import id_token
from google.auth.transport import requests
from pymongo import MongoClient
from pymongo.server_api import ServerApi
from fastapi.middleware.cors import CORSMiddleware
import json
from bson.objectid import ObjectId
import os
from pathlib import Path
import shutil
import imagenes
# python -m uvicorn main:app --reload --port 8000

# Configuración de FastAPI y MongoDB

app = FastAPI()

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000/"], 
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos los métodos (POST, GET, OPTIONS, etc.)
    allow_headers=["*"],  # Permite todos los headers
)


uri = "mongodb+srv://carlos:1234@cluster0.bv6um.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Articulo conectado a MongoDB!")
except Exception as e:
    print(e)

# Base de Datos

database = client["Examen3"]
usuarioBD = database["Usuario"]
imagenesBD = database["imagenes"]
mapaBD = database["mapa"]

GOOGLE_CLIENT_ID = "316158158631-9n48p9n0tbbhn2b7qrcjvcehrpsl0h5q.apps.googleusercontent.com"


########## Metodos Complementarios ############

def getID(json: json):
    dict = json["_id"]
    id = dict["$oid"]

    return id

def getObjID(id: str):
    try:
        objID = ObjectId(id)
    except Exception as e:
        raise HTTPException(status_code=400, detail="Formato de ID inválido")

    return objID


# Modelo de Pydantic para la solicitud
class TokenRequest(BaseModel):
    token: str


@app.post("/api/auth/google")
async def google_auth(token_request: TokenRequest, request: Request):
    print("Headers:", request.headers)
    print("Body:", await request.body())
    try:
        # Verificar el token de Google
        id_info = id_token.verify_oauth2_token(
            token_request.token,
            requests.Request(),
            GOOGLE_CLIENT_ID
        )

        # Extraer información del usuario
        user_data = {
            "google_id": id_info["sub"],
            "email": id_info["email"],
            "name": id_info.get("name"),
            "picture": id_info.get("picture"),
        }

        # Comprobar si el usuario ya existe en la base de datos
        existing_user = usuarioBD.find_one({"google_id": user_data["google_id"]})

        if not existing_user:
            # Si el usuario no existe, lo guardamos
            usuarioBD.insert_one(user_data)

        return {"message": "Usuario autenticado", "user": user_data}
    except ValueError as e:
        # Token inválido
        raise HTTPException(status_code=401, detail="Token no válido")

@app.post("/subirImagen")
async def subirImagen(archivo : UploadFile = File(...)):
    #rutaLocal = "C:/Users/cgmoy/Desktop/prueba.png"
    carpeta_destino = Path("imagenes_temporales")
    carpeta_destino.mkdir(parents=True, exist_ok=True)
    rutaLocal = carpeta_destino / archivo.filename
    with rutaLocal.open("wb") as buffer:
        shutil.copyfileobj(archivo.file, buffer)

    if rutaLocal:  # Si el usuario seleccionó un archivo
        rutaRemota = f"/{archivo.filename}"  # Asignar un nombre de archivo en Dropbox
        imagenes.subirImagenDropbox(rutaLocal, rutaRemota)
        enlace = imagenes.obtenerEnlaceImagen(rutaRemota)
        print(f"Enlace directo a la imagen: {enlace}")
    else:
        print("No se seleccionó ningún archivo.")
    os.remove(rutaLocal)
   
    return await "Ya existe una imagen con ese nombre" if enlace is None else "Subido satisfactoria mente"