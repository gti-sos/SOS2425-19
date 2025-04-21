import express from "express";
import cors from "cors";
import path from "path";
import {loadBackendDLC} from "./src/back/index-DLC.js";
import {loadBackendMRC} from "./src/back/index-MRC.js";
import { loadBackendJVF } from "./src/back/index-JVF_2.js";
import { fileURLToPath } from 'url';
import {handler} from "./src/front/build/handler.js"


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)
const app = express();
const PORT = process.env.PORT || 16078;

app.use(express.json());
app.use(cors());

loadBackendDLC(app);

loadBackendJVF(app);

loadBackendMRC(app);
app.use(handler);


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}!`);
});
