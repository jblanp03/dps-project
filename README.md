# dps-project


# DPS PROJECT

Pasos a seguir para lanzar servicio:

1. Descargar el respositorio

2. Se necesitan instalar los paquetes de node.js. En una terminal de VSCode (o del IDE) ejecutar:

npm install

3. Para lanzar el servicio:

node server.js

4. Acceder al servicio:

http://localhost:8080

5. Abrir otra terminal para ejecutar el microservicio de python. En la terminal:

cd python

6. Ejecutar el microservicio en 127.0.0.1:5000:

python chatbot.py



# Cambios y compilación frontend

El frontend está compilado en el directorio /dist. Para realizar modificaciones sobre el frontend se debe trabajar dentro de /frontend. Una vez se hayan realizado los 
cambios oportunos, para sustituir los cambios se debe volver a crear un /dist y sustituir por el /dist actual. Esto se puede hacer gracias vue-cli-service (paquete
instalado). Para ello, en la terminal (dentro de /frontend) se debe ejecutar:

npm run build

