const express = require("express"); 
const path = require("path");
const cool = require("cool-ascii-faces");
const app = express();
const PORT = process.env.PORT || 16078;
const {calculatePointsDeducted,sanctionsData,loadInitialDataDLC} = require("./js/index-DLC"); 
const CalculateChanges = require("./js/index-JVF");
const {calculateDeceased,siniestralidadData,loadInitialDataMRC} = require("./js/index-MRC");
const BASE_API = "/api/v1"

let sanctionsAndPoints2022Stats = sanctionsData;
let siniestralidadData2023 = siniestralidadData;

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json())

// Ruta para servir "about.html" en "/about"
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/about.html"));
});

// Ruta para "/cool"
app.get("/cool", (req, res) => {
    res.send(cool());
});

// APIs de DLC
app.get(BASE_API + "/sanctions-and-points-stats/loadInitialData", (req, res) => {
    const result = loadInitialDataDLC();
    sanctionsAndPoints2022Stats = result;
    res.send(JSON.stringify(result));
});


//GET todos los datos
app.get(BASE_API + "/sanctions-and-points-stats", (req, res) => {
    let sanctionsAndPoints2022StatsFiltered= sanctionsAndPoints2022Stats
    let {ine_code,province,autonomous_community,year,from,to} = req.query
    if (province!==undefined){
        sanctionsAndPoints2022StatsFiltered=sanctionsAndPoints2022StatsFiltered
            .filter(stat=>stat.province.toLowerCase()=== province.toLowerCase())
    }
    if (autonomous_community!==undefined){
        sanctionsAndPoints2022StatsFiltered=sanctionsAndPoints2022StatsFiltered
            .filter(stat=>stat.autonomous_community.toLowerCase()=== autonomous_community.toLowerCase())
    }
    if (year!==undefined){
        sanctionsAndPoints2022StatsFiltered=sanctionsAndPoints2022StatsFiltered
            .filter(stat=>stat.year=== Number(year))
    }
    if (ine_code!==undefined){
        sanctionsAndPoints2022StatsFiltered=sanctionsAndPoints2022StatsFiltered
        .filter(stat=>stat.ine_code=== Number(ine_code))
        if(sanctionsAndPoints2022Stats.length ===1){
            sanctionsAndPoints2022StatsFiltered = sanctionsAndPoints2022Stats[0]            
        }
    }    
    if (from!==undefined){
        sanctionsAndPoints2022StatsFiltered=sanctionsAndPoints2022StatsFiltered
            .filter(stat=>stat.year>= Number(from))
    }
    if (to!==undefined){
        sanctionsAndPoints2022StatsFiltered=sanctionsAndPoints2022StatsFiltered
            .filter(stat=>stat.year<= Number(to))
    }
    res.send(JSON.stringify(sanctionsAndPoints2022StatsFiltered,null,2));
    res.send(console.log(Array.isArray(sanctionsAndPoints2022Stats))); // Comprueba si es de verdad un array
    (console.log(typeof(sanctionsAndPoints2022Stats))); // Comprueba si es de verdad un objeto
});
//POST a todos los datos
app.post(BASE_API + "/sanctions-and-points-stats/",(req,res)=>{   
    let {ine_code,province,autonomous_community,year,total_sanctions_with_points,total_points_deducted} = req.body
    if (ine_code === undefined || province === undefined || autonomous_community === undefined || 
        year === undefined || total_sanctions_with_points === undefined || total_points_deducted === undefined) {
        return res.sendStatus(400);
    }
    
    if(sanctionsAndPoints2022Stats.some(sanction=>sanction.ine_code===ine_code)){
        return res.sendStatus(409);
        }
    let newSanction = req.body
    sanctionsAndPoints2022Stats.push(newSanction)
    res.sendStatus(201);
    
});

//FALLO DE PUT a todos los datos
app.put(BASE_API + "/sanctions-and-points-stats/",(req,res)=>{    
    
    res.sendStatus(405);
});

//DELETE de todos los datos
app.delete(BASE_API + "/sanctions-and-points-stats", (req, res) => {
    sanctionsAndPoints2022Stats = []; // Vaciar el array
    console.log("Todos los datos han sido eliminados."); // Para ver en consola
    res.sendStatus(200); 
});

//GET de un dato especifico
app.get(BASE_API + "/sanctions-and-points-stats/:ine_code", (req, res) => {
    let paramIneCode = Number(req.params.ine_code); // Convertir a número
    // Buscar el objeto por ine_code
    let sanction = sanctionsAndPoints2022Stats.find(sanction => sanction.ine_code === paramIneCode);
    // Si no se encuentra, devolver 404
    if (!sanction) {
        return res.sendStatus(404);
    }
    // Enviar la sanción encontrada
    res.send(JSON.stringify(sanction,null,2))
    res.status(200);
});

//FALLO DE POST de un dato especifico
app.post(BASE_API + "/sanctions-and-points-stats/:ine_code",(req,res)=>{    
    
    res.sendStatus(405);
});

//PUT de un dato especifico
app.put(BASE_API + "/sanctions-and-points-stats/:ine_code", (req, res) => {
    let { ine_code, province, autonomous_community, year, total_sanctions_with_points, total_points_deducted } = req.body;
    let paramIneCode = req.params.ine_code;    
    // Verificar si el ID de la URL coincide con el del cuerpo
    if (ine_code !== Number(paramIneCode)) {
        return res.sendStatus(400);
    }    
    // Comprobar si el recurso existe
    let index = sanctionsAndPoints2022Stats.findIndex(sanction => sanction.ine_code === Number(paramIneCode));
    if (index === -1) {
        return res.sendStatus(404);
    }    
    // Actualizar el recurso
    sanctionsAndPoints2022Stats[index] = req.body;
    res.sendStatus(200);
});

