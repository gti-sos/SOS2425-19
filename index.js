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


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});
