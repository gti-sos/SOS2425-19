const fs= require('fs');
const csv = require('csv-parser');

const path = 'data/EstadisticasCambioTitularidad.csv';
let datos= [];

fs.createReadStream(path)
    .pipe(csv({ separator: ';' }))
    .on('data', (row) => {
        if (row['autonomous_community'] === 'Andalucia') {
            let value = Number(row['car']);
            if ( !isNaN(value) ){
                datos.push(value);
            }
        }
    })
    .on( 'end', () => {
        let sum = 0;
        for (let i = 0; i < datos.length; i++ ){
            sum += datos[i];
        }
        console.log('Media de cambios de titularidad de autobuses en Andalucía: ' ,sum/datos.length );
    });