const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const FILE_PATH = path.join(__dirname, 'data/DatosProvincialesSancionesPuntos_2022.csv');
const TARGET_REGION = 'Andalucía'; // Cambia esto según la comunidad autónoma deseada
const NUMERIC_FIELD = 'total_points_deducted'; // Campo numérico a promediar

let data = [];

fs.createReadStream(FILE_PATH)
  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    if (row['autonomous_community'] === TARGET_REGION) {
      let value = parseFloat(row[NUMERIC_FIELD]);
      if (!isNaN(value)) {
        data.push(value);
      }
    }
  })
  .on('end', () => {
    if (data.length > 0) {
      let average = data.reduce((sum, val) => sum + val, 0) / data.length;
      console.log(`Media de total de puntos quitados en ${TARGET_REGION}:`, average.toFixed(2));
    } else {
      console.log(`No hay datos para ${TARGET_REGION}.`);
    }
  });