//DELETE de un dato especifico
app.delete(BASE_API + "/sanctions-and-points-stats/:ine_code", (req, res) => {
    let paramIneCode = req.params.ine_code;    
    
    // Comprobar si el recurso existe
    let index = sanctionsAndPoints2022Stats.findIndex(sanction => sanction.ine_code === Number(paramIneCode));
    if (index === -1) {
        return res.sendStatus(404);
    }    
    // Actualizar el recurso
    sanctionsAndPoints2022Stats=sanctionsAndPoints2022Stats.filter(sanction => sanction.ine_code !== Number(paramIneCode));
    res.sendStatus(200);
});


app.get(BASE_API + "/accident-rate-2023-stats/loadInitialData", (req, res) => {
    const result = loadInitialDataMRC();
    siniestralidadData2023 = result;
    res.send(JSON.stringify(result));
});


app.get(BASE_API + "/accident-rate-2023-stats", (req, res) => {
    let siniestralidadData2023Filter= siniestralidadData2023
    let {ine_code,municipality,province,ccaa,year,from,to} = req.query
    if (municipality!==undefined){
        siniestralidadData2023Filter=siniestralidadData2023Filter
            .filter(stat=>stat.municipality.toLowerCase()=== municipality.toLowerCase())
    }if (province!==undefined){
        siniestralidadData2023Filter=siniestralidadData2023Filter
            .filter(stat=>stat.province.toLowerCase()=== province.toLowerCase())
    }if (ccaa!==undefined){
        siniestralidadData2023Filter=siniestralidadData2023Filter
            .filter(stat=>stat.ccaa.toLowerCase()=== ccaa.toLowerCase())
    }if (year!==undefined){
        siniestralidadData2023Filter=siniestralidadData2023Filter
            .filter(stat=>stat.year=== Number(year))
    }if (ine_code!==undefined){
        siniestralidadData2023Filter=siniestralidadData2023Filter
        .filter(stat=>stat.ine_code=== Number(ine_code))
        if(siniestralidadData2023.length ===1){
            siniestralidadData2023Filter = siniestralidadData2023Filter[0]            
        }
    }if (from!==undefined){
        siniestralidadData2023Filter=siniestralidadData2023Filter
            .filter(stat=>stat.year>= Number(from))
    }if (to!==undefined){
        siniestralidadData2023Filter=siniestralidadData2023Filter
            .filter(stat=>stat.year<= Number(to))
    }
    res.send(JSON.stringify(siniestralidadData2023Filter,null,2));
    res.send(console.log(Array.isArray(siniestralidadData2023))); // Comprueba si es de verdad un array
    (console.log(typeof(siniestralidadData2023))); 
});

app.post(BASE_API + "/accident-rate-2023-stats/",(req,res)=>{   
    let {ine_code,municipality,province,ccaa,year,deceased,injured_hospitalized,injured_not_hospitalized} = req.body
    if (ine_code === undefined || municipality ===undefined || province === undefined || ccaa === undefined || 
        year === undefined || deceased === undefined || injured_hospitalized === undefined || injured_not_hospitalized===undefined) {
        return res.sendStatus(400);
    }if(siniestralidadData2023.some(row=>row.ine_code===ine_code)){
        return res.sendStatus(409);
    }
    let newRow = req.body
    siniestralidadData2023.push(newRow)
    res.sendStatus(201);
    
});

app.delete(BASE_API + "/accident-rate-2023-stats", (req, res) => {
    siniestralidadData2023 = []; // Vaciamos el array
    console.log("Todos los datos han sido eliminados.");
    res.sendStatus(200); 
});


app.put(BASE_API + "/accident-rate-2023-stats/",(req,res)=>{    
    res.sendStatus(405);
});

app.get(BASE_API + "/accident-rate-2023-stats/:ine_code", (req, res) => {
    let ineCode = Number(req.params.ine_code); 
    let object = siniestralidadData2023.find(object => object.ine_code === ineCode);
    if (!object) {
        return res.sendStatus(404);
    }
    res.send(JSON.stringify(object,null,2))
    res.status(200);
});

app.post(BASE_API + "/accident-rate-2023-stats/:ine_code",(req,res)=>{    
    res.sendStatus(405);
});

app.put(BASE_API + "/accident-rate-2023-stats/:ine_code", (req, res) => {
    let {ine_code,municipality,province,ccaa,year,deceased,injured_hospitalized,injured_not_hospitalized} = req.body;
    let ineCode = req.params.ine_code;    
    // Verificar si el ID de la URL coincide con el del cuerpo
    if (ine_code !== Number(ineCode)) {
        return res.sendStatus(400);
    }let i = siniestralidadData2023.findIndex(object => object.ine_code === Number(ineCode));
    if (i === -1) {
        return res.sendStatus(404);
    }siniestralidadData2023[i] = req.body;
    res.sendStatus(200);
});

//DELETE de un dato especifico
app.delete(BASE_API + "/accident-rate-2023-stats/:ine_code", (req, res) => {
    let ineCode = req.params.ine_code;    
    let i = siniestralidadData2023.findIndex(object => object.ine_code === Number(ineCode));
    if (i === -1) {
        return res.sendStatus(404);
    }siniestralidadData2023=siniestralidadData2023.filter(sanction => sanction.ine_code !== Number(ineCode));
    res.sendStatus(200);
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
    let resp= calculateDeceased("Comunitat Valenciana") 
        res.send(`<h1>Resultado del calculo</h1><p>${resp}</p>`);
    
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});