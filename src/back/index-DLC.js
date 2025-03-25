import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const TARGET_REGION = 'Comunitat Valenciana'; // Cambia esto según la comunidad autónoma deseada
const FILE_PATH = path.join(__dirname, '../../data/DatosProvincialesSancionesPuntos_2022.csv')

function csvToArray(csvString, delimiter = ";") {
    const lines = csvString.trim().split("\n");
    const headers = lines[0].split(delimiter).map(header => header.trim());

    return lines.slice(1).map(line => {
        const values = line.split(delimiter).map(value => value.trim());
        return headers.reduce((obj, header, index) => {
            obj[header] = isNaN(values[index]) ? values[index] : Number(values[index]);
            return obj;
        }, {});
    });
}

const csvContent = fs.readFileSync(FILE_PATH, 'utf8');

const sanctionsData = csvToArray(csvContent);

function calculatePointsDeducted(target) {
let filtered = sanctionsData.filter((x)=> x.autonomous_community === target)

let totalPoints = filtered.reduce((sum, points) => sum + points.total_points_deducted, 0);
let average = filtered.length > 0 ? totalPoints / filtered.length : 0;


console.log(`Media de total_points_deducted en ${TARGET_REGION} :`, average.toFixed(2));
return [target,average];
}


function loadInitialDataDLC(){
    const sanctionsData = [
        {ine_code: 3037, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3038, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3039, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3040, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3041, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 148, total_points_deducted: 696},
        {ine_code: 3042, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 4, total_points_deducted: 18},
        {ine_code: 3043, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3044, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3045, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3046, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3047, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 72, total_points_deducted: 330},
        {ine_code: 3048, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 11, total_points_deducted: 51},
        {ine_code: 3049, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 179, total_points_deducted: 809},
        {ine_code: 3050, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 262, total_points_deducted: 1121}
        
    ];
    return sanctionsData
}

const BASE_API = "/api/v1"
function loadBackendDLC(app){
    
let sanctionsAndPoints2022Stats = sanctionsData;

    // APIs de DLC
app.get(BASE_API + "/sanctions-and-points-stats/loadInitialData", (req, res) => {
    if (sanctionsAndPoints2022Stats.length<=0){
        sanctionsAndPoints2022Stats=loadInitialDataDLC();
    }
    else{
        return res.status(400).json({message: "Ya tiene datos"})
    }
    res.send(JSON.stringify(sanctionsAndPoints2022Stats));
});


//GET todos los datos - Dani
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
}

export {loadBackendDLC,calculatePointsDeducted,sanctionsData,loadInitialDataDLC};
