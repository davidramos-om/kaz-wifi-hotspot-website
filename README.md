# kaz-BE

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run debug
```

### Compiles and minifies for production
```
npm run start
```

### Deploy en Heroku :
https://kaz-be.herokuapp.com/


### Iniciar y conectar a mongo db en docker container
 
[Ver más](https://hub.docker.com/_/mongo?tab=description&page=1&ordering=last_updated)
```bash
    docker run --name kaz-wifi-db  -d mongo:latest
    docker run -d -p 27017:27017 -v ~/data:/data/db mongo
    # Indicar a mongo que acepte conexiones externas
    mongod --bind_ip_all

    #Conectarse a la bdd : mongo
    #Ver bases de datos :  show dbs
    #Usar base de datos : use <NombreDB> / Si no existe, la creara al crear un collection
    #Ver collections/tablas :  show collections
    #Crear collection/table : db.createCollection("Empresas", { capped : true, size : 524288 } )
    #Ver datos en un collection/table : db.Empresas.find()
    #Insertar datos en un collection/table : db.Empresas.insert({Nombre : "", RTN : "", ....sucesivamente })

    #Devuelve conexión :  db.getMongo()
    #Devuelve nombre bdd : db.getName()
    #Devuelve info del servidor : db.hostInfo()

    #Ejemplo connectionString para compasDB : 
    mongodb://127.0.0.1:27017/?compressors=zlib&readPreference=primary&gssapiServiceName=mongodb&appname=MongoDB%20Compass&ssl=false

    #Crear usuario :
    use admin
    db.createUser(
    {
        user: "myUserAdmin",
        pwd: "rf3t46qjgw"
        roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
    })

    #Conectarse despues de crear el usuario :
    mongo --port 27017  --authenticationDatabase "admin" -u "myUserAdmin" -p
    mongo --port 27017  --authenticationDatabase "kaz-wifi" -u "kaz-usr" -p


    use kaz-wifi
    db.createUser(
    {
        user: "kaz-usr",
        pwd: "rf3t4BC444.",
        roles: [ { role: "dbAdmin", db: "kaz-wifi" }, "readWrite" ]
    }
    )

    #Errores de mongo
    https://docs.mongodb.com/manual/reference/exit-codes/

```

# Temporal : 
Sección de video : <% include partials/video %>