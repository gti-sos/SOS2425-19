const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

const FILE_PATH = path.join(__dirname, 'data/DatosMunicipalesSiniestralidad_2023.csv');

let data = [];

fs.createReadStream(FILE_PATH)
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
        if (row['ccaa'] === 'País Vasco') {
        let value = Number(row['deceased']);
        if (!isNaN(value)) {
            data.push(value);
        }
        }
    })
    .on('end', () => {
        if (data.length > 0) {
            let sum=0;
            for(let i=0;i<data.length;i++){
                sum+=data[i];
            }
            console.log(`Muertos por accidentes en País Vasco:`, sum);
        } else {
        console.log(`No hay datos para País Vasco.`);
        }
    });