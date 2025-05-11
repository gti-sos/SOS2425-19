import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import dataStore from "nedb";
import request from 'request';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const TARGET_REGION = "Andalucia";
const File_path =path.join(__dirname, '../../data/EstadisticasCambioTitularidad.csv');


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


function InitialData(){

    let Data= [
        {autonomous_community:"andalucia", province:"jaen", truck:2620, van:3710, bus:55, car:19639, motocycle:3297, other_vehicle:774, year:2024},
        {autonomous_community:"andalucia", province:"granada", truck:3127, van:3787, bus:99, car:33356, motocycle:9888,  other_vehicle:1099, year:2024},
        {autonomous_community:"andalucia", province:"malaga", truck:6254, van:8913, bus:133, car:80556, motocycle:19402, other_vehicle:1435,  year:2024},
        {autonomous_community:"aragon", province:"zaragoza", truck:2988, van:4402, bus:55, car:39804, motocycle:6791, other_vehicle:1008, year:2024},
        {autonomous_community:"aragon", province:"teruel", truck:1905, van:1099, bus:4, car:5545, motocycle:481, other_vehicle:119,  year:2024},
        {autonomous_community:"aragon", province:"huesca", truck:1494, van:1199, bus:17, car:9452, motocycle:900,  other_vehicle:314, year:2024},
        {autonomous_community:"canarias", province:"santa cruz de tenerife", truck:7614, van:5544, bus:212, car:47106, motocycle:9429, other_vehicle:1203,  year:2024},
        {autonomous_community:"cantabria", province:"cantabria", truck:1966, van:1936, bus:24, car:23810, motocycle:4081,  other_vehicle:533,  year:2024},
        {autonomous_community:"castilla y leon", province:"segovia", truck:493, van:490, bus:11, car:4473, motocycle:2143, other_vehicle:197,  year:2024},
        {autonomous_community:"castilla y leon", province:"salamanca", truck:973, van:1064, bus:48, car:13084, motocycle:1429, other_vehicle:327,  year:2024}
        
    ];

    return Data;
}

const BASE_API= "/api/v2";

database.insert(ChangesData, (err, newDoc) => {
    if (err) {
        console.error("Error al insertar los datos:", err);
    } else {
        console.log("Datos insertados correctamente");
    }
});


