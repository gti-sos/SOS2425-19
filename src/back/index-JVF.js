import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import dataStore from "nedb";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const TARGET_REGION = "Andalucia";
const File_path =path.join(__dirname, '../data/EstadisticasCambioTitularidad.csv');


function CsvToArray(csvFile,delimiter =';' ){
    //separamos las lineas yla cabecera del csv
    const lines=csvFile.trim().split('\n');
    const headers=lines[0].split(delimiter).map(header => header.trim());

    //a cada linea le aplicamos un parseo para devolverlo como un map header=valor
    return lines.slice(1).map( line=> {
        const valores = line.split(delimiter).map(valor => valor.trim());
        return headers.reduce((obj, header, index) => {
            obj[header] = isNaN(valores[index]) ? valores[index] : Number(valores[index]);
            return obj;
        }, {});
    });
}

const csvContent= fs.readFileSync(File_path,'utf8');

const ChangesData=CsvToArray(csvContent);

const database= new dataStore();

/*
function CalculateChanges(target){

    // filtrado por la comunidad autonoma 
    let filtrado = ChangesData.filter((x)=> x.autonomous_community === target);

    let totalChanges= filtrado.reduce((sum,changes) => sum+ changes.car,0);

    let averageChanges = filtrado.length > 0 ? totalChanges / filtrado.length : 0;

    console.log(`Media de cambios de coches en ${TARGET_REGION}:`, averageChanges);
    return [target,averageChanges];
}
*/

function InitialData(){

    let Data= [
        {autonomous_community:"andalucia", province:"jaen", truck:2620, van:3710, bus:55, car:19639, motocycle:3297, other_vehicle:774, year:2023},
        {autonomous_community:"andalucia", province:"granada", truck:3127, van:3787, bus:99, car:33356, motocycle:9888,  other_vehicle:1099, year:2023},
        {autonomous_community:"andalucia", province:"malaga", truck:6254, van:8913, bus:133, car:80556, motocycle:19402, other_vehicle:1435,  year:2023},
        {autonomous_community:"aragon", province:"zaragoza", truck:2988, van:4402, bus:55, car:39804, motocycle:6791, other_vehicle:1008, year:2023},
        {autonomous_community:"aragon", province:"teruel", truck:1905, van:1099, bus:4, car:5545, motocycle:481, other_vehicle:119,  year:2023},
        {autonomous_community:"aragon", province:"huesca", truck:1494, van:1199, bus:17, car:9452, motocycle:900,  other_vehicle:314, year:2023},
        {autonomous_community:"canarias", province:"santa cruz de tenerife", truck:7614, van:5544, bus:212, car:47106, motocycle:9429, other_vehicle:1203,  year:2023},
        {autonomous_community:"cantabria", province:"cantabria", truck:1966, van:1936, bus:24, car:23810, motocycle:4081,  other_vehicle:533,  year:2023},
        {autonomous_community:"castilla y leon", province:"segovia", truck:493, van:490, bus:11, car:4473, motocycle:2143, other_vehicle:197,  year:2023},
        {autonomous_community:"castilla y leon", province:"salamanca", truck:973, van:1064, bus:48, car:13084, motocycle:1429, other_vehicle:327,  year:2023}
        
    ];

    return Data;
}

const BASE_API= "api/v1";


function loadBackendJVF( app ){
    //APIs
    //DOC POSTMAN

    app.get( BASE_API + "/ownerships-changes-stats/docs", (req,res) => 
        { 
            res.redirect();
        });

    app.get(BASE_API + "/ownerships-changes-stats/loadInitialData", (req,res) => 
        {
            database.count({},(err,count) =>
            {
                if(err)
                {
                    return res.status(500).send("Error al comprobar la base de datos");
                }

                if(count>0)
                {
                    return res.status(400).json( {message: "Ya hay datos"});
                }
            
                const cargaDatos= InitialData();
                database.insert( cargaDatos, (err,newDocs) =>  
                {
                    if(err)
                    {
                        return res.status(500).send("error al insertar datos");
                    }
                    database.find({}, (err,ownerships) =>
                    {
                        if(err)
                        {  
                            return res.status(500).send("error al recuperar los datos");
                        }
                        res.send(JSON.stringify(ownerships.map((x) => 
                        {
                                delete x._id
                                return x;
                        }),null,2));
                    });
                });
            });
        });

    //GET todos los datos con paginación
    app.get(BASE_API + "/ownerships-changes-stats" , (req,res) => 
        {

        });


    //FALLO DE PUT Todo
    app.put(BASE_API + "/ownerships-changes-stats/", (req,res) => 
        {
        res.sendStatus(405);
        });
    
    //DELETE todo
    app.delete(BASE_API + "/ownerships-changes-stats", (req,res) =>
        {
            database.remove({},{multi:true});
            console.log("Todos los datos han sido eliminados.");
            res.sendStatus(200);
        });

    //Fallo Post especifico
    app.post(BASE_API + "/ownerships-changes-stats/:province" , (req,res)=>
        {
            res.sendStatus(405);
        });

    //DELETE dato especifico
    app.delete(BASE_API + "/ownerships-changes-stats/:province", (req,res) =>
        {
            let parametro= req.params.province;

            database.remove({province: parametro }, {},(err,numRemoved) =>
            {
                if (err)   
                {
                    res.status(500).send("error al elminar los datos");
                }
                else
                {
                    if (numRemoved==0)
                    {
                        res.sendStatus(404);
                    }
                    else 
                    {
                        res.sendStatus(200);   
                    }
                }
            });
        });
}

//module.exports = {CalculateChanges,InitialData,ChangesData};

