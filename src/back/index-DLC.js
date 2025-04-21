import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import dataStore from "nedb";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

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



const database = new dataStore();

function loadInitialDataDLC(){
    const sanctionsData = [
        {ine_code: 3037, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2023, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3038, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2023, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3039, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2023, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3040, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2023, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3041, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2023, total_sanctions_with_points: 148, total_points_deducted: 696},
        {ine_code: 3042, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2023, total_sanctions_with_points: 4, total_points_deducted: 18},
        {ine_code: 3043, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2023, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3044, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2023, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3045, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2023, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3046, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2023, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3047, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2023, total_sanctions_with_points: 72, total_points_deducted: 330},
        {ine_code: 3048, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2023, total_sanctions_with_points: 11, total_points_deducted: 51},
        {ine_code: 3049, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2023, total_sanctions_with_points: 179, total_points_deducted: 809},
        {ine_code: 3050, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2023, total_sanctions_with_points: 262, total_points_deducted: 1121}
        
    ];
    return sanctionsData
}

const BASE_API = "/api/v1"

database.insert(sanctionsData, (err, newDoc) => {
    if (err) {
        console.error("Error al insertar los datos:", err);
    } else {
        console.log("Datos insertados correctamente");
    }
});


function loadBackendDLC(app){
    
    // APIs de DLC
    app.get(BASE_API + "/sanctions-and-points-stats/docs", (req, res) => {
        res.redirect("https://documenter.getpostman.com/view/42153958/2sAYkLncz8"); 
    });

    app.get(BASE_API + "/sanctions-and-points-stats/loadInitialData", (req, res) => {
        database.count({}, (err, count) => {
            if (err) {
                return res.status(500).send("Error al comprobar la base de datos.");
            }

            const initialData = loadInitialDataDLC();
            database.insert(initialData, (err, newDocs) => {
                if (err) {
                    return res.status(500).send("Error al insertar los datos.");
                }

                database.find({}, (err, sanctions) => {
                    if (err) {
                        return res.status(500).send("Error al recuperar los datos.");
                    }
                    res.send(JSON.stringify(sanctions.map((x)=>{
                        delete x._id;
                        return x;
                    }),null,2));
                });
            });
        });
    });

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    
    // GET todos los datos con paginación
app.get(BASE_API + "/sanctions-and-points-stats", (req, res) => {
    let { ine_code, province, autonomous_community, year, from, to, limit, offset } = req.query;

    let query = {};

    if (province) {
        query.province = new RegExp("^" + escapeRegExp(province) + "$", "i");
    }
    if (autonomous_community) {
        query.autonomous_community = new RegExp("^" + escapeRegExp(autonomous_community) + "$", "i");
    }
    if (year) {
        query.year = Number(year);
    }
    if (ine_code) {
        query.ine_code = Number(ine_code);
    }
    if (from || to) {
        query.year = {};
        if (from) query.year.$gte = Number(from);
        if (to) query.year.$lte = Number(to);
    }

    let q = database.find(query);

    // Aplicar paginación si viene por query
    if (offset !== undefined) {
        q = q.skip(Number(offset));
    }
    if (limit !== undefined) {
        q = q.limit(Number(limit));
    }

    q.exec((err, sanctions) => {
        if (err) {
            return res.status(500).send("Error al acceder a la base de datos.");
        }

        // Eliminar _id de cada objeto
        const sanitized = sanctions.map(({ _id, ...rest }) => rest);

        res.send(JSON.stringify(sanitized));
    });
});


    //POST a todos los datos
    app.post(BASE_API + "/sanctions-and-points-stats", (req, res) => {
        const { ine_code, province, autonomous_community, year, total_sanctions_with_points, total_points_deducted } = req.body;
        // Validar campos obligatorios
        if (
            ine_code === undefined || province === undefined || autonomous_community === undefined ||
            year === undefined || total_sanctions_with_points === undefined || total_points_deducted === undefined
        ) {
            return res.sendStatus(400); // Bad Request
        }
        // Comprobar si ya existe un registro con mismo ine_code (puedes añadir year si es clave compuesta)
        database.findOne({ ine_code: ine_code,year:year }, (err, existingDoc) => {
            if (err) {
                return res.status(500).send("Error al acceder a la base de datos.");
            }
            if (existingDoc) {
                return res.sendStatus(409); // Conflict
            }
            database.insert(req.body, (err, newDoc) => {
                if (err) {
                    return res.status(500).send("Error al insertar el recurso.");
                }
                res.sendStatus(201); // Created
            });
        });
    });
    

    //FALLO DE PUT a todos los datos
    app.put(BASE_API + "/sanctions-and-points-stats/",(req,res)=>{    
        
        res.sendStatus(405);
    });

    //DELETE de todos los datos
    app.delete(BASE_API + "/sanctions-and-points-stats", (req, res) => {
        database.remove({},{multi:true}); 
        console.log("Todos los datos han sido eliminados."); // Para ver en consola
        res.sendStatus(200); 
    });

    
    //GET de un dato especifico y doble busqueda
    app.get(BASE_API + "/sanctions-and-points-stats/:ine_code/:year", (req, res) => {
        const paramIneCode = Number(req.params.ine_code);
        const paramYear = Number(req.params.year);
    
        database.findOne({ ine_code: paramIneCode, year: paramYear }, (err, sanction) => {
            if (err) {
                return res.status(500).send("Error al acceder a la base de datos.");
            }
            if (!sanction) {
                return res.sendStatus(404);
            }
            // Eliminar la propiedad _id antes de enviar
        const { _id, ...sanctionWithoutId } = sanction;
        res.status(200).json(sanctionWithoutId);
        });
    });

//POST para resetear la base de datos a la version original
app.post(BASE_API + "/sanctions-and-points-stats/reset", (req, res) => {
    database.remove({}, { multi: true }, (err) => {
        if (err) {
            return res.status(500).send("Error al limpiar la base de datos.");
        }    
        database.insert(sanctionsData, (err) => {
            if (err) {
                return res.status(500).send("Error al restaurar los datos iniciales.");
            }    
            res.status(200).send("Base de datos restaurada.");
        });
    });
});

    //FALLO DE POST de un dato especifico
    app.post(BASE_API + "/sanctions-and-points-stats/:ine_code/:year",(req,res)=>{    
        
        res.sendStatus(405);
    });

    //PUT de un dato especifico
    app.put(BASE_API + "/sanctions-and-points-stats/:ine_code/:year", (req, res) => {
        const paramIneCode = Number(req.params.ine_code);        
        const paramYear = Number(req.params.year);
        const updatedData = req.body;

        // Verificar que el ine_code en el body coincida con el de la URL
        if (updatedData.ine_code !== paramIneCode) {
            return res.sendStatus(400); // Bad Request
        }    
        database.update({ ine_code: paramIneCode,year:paramYear }, updatedData, {}, (err, numReplaced) => {
            if (err) {
                return res.status(500).send("Error al actualizar el recurso.");
            }
    
            if (numReplaced === 0) {
                return res.sendStatus(404); // No encontrado
            }
    
            res.sendStatus(200); // OK
        });
    });


    //DELETE de un dato especifico
    app.delete(BASE_API + "/sanctions-and-points-stats/:ine_code/:year", (req, res) => {
        const paramIneCode = Number(req.params.ine_code);
        const paramYear = Number(req.params.year);
    
        database.remove({ ine_code: paramIneCode,year:paramYear }, {}, (err, numRemoved) => {
            if (err) {
                res.status(500).send("Error al eliminar el recurso.");
                console.error(`ERROR: ${err}`)
            }else{
                if (numRemoved === 0) {
                    res.sendStatus(404); // No encontrado
                }else{
                    res.sendStatus(200); // OK
                }               
            }    
            
        });
    });
}

export {loadBackendDLC,sanctionsData,loadInitialDataDLC};