function loadBackendJVF( app ){
    //APIs
    //DOC POSTMAN

    app.get(BASE_API + "/ownerships-changes-stats/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/43356508/2sB2cUCP3Z"); 
    });

    //load initial data
    app.get(BASE_API + "/ownerships-changes-stats/loadInitialData", (req,res) => 
        {
            database.count({},(err,count) =>
            {
                if(err)
                {
                    return res.status(500).send("Error al comprobar la base de datos");
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
            let { autonomous_community,province,truck,van,bus,car,motocycle,other_vehicle,year,from,to,limit,offset} = req.query;
            
            let query = {};

            if(province) {
                query.province= new RegExp("^" + province +"$","i")
            }
            if(autonomous_community) {
                query.autonomous_community= new RegExp("^" + autonomous_community +"$","i")
            }
            if(truck) {
                query.truck= Number(truck);
            }
            if(van) {
                query.van= Number(van);
            }
            if(bus) {
                query.bus= Number(bus);
            }
            if(car) {
                query.car= Number(car);
            }
            if(motocycle) {
                query.motocycle= Number(motocycle);
            }
            
            if(other_vehicle) {
                query.other_vehicle= Number(other_vehicle);
            }
            if(year) {
                query.year= Number(year);
            }
            
            if(to || from){
                query.year={}
                if (from) query.year.$gte= Number(from);
                if (to) query.year.$lte= Number(to);
            }

            let x= database.find(query);

            if (offset !== undefined){
                x=x.skip(Number(offset));
            }
            if(limit !== undefined){
                x=x.limit(Number(limit));
            }

            x.exec((err,ownerships) =>{
                if (err){
                    return res.status(500).send("error al acceder a la base de datos");
                }
                //eliminar _id 
                const ow = ownerships.map(({ _id, ...rest }) => rest);

                res.send(JSON.stringify(ow));
            });

        });

    //proxy
    var paths='/api/harry';
    var apiServerHost = 'https://hp-api.onrender.com/api/characters';

    app.use(paths, function(req, res) {
    var url = apiServerHost + req.url;
    console.log('piped: ' + req.url);
    req.pipe(request(url)).pipe(res);
    });

    //Post todo 
    app.post( BASE_API + "/ownerships-changes-stats", (req,res) => 
        {
            const{autonomous_community,province,truck,van,bus,car,motocycle,other_vehicle,year} = req.body;

            if(
                autonomous_community == undefined ||province== undefined ||truck== undefined ||van== undefined ||
                bus== undefined||car== undefined||motocycle== undefined||other_vehicle== undefined||year== undefined
            ){
                return res.send(400);
            }
            database.findOne({ province: province, year: year }, (err, existingDoc) => {
                if (err) {
                    return res.status(500).send("Error al acceder la base de datos");
                }
                if (existingDoc) {
                    return res.sendStatus(409); // Conflict
                }
            
                database.insert(req.body, (err, newDoc) => {
                    if (err) {
                        return res.status(500).send("Error al introducir el dato");
                    }
                    res.sendStatus(201);
                });
            });
            
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

   //get especifico
   app.get(BASE_API + "/ownerships-changes-stats/:province", (req,res) =>{
        const parametro=req.params.province;
        database.findOne({province:parametro} , (err,own)=>{
            if(err){
                return res.sendStatus(500).send("error al buscar");
            }
            if(!own){
               return res.sendStatus(500).send("error al acceder a la base de datos");
            }
            const { _id, ...ownWithoutId } = own;
            res.status(200).json(ownWithoutId);
        });
   });     

   //post reseteo a base
   app.post( BASE_API + "/ownerships-changes-stats/reset", (req,res) =>{
        database.remove({}, {multi:true}, (err) => {
            if(err){
                return res.sendStatus(500).send("error al restaurar");
            }
            database.insert(ChangesData,(err)=>{
                if(err){
                    return res.sendStatus(500).send("error al restaurar");
                }
                res.sendStatus(200).send("base restaurada");
                        });


        });
   });

   //Fallo Post especifico
    app.post(BASE_API + "/ownerships-changes-stats/:province" , (req,res)=>
        {
            res.sendStatus(405);
        });
    
    // PUT dato especifico
    app.put(BASE_API + "/ownerships-changes-stats/:province/:year" , (req,res)=>{
        const parametro= req.params.province
        const actu=req.body
        const paramYear=Number(req.params.year);
        
        
        if(actu.province !== parametro ){
            return res.sendStatus(400);
        }
        database.update({province:parametro, year :paramYear} , actu, {}, (err,remplazado)=>{
            if (err)   
                {
                    res.status(500).send("error al actualizar el dato");
                }
            if(remplazado === 0){
                return res.sendStatus(404);
            }
            res.sendStatus(200);

        });
    });
    app.get(BASE_API + "/ownerships-changes-stats/:province/:year", (req, res) => {
        const year = Number(req.params.year);
        const province = req.params.province;
    
        database.find({ 
            year: year, 
            province: new RegExp("^" + province + "$", "i") 
        }, (err, docs) => {
            if (err) return res.status(500).send("Error al acceder a la base de datos.");
            if (!docs || docs.length === 0) return res.sendStatus(404);
    
            const sanitized = docs.map(({ _id, ...rest }) => rest);
            res.status(200).json(sanitized);
        });
    });

    //DELETE dato especifico
    app.delete(BASE_API + "/ownerships-changes-stats/:province/:year", (req,res) =>
        

    {
        const paramProvince= req.params.province;
        const paramYear=Number(req.params.year);
            database.remove({province: paramProvince, year: paramYear }, {},(err,numRemoved) =>
            {
                if (err)   
                {
                    res.status(500).send("error al elminar los datos");
                }
                else
                {
                    if (numRemoved==0){
                        res.sendStatus(404);
                    }
                    else {
                        res.sendStatus(200);   
                    }
                }
            });
        });
}

export {loadBackendJVF,InitialData,ChangesData};

