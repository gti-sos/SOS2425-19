const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const FILE_PATH = path.join(__dirname, 'data/DatosProvincialesSancionesPuntos_2022.csv');
const TARGET_REGION = 'Andalucía'; // Cambia esto según la comunidad autónoma deseada
const NUMERIC_FIELD = 'total_points_deducted'; // Campo numérico a promediar

let data = [];

function processData() {
  let filteredData = [];
  for (let row of data) {
    if (row['autonomous_community'] === TARGET_REGION) {
      filteredData.push(row);
    }
  }
  
  let numericValues = [];
  for (let row of filteredData) {
    let value = parseFloat(row[NUMERIC_FIELD]);
    if (!isNaN(value)) {
      numericValues.push(value);
    }
  }
  
  if (numericValues.length > 0) {
    let sum = 0;
    for (let val of numericValues) {
      sum += val;
    }
    let average = sum / numericValues.length;
    console.log(`Media de ${NUMERIC_FIELD} en ${TARGET_REGION}:`, average.toFixed(2));
  } else {
    console.log(`No hay datos para ${TARGET_REGION}.`);
  }
}

fs.createReadStream(FILE_PATH)
  .pipe(csv({ separator: ';' }))
  .on('data', (row) => {
    data.push(row);
  })
  .on('end', () => {
    processData();
  });

console.log(data)
