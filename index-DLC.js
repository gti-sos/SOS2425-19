// index-YYY.js

const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data/DatosMunicipalesSancionesPuntos_2022.xlsx');

// Verificar si el archivo existe
if (!fs.existsSync(filePath)) {
    console.error("Error: El archivo Excel no se encuentra en la carpeta del script.");
    process.exit(1);
}


console.log("Cargando archivo Excel...");
const workbook = xlsx.readFile(filePath, { cellDates: true });
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];
console.log(`Archivo cargado correctamente. Usando hoja: ${sheetName}`);

// Convertir solo las columnas necesarias a JSON
const datos = xlsx.utils.sheet_to_json(worksheet, { defval: null });
console.log(`Total de filas en el archivo: ${datos.length}`);

// Definir la comunidad autónoma a filtrar
const comunidadFiltrada = "Andalucía";
console.log(`Filtrando por comunidad autónoma: ${comunidadFiltrada}`);

// Filtrar y transformar datos
const datosFiltrados = datos
    .filter(item => item["autonomous_community"] === comunidadFiltrada)
    .map(item => Number(item["total_sanctions_with_points"]) )
    .filter(valor => valor > 0);

console.log(`Filas válidas encontradas: ${datosFiltrados.length}`);

if (datosFiltrados.length === 0) {
    console.warn("No se encontraron datos válidos para la comunidad autónoma seleccionada.");
} else {
    // Calcular la media de "total_sanctions_with_points"
    const media = datosFiltrados.reduce((acc, valor) => acc + valor, 0) / datosFiltrados.length;
    console.log(`La media de sanciones con puntos en "${comunidadFiltrada}" es: ${media.toFixed(2)}`);
}

