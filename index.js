const express = require("express"); 
const path = require("path");
const cool = require("cool-ascii-faces");
const app = express();
const PORT = process.env.PORT || 16078;
const {calculatePointsDeducted,sanctionsData,loadInitialDataDLC} = require("./js/index-DLC"); 
const CalculateChanges = require("./js/index-JVF");
const calculateDeceased = require("./js/index-MRC");
const BASE_API = "/api/v1"

let sanctionsAndPoints2022Stats = sanctionsData;

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "/public")));

// Ruta para servir "about.html" en "/about"
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/about.html"));
});

// Ruta para "/cool"
app.get("/cool", (req, res) => {
    res.send(cool());
});


app.get(BASE_API + "/sanctions-and-points-stats", (req, res) => {
    sanctionsAndPoints2022Stats = sanctionsData;
    res.send(JSON.stringify(sanctionsAndPoints2022Stats,null,2));
});
app.get(BASE_API + "/sanctions-and-points-stats/loadInitialData", (req, res) => {
    const result = loadInitialDataDLC();
    sanctionsAndPoints2022Stats = result.data;
    res.send(JSON.stringify(result));
});

// Nueva ruta "/samples/DLC" para ejecutar el algoritmo y devolver el resultado
app.get("/samples/DLC", (req, res) => {
    let ress = calculatePointsDeducted("Comunitat Valenciana")    
        res.send(`<h1>Resultado del cálculo</h1><p>Media de total_points_deducted en ${ress[0]}: ${ress[1].toFixed(2)}</p>`);
});

// Nueva ruta "samples/JVF" para ejecutar el algoritmo y devolver el resultado 
app.get("/samples/JVF", (req,res) => {
    let respond=CalculateChanges()
        res.send(`<h1>Resultado del cálculo</h1>${respond}<p></p>`);
});

app.get("/samples/MRC", (req,res) => {
    let resp=calculateDeceased() 
        res.send(`<h1>Resultado del calculo</h1><p>${resp}</p>`);
    
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});