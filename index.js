//Servidor
//1. Integrar express-fileupload a Express.
const express = require("express");
const app = express();
const expressFileUpload = require("express-fileupload");
const fs = require("fs");
const bodyParser = require("body-parser");
app.listen(3000);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//2. Definir que el límite para la carga de imágenes es de 5MB.
app.use(
    expressFileUpload({
        limits: { fileSize: 50000000 },
        abortOnLimit: true,
        responseOnLimit:
            "El peso de la foto que intentas subir supera el limite permitido",
    }) //3. Responder con un mensaje indicando que se sobrepasó el límite especificado.
);
//disponibilizar la carpeta
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/formulario.html");
});

app.get("/collage", (req, res) => {
    res.sendFile(__dirname + "/collage.html");
});

//4. Crear una ruta POST /imagen que reciba y almacene una imagen en una carpeta pública del servidor. Considerar que el 
//formulario envía un payload con una propiedad “position”, que indica la posición del collage donde se deberá mostrar la imagen.
app.post("/imagen", (req, res) => {
    console.log(req.files)
    const { target_file } = req.files;
    const { posicion } = req.body;
    const name = `imagen-${posicion}`;
    target_file.mv(`${__dirname}/public/imgs/${name}.jpg`, (err) => {
        res.sendFile(__dirname + "/collage.html");//res.send es solo para enviar texto y el sendFile es para que se visualice como tal ene le navegador
    });
});

//5. Crear una ruta GET /deleteImg/:nombre que reciba como parámetro el nombre de una imagen y la elimine de la carpeta en
//donde están siendo alojadas las imágenes. Considerar que esta interacción se ejecuta al hacer click en alguno de los números del collage
app.get("/deleteImg/:nombre", (req, res) => {
    const { nombre } = req.params;
    fs.unlink(`${__dirname}/public/imgs/${nombre}`, (err) => {
        res.redirect(`/collage`);

    });
});
