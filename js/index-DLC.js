const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const FILE_PATH = path.join(__dirname, '../data/DatosProvincialesSancionesPuntos_2022.csv');
const TARGET_REGION = 'Andalucía'; // Cambia esto según la comunidad autónoma deseada
const NUMERIC_FIELD = 'total_points_deducted'; // Campo numérico a promediar

function calculatePointsDeducted(callback) {
    let data = [];

    fs.createReadStream(FILE_PATH)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {
            let filteredData = data.filter(row => row['autonomous_community'] === TARGET_REGION);
            let numericValues = filteredData.map(row => parseFloat(row[NUMERIC_FIELD])).filter(val => !isNaN(val));

            let result;
            if (numericValues.length > 0) {
                let sum = numericValues.reduce((acc, val) => acc + val, 0);
                let average = sum / numericValues.length;
                result = `Media de ${NUMERIC_FIELD} en ${TARGET_REGION}: ${average.toFixed(2)}`;
            } else {
                result = `No hay datos para ${TARGET_REGION}.`;
            }

            callback(result); // Llamamos al callback con el resultado
        });
}

// Exportamos la función para usarla en index.js
module.exports = calculatePointsDeducted;
