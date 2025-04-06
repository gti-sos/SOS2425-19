import path from "path";
import fs from "fs";
import { fileURLToPath } from 'url';
import dataStore from "nedb";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const csvPath = path.join(__dirname, '../../data/DatosMunicipalesSiniestralidad_2023.csv')

function loadInitialDataMRC(){
    const datos = [
        {
            "ine-code": "1001",
            "municipality": "Alegría-Dulantzi",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "0"
        },
        {
            "ine-code": "1002",
            "municipality": "Amurrio",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "1"
        },
        {
            "ine-code": "1003",
            "municipality": "Aramaio",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "0"
        },
        {
            "ine-code": "1004",
            "municipality": "Artziniega",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "0"
        },
        {
            "ine-code": "1006",
            "municipality": "Armiñón",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "0"
        },
        {
            "ine-code": "1008",
            "municipality": "Arratzua-Ubarrundia",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "2"
        },
        {
            "ine-code": "1009",
            "municipality": "Asparrena",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2023",
            "deceased": "0",
            "injured-hospitalized": "1",
            "injured-not-hospitalized": "0"
        },
        {
            "ine-code": "1010",
            "municipality": "Ayala/Aiara",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "1"
        },
        {
            "ine-code": "1011",
            "municipality": "Baños de Ebro/Mañueta",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "0"
        },
        {
            "ine-code": "1013",
            "municipality": "Barrundia",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "2"
        }
    ];
    return datos;
}

function csvToArray(csvString, delimiter = ";") {
    const lines = csvString.trim().split("\n");
    const headers = lines[0].split(delimiter).map(header => header.trim());

    return lines.slice(1).map(line => {
        const values = line.split(delimiter).map(value => value.trim());
        return headers.reduce((object, header, i) => {
            object[header] = isNaN(values[i]) ? values[i] : Number(values[i]);
            return object;
        }, {});
    });
}

const csvContent = fs.readFileSync(csvPath, 'utf8');
const BASE_API = "/api/v1"
const siniestralidadData = csvToArray(csvContent);
const db=new dataStore();

db.insert(siniestralidadData, (err, newDocs) => {
    if (err) {
        return res.status(500).send("Error al insertar los datos,");
    }
});
function loadBackendMRC(app) {
    

    // Documentación
    app.get(`${BASE_API}/accident-rate-2023-stats/docs`, (_, res) => {
        res.redirect("https://documenter.getpostman.com/view/42375041/2sB2cUC3sG");
    });

    // Cargar datos iniciales si BD está vacía
    app.get(`${BASE_API}/accident-rate-2023-stats/loadInitialData`, (_, res) => {
        db.count({}, (err, count) => {
            if (err) return res.status(500).send("Error al comprobar la BD.");
            if (count > 0) return res.status(400).json({ message: "Ya tiene datos" });

            const data = loadInitialDataMRC();
            db.insert(data, (err) => {
                if (err) return res.status(500).send("Error al insertar");
                res.status(200).json(data);
            });
        });
    });

    // Obtener datos con filtros y paginación
    app.get(`${BASE_API}/accident-rate-2023-stats`, (req, res) => {
        const { ine_code,municipality, province, ccaa, year, from, to, limit, offset } = req.query;
        let query = {};

        if (municipality) query.municipality = new RegExp(`^${municipality}$`, "i");
        if (province) query.province = new RegExp(`^${province}$`, "i");
        if (ccaa) query.ccaa = new RegExp(`^${ccaa}$`, "i");
        if (ine_code) query.ine_code = Number(ine_code);
        if (year) query.year = Number(year);
        if (from || to) {
            query.year = {};
            if (from) query.year.$gte = Number(from);
            if (to) query.year.$lte = Number(to);
        }

        let q = db.find(query);
        if (offset) q = q.skip(Number(offset));
        if (limit) q = q.limit(Number(limit));

        q.exec((err, docs) => {
            if (err) return res.status(500).send("Error en la base de datos.");
            res.json(docs.map(({ _id, ...rest }) => rest));
        });
    });

    

    // Añadir nuevo dato
    app.post(`${BASE_API}/accident-rate-2023-stats`, (req, res) => {
        const newEntry = req.body;
        const required = ["ine_code","municipality", "province", "ccaa", "year", "deceased","injured_hospitalized","injured_not_hospitalized"];
        if (required.some(k => newEntry[k] === undefined)) return res.sendStatus(400);

        db.findOne({ ine_code: newEntry.ine_code }, (err, found) => {
            if (err) return res.status(500).send("Error en la base de datos.");
            if (found) return res.sendStatus(409);
            db.insert(newEntry, err => err ? res.status(500).send("Error al insertar") : res.sendStatus(201));
        });
    });

    // PUT no permitido a todos
    app.put(`${BASE_API}/accident-rate-2023-stats`, (_, res) => res.sendStatus(405));

    // Eliminar todos los datos
    app.delete(`${BASE_API}/accident-rate-2023-stats`, (_, res) => {
        db.remove({}, { multi: true }, () => res.sendStatus(200));
    });

    // Obtener dato específico
    app.get(`${BASE_API}/accident-rate-2023-stats/:ine_code`, (req, res) => {
        const code = Number(req.params.ine_code);
        db.findOne({ ine_code: code }, (err, doc) => {
            if (err) return res.status(500).send("Error en la base de datos.");
            if (!doc) return res.sendStatus(404);
            const { _id, ...cleanDoc } = doc;
            res.status(200).json(cleanDoc);
        });
    });

    app.post(`${BASE_API}/accident-rate-2023-stats/reset`, (_, res) => {
        
        db.remove({}, { multi: true }, (err) => {
            if (err) return res.status(500).send("Error al limpiar BD.");
            db.insert(siniestralidadData, (err) => {
                if (err) return res.status(500).send("Error al restaurar.");
                res.status(200).send("Base de datos restaurada.");
            });
        });
    });
    
    // POST a recurso específico no permitido
    app.post(`${BASE_API}/accident-rate-2023-stats/:ine_code`, (_, res) => res.sendStatus(405));

    // Actualizar recurso específico
    app.put(`${BASE_API}/accident-rate-2023-stats/:ine_code`, (req, res) => {
        const code = Number(req.params.ine_code);
        if (req.body.ine_code !== code) return res.sendStatus(400);

        db.update({ ine_code: code }, req.body, {}, (err, count) => {
            if (err) return res.status(500).send("Error al actualizar.");
            if (count === 0) return res.sendStatus(404);
            res.sendStatus(200);
        });
    });

    // Eliminar recurso específico
    app.delete(`${BASE_API}/accident-rate-2023-stats/:ine_code`, (req, res) => {
        const code = Number(req.params.ine_code);
        db.remove({ ine_code: code }, {}, (err, count) => {
            if (err) return res.status(500).send("Error al eliminar.");
            res.sendStatus(count === 0 ? 404 : 200);
        });
    });
}

//console.log(siniestralidadData);
/*
function calculateDeceased(ccaa) {
    
           
    let filtrado = siniestralidadData.filter((x) => x.ccaa === ccaa);
    
    let sum = filtrado
        .map((x) => Number(x['injured-not-hospitalized']) || 0) // Convierte a número o usa 0 si no es válido
        .reduce((sum, value) => sum + value, 0);
    let media = sum / filtrado.length;
    console.log(`Media heridos no hospitalizados en la Comunidad Valenciana: ${media}`);   
    return media;
}
*/
export {loadBackendMRC,siniestralidadData,loadInitialDataMRC};
