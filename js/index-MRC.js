const fs = require('fs');
const csv = require('csv-parser');

const path = 'data/DatosMunicipalesSiniestralidad_2023.csv';

let datos = [];

fs.calculateDeceased(path)
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
        
            datos.push(row);
        }
    )
    .on('end', () => {
        let filtrado = datos.filter((x)=> x.ccaa=='País Vasco');
        console.log(filtrado);
        let sum=0;
        let x= filtrado.map((x)=>Number(x.deceased)).reduce((sum,value)=>sum+value,sum);
        console.log(`Media muertos por accidentes en País Vasco:`, x/filtrado.length);
        
    });

   