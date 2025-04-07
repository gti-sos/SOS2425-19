import express from "express";
import path from "path";
import {loadBackendDLC} from "./src/back/index-DLC.js";
import {loadBackendMRC} from "./src/back/index-MRC.js";
import { loadBackendJVF } from "./src/back/index-JVF.js";
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const app = express();
const PORT = process.env.PORT || 16078;



//Exports de los index-XXX..
//const {CalculateChanges,InitialData,ChangesData} = require("./src/js/index-JVF.js");
//const {calculateDeceased,siniestralidadData,loadInitialDataMRC} = require("./src/js/index-MRC.js");



//Datos de los CSV
//let ownershipsChangesYear2023Stats = ChangesData;.
//let siniestralidadData2023 = siniestralidadData;

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json())

// Ruta para servir "about.html" en "/about"
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/about.html"));
});
// Ruta para servir "index.html" en "/"
app.get("/about", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

loadBackendDLC(app);

loadBackendJVF(app);

loadBackendMRC(app);



/*
//APIs - JVF
app.get(BASE_API + "/ownerships-changes-stats/loadInitialData", (req, res) =>{

    if (ownershipsChangesYear2023Stats.length<=0){
        ownershipsChangesYear2023Stats=InitialData();
    }
    else{
        return res.status(400).json({message: "Ya tiene datos"})
    }
    res.send(JSON.stringify(ownershipsChangesYear2023Stats));
});

//GET todos los datos - julián
app.get( BASE_API + "/ownerships-changes-stats", (req,res) =>{
    let ownershipsChangesYear2023Stats_Filtered = ownershipsChangesYear2023Stats;
    let{autonomous_community,province,truck,van,bus,car,motocycle,other_vehicle,from,to,year} = req.query;
    if (province !== undefined){
        ownershipsChangesYear2023Stats_Filtered=ownershipsChangesYear2023Stats_Filtered
        .filter(dato => dato.province.toLowerCase() === province.toLowerCase());
    }
    if(autonomous_community !== undefined){
        ownershipsChangesYear2023Stats_Filtered=ownershipsChangesYear2023Stats_Filtered
        .filter(dato => dato.autonomous_community.toLowerCase() === autonomous_community.toLowerCase());
    }
    if(truck !== undefined){
        ownershipsChangesYear2023Stats_Filtered=ownershipsChangesYear2023Stats_Filtered
        .filter(dato => dato.truck === Number(truck));
    }
    if(car !== undefined){
        ownershipsChangesYear2023Stats_Filtered=ownershipsChangesYear2023Stats_Filtered
        .filter(dato => dato.car === Number(car));
    }
    if(motocycle!==undefined){
        ownershipsChangesYear2023Stats_Filtered=ownershipsChangesYear2023Stats_Filtered
        .filter(dato => dato.motocycle=== Number(motocycle));}
    if(van!==undefined){
        ownershipsChangesYear2023Stats_Filtered=ownershipsChangesYear2023Stats_Filtered
        .filter(dato => dato.van === Number(van));
    }
    if(bus!==undefined){
        ownershipsChangesYear2023Stats_Filtered=ownershipsChangesYear2023Stats_Filtered
        .filter(dato => dato.bus === Number(bus));
    }
    if(other_vehicle !== undefined){
        ownershipsChangesYear2023Stats_Filtered=ownershipsChangesYear2023Stats_Filtered
        .filter(dato => dato.other_vehicle === Number(other_vehicle));
    }
    if(year !== undefined){
        ownershipsChangesYear2023Stats_Filtered=ownershipsChangesYear2023Stats_Filtered
        .filter(dato => dato.year === Number(year));
    }
    if(from !== undefined){
        ownershipsChangesYear2023Stats_Filtered=ownershipsChangesYear2023Stats_Filtered
        .filter(dato => dato.year >= Number(from))
    }
    if(to !== undefined){
        ownershipsChangesYear2023Stats_Filtered=ownershipsChangesYear2023Stats_Filtered
        .filter(dato => dato.year <= Number(to))
    }
res.send(JSON.stringify(ownershipsChangesYear2023Stats_Filtered,null,2));
res.send(console.log(Array.isArray(ownershipsChangesYear2023Stats)));
(console.log(typeof(ownershipsChangesYear2023Stats)));
});

//POSTs
app.post(BASE_API + "/ownerships-changes-stats/",(req,res) => {
    let {autonomous_community,province,truck,van,bus,car,motocycle,other_vehicle,year}=req.body
    if  (autonomous_community ===undefined || province ===undefined || truck ===undefined || van ===undefined ||
         bus ===undefined || car ===undefined || motocycle===undefined || other_vehicle ===undefined || year ===undefined){
            return res.sendStatus(400)
         }
    if (ownershipsChangesYear2023Stats.some(datin => datin.province === province)) {
        return res.sendStatus(409)
    }
    let newChange=req.body;
    ownershipsChangesYear2023Stats.push(newChange);
    res.sendStatus(201);
});

//FALLO DE PUT Todo
app.put(BASE_API + "/ownerships-changes-stats/", (req,res) => {
    res.sendStatus(405);
});

//Delete Todo
app.delete(BASE_API + "/ownerships-changes-stats", (req,res) =>{
    ownershipsChangesYear2023Stats = [];
    console.log("Todos los datos han sido eliminados.");
    res.sendStatus(204);
});

// GET de un dato
app.get(BASE_API + "/ownerships-changes-stats/:province", (req,res) => {
    let parametro= req.params.province;
    let change = ownershipsChangesYear2023Stats.find(change => change.province===parametro);
    if (!change){
        return res.sendStatus(404);
    } 
    res.send(JSON.stringify(change,null,2))
    res.status(200);
});

//FALLO de post dat específico
app.post(BASE_API + "/ownerships-changes-stats/:province" , (req,res)=>{
    res.sendStatus(405);
});

//PUT dato especifico
app.put(BASE_API + "/ownerships-changes-stats/:province" , (req,res) => {
    let {autonomous_community,province,truck,van,bus,car,motocycle,other_vehicle,year}=req.body;
    let parametro= req.params.province.toLowerCase();
    if(province !== parametro){
        res.sendStatus(400);
    }
    let index = ownershipsChangesYear2023Stats.findIndex(change => change.province.toLowerCase() === parametro);

    if (index=== -1){
        return res.sendStatus(404);
    }

    ownershipsChangesYear2023Stats[index]=req.body;
    res.sendStatus(200);    
});

//DELETE dato especifico 
app.delete(BASE_API + "/ownerships-changes-stats/:province" , (req,res)=> {
    let parametro= req.params.province.toLowerCase()
    let index = ownershipsChangesYear2023Stats.findIndex(change => change.province.toLowerCase() === parametro);

    if (index=== -1){
        return res.sendStatus(404);
    }

    ownershipsChangesYear2023Stats=ownershipsChangesYear2023Stats.filter(change => change.province ===parametro);
    res.sendStatus(200); 
});

========================

//APIs MARIO
app.get(BASE_API + "/accident-rate-2023-stats/loadInitialData", (req, res) => {
    if (siniestralidadData2023.length<=0){
        siniestralidadData2023=loadInitialDataMRC();
    }
    else{
        return res.status(400).json({message: "Ya tiene datos"})
    }
    res.send(JSON.stringify(siniestralidadData2023));
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
    }if(siniestralidadData2023.some(row=>row.ine_code===Number(ine_code))){
        return res.sendStatus(409);
    }
    let newRow = req.body;
    siniestralidadData2023.push(newRow);
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




// Nueva ruta "samples/JVF" para ejecutar el algoritmo y devolver el resultado 
app.get("/samples/JVF", (req,res) => {
    let respond=CalculateChanges()
        res.send(`<h1>Resultado del cálculo</h1>${respond}<p></p>`);
});

app.get("/samples/MRC", (req,res) => {
    let resp= calculateDeceased("Comunitat Valenciana") 
        res.send(`<h1>Resultado del calculo</h1><p>${resp}</p>`);
    
});
*/
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});
