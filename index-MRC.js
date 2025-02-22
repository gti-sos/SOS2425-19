const fs = require('fs');
const csv = require('csv-parser');

const path = 'data/DatosMunicipalesSiniestralidad_2023.csv';

let datos = [];

fs.createReadStream(path)
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
        if (row['ccaa'] === 'País Vasco') {
        let value = Number(row['deceased']);
        if (!isNaN(value)) {
            datos.push(value);
        }
        }
    })
    .on('end', () => {
        let sum=0;
        for(let i=0;i<datos.length;i++){
            sum+=datos[i];
        }
        console.log(`Muertos por accidentes en País Vasco:`, sum);
        
    });