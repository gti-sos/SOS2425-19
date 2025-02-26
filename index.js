const express = require("express");
const cool = require("cool-ascii-faces");
const app = express();
const PORT = process.env.PORT || 16078;
const generateAboutPage = require("./generateAbout"); // Importa y ejecuta
const calculatePointsDeducted = require("./index-DLC"); // Importamos la función corregida


// Generar about.html antes de iniciar el servidor
generateAboutPage();

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static((__dirname + "public")));

// Ruta para servir "about.html" en "/about"
app.get("/about", (req, res) => {
    res.sendFile((__dirname +"/public/"+ "about.html"));
});

// Ruta para "/cool"
app.get("/cool", (req, res) => {
    res.send(cool());
});

// Nueva ruta "/samples/DLC" para ejecutar el algoritmo y devolver el resultado
app.get("/samples/DLC", (req, res) => {
    calculatePointsDeducted((resultado) => {
        res.send(`<h1>Resultado del cálculo</h1><p>${resultado}</p>`);
    });
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});