# AFIP API simplificada

La función principal de este API es simplificar el acceso a los WebServices de AFIP y principalmente Factura Electrónica. Para generar los certificados y darse de alta en el Servicio de Homologación (Pruebas) usar esta web: [AFIP WS](http://www.afip.gob.ar/ws)

### Pasos para hacer funcionar el API

1. Desde el root `npm install`
2. Desde el root correr `./tools/keygen.sh /C=AR/O=Nombre Desarrollador/CN=Nombre Desarrollador/serialNumber=CUIT 00000000000`
3. Correr la app  
   3a) Para Homologación: `node server.js`  
   3b) Para Producción: `NODE_ENV=production node server.js`

### Endpoints

> Para probar los endpoints que genera el API se proveen ejemplos con el API WSFEv1 mediante postman (Descarga: https://chrome.google.com/webstore/detail/postman/fhbjgbiflinjbdggehcddcbncdddomop )

1. Luego de descargar Postman importar el archivo que se encuentra en [postman/AFIP API.postman_collection.json](/postman/AFIP_API.postman_collection.json)
1. Para aquellos Endpoints que requiren CUIT Revisar las variables de entorno

### Cómo funcionan los endpoints

> La idea del API es hacer genéricas las llamadas y preservar la autenticación obtenida

1. Describir el endpoint: `/api/aqui_servicio/describe`. Ej. de Servicio: `wsfev1`
2. Para realizar llamado `/api/aqui_servicio/aqui_metodo`  
   2a) Servicio: `wsfev1`  
   2b) Método: `FEDummy`. Puede ser cualquiera de los obtenidos mediante describe.

Versiones:

**0.8.0:**

-   Se corrige el error de cuit no válido para el servicio wsfev1
-   Nuevos archivos de variables de entorno setenv.js y setenv.prod.js
-   Las variables globales pasan a ser variables de entorno
-   Ejemplos más completos en la colección de Postman y en formato JSON
