const fs = require('fs');
const csv = require('csv-parser');

const path = 'data/DatosMunicipalesSiniestralidad_2023.csv';

let datos = [{'ine-code': 1001, 'municipality': 'Alegría-Dulantzi', 'province': 'Araba/Álava', 'ccaa': 'País Vasco', 'deceased-bicyclists': 0.0, 'bicycles-serious-injuries': 0.0, 'bicycles-minor-injuries': 0.0, 'deceased-mopeds': 0.0, 'mopeds-serious-injuries': 0.0, 'mopeds-minor-injuries': 0.0, 'deceased-motrocycles': 0.0, 'motorcycles-serious-injuries': 0.0, 'motorcycles-minor-injuries': 0.0, 'deceased-cars': 0.0, 'cars-serious-injuries': 0.0, 'cars-minor-injuries': 0.0, 'deceased-vans': 0.0, 'vans-serious-injuries': 0.0, 'vans-minor-injuries': 0.0, 'deceased-trucks': 0.0, 'trucks-serious-injuries': 0.0, 'trucks-minor-injuries': 0.0, 'deceased-buses': 0.0, 'buses-serious-injuries': 0.0, 'buses-minor-injuries': 0.0, 'other-deceased': 0.0, 'other-serious-injuries': 0.0, 'other-minor-injuries': 0.0, 'deceased-pedestrians': 0.0, 'pedestrians-serious-injuries': 0.0, 'pedestrians-minor-injuries': 0.0, 'n-accidents-with-victim': 0.0, 'deceased': 0.0, 'injured-hospitalized': 0.0, 'injured-not-hospitalized': 0.0, 'year': 2023}, {'ine-code': 1002, 'municipality': 'Amurrio', 'province': 'Araba/Álava', 'ccaa': 'País Vasco', 'deceased-bicyclists': 0.0, 'bicycles-serious-injuries': 0.0, 'bicycles-minor-injuries': 0.0, 'deceased-mopeds': 0.0, 'mopeds-serious-injuries': 0.0, 'mopeds-minor-injuries': 0.0, 'deceased-motrocycles': 0.0, 'motorcycles-serious-injuries': 0.0, 'motorcycles-minor-injuries': 1.0, 'deceased-cars': 0.0, 'cars-serious-injuries': 0.0, 'cars-minor-injuries': 0.0, 'deceased-vans': 0.0, 'vans-serious-injuries': 0.0, 'vans-minor-injuries': 0.0, 'deceased-trucks': 0.0, 'trucks-serious-injuries': 0.0, 'trucks-minor-injuries': 0.0, 'deceased-buses': 0.0, 'buses-serious-injuries': 0.0, 'buses-minor-injuries': 0.0, 'other-deceased': 0.0, 'other-serious-injuries': 0.0, 'other-minor-injuries': 0.0, 'deceased-pedestrians': 0.0, 'pedestrians-serious-injuries': 0.0, 'pedestrians-minor-injuries': 0.0, 'n-accidents-with-victim': 1.0, 'deceased': 0.0, 'injured-hospitalized': 0.0, 'injured-not-hospitalized': 1.0, 'year': 2023}, {'ine-code': 1003, 'municipality': 'Aramaio', 'province': 'Araba/Álava', 'ccaa': 'País Vasco', 'deceased-bicyclists': 0.0, 'bicycles-serious-injuries': 0.0, 'bicycles-minor-injuries': 0.0, 'deceased-mopeds': 0.0, 'mopeds-serious-injuries': 0.0, 'mopeds-minor-injuries': 0.0, 'deceased-motrocycles': 0.0, 'motorcycles-serious-injuries': 0.0, 'motorcycles-minor-injuries': 0.0, 'deceased-cars': 0.0, 'cars-serious-injuries': 0.0, 'cars-minor-injuries': 0.0, 'deceased-vans': 0.0, 'vans-serious-injuries': 0.0, 'vans-minor-injuries': 0.0, 'deceased-trucks': 0.0, 'trucks-serious-injuries': 0.0, 'trucks-minor-injuries': 0.0, 'deceased-buses': 0.0, 'buses-serious-injuries': 0.0, 'buses-minor-injuries': 0.0, 'other-deceased': 0.0, 'other-serious-injuries': 0.0, 'other-minor-injuries': 0.0, 'deceased-pedestrians': 0.0, 'pedestrians-serious-injuries': 0.0, 'pedestrians-minor-injuries': 0.0, 'n-accidents-with-victim': 0.0, 'deceased': 0.0, 'injured-hospitalized': 0.0, 'injured-not-hospitalized': 0.0, 'year': 2023}, {'ine-code': 1004, 'municipality': 'Artziniega', 'province': 'Araba/Álava', 'ccaa': 'País Vasco', 'deceased-bicyclists': 0.0, 'bicycles-serious-injuries': 0.0, 'bicycles-minor-injuries': 0.0, 'deceased-mopeds': 0.0, 'mopeds-serious-injuries': 0.0, 'mopeds-minor-injuries': 0.0, 'deceased-motrocycles': 0.0, 'motorcycles-serious-injuries': 0.0, 'motorcycles-minor-injuries': 0.0, 'deceased-cars': 0.0, 'cars-serious-injuries': 0.0, 'cars-minor-injuries': 0.0, 'deceased-vans': 0.0, 'vans-serious-injuries': 0.0, 'vans-minor-injuries': 0.0, 'deceased-trucks': 0.0, 'trucks-serious-injuries': 0.0, 'trucks-minor-injuries': 0.0, 'deceased-buses': 0.0, 'buses-serious-injuries': 0.0, 'buses-minor-injuries': 0.0, 'other-deceased': 0.0, 'other-serious-injuries': 0.0, 'other-minor-injuries': 0.0, 'deceased-pedestrians': 0.0, 'pedestrians-serious-injuries': 0.0, 'pedestrians-minor-injuries': 0.0, 'n-accidents-with-victim': 0.0, 'deceased': 0.0, 'injured-hospitalized': 0.0, 'injured-not-hospitalized': 0.0, 'year': 2023}, {'ine-code': 1006, 'municipality': 'Armiñón', 'province': 'Araba/Álava', 'ccaa': 'País Vasco', 'deceased-bicyclists': 0.0, 'bicycles-serious-injuries': 0.0, 'bicycles-minor-injuries': 0.0, 'deceased-mopeds': 0.0, 'mopeds-serious-injuries': 0.0, 'mopeds-minor-injuries': 0.0, 'deceased-motrocycles': 0.0, 'motorcycles-serious-injuries': 0.0, 'motorcycles-minor-injuries': 0.0, 'deceased-cars': 0.0, 'cars-serious-injuries': 0.0, 'cars-minor-injuries': 0.0, 'deceased-vans': 0.0, 'vans-serious-injuries': 0.0, 'vans-minor-injuries': 0.0, 'deceased-trucks': 0.0, 'trucks-serious-injuries': 0.0, 'trucks-minor-injuries': 0.0, 'deceased-buses': 0.0, 'buses-serious-injuries': 0.0, 'buses-minor-injuries': 0.0, 'other-deceased': 0.0, 'other-serious-injuries': 0.0, 'other-minor-injuries': 0.0, 'deceased-pedestrians': 0.0, 'pedestrians-serious-injuries': 0.0, 'pedestrians-minor-injuries': 0.0, 'n-accidents-with-victim': 0.0, 'deceased': 0.0, 'injured-hospitalized': 0.0, 'injured-not-hospitalized': 0.0, 'year': 2023}, {'ine-code': 1008, 'municipality': 'Arratzua-Ubarrundia', 'province': 'Araba/Álava', 'ccaa': 'País Vasco', 'deceased-bicyclists': 0.0, 'bicycles-serious-injuries': 0.0, 'bicycles-minor-injuries': 1.0, 'deceased-mopeds': 0.0, 'mopeds-serious-injuries': 0.0, 'mopeds-minor-injuries': 0.0, 'deceased-motrocycles': 0.0, 'motorcycles-serious-injuries': 0.0, 'motorcycles-minor-injuries': 0.0, 'deceased-cars': 0.0, 'cars-serious-injuries': 0.0, 'cars-minor-injuries': 1.0, 'deceased-vans': 0.0, 'vans-serious-injuries': 0.0, 'vans-minor-injuries': 0.0, 'deceased-trucks': 0.0, 'trucks-serious-injuries': 0.0, 'trucks-minor-injuries': 0.0, 'deceased-buses': 0.0, 'buses-serious-injuries': 0.0, 'buses-minor-injuries': 0.0, 'other-deceased': 0.0, 'other-serious-injuries': 0.0, 'other-minor-injuries': 0.0, 'deceased-pedestrians': 0.0, 'pedestrians-serious-injuries': 0.0, 'pedestrians-minor-injuries': 0.0, 'n-accidents-with-victim': 2.0, 'deceased': 0.0, 'injured-hospitalized': 0.0, 'injured-not-hospitalized': 2.0, 'year': 2023}, {'ine-code': 1009, 'municipality': 'Asparrena', 'province': 'Araba/Álava', 'ccaa': 'País Vasco', 'deceased-bicyclists': 0.0, 'bicycles-serious-injuries': 0.0, 'bicycles-minor-injuries': 0.0, 'deceased-mopeds': 0.0, 'mopeds-serious-injuries': 0.0, 'mopeds-minor-injuries': 0.0, 'deceased-motrocycles': 0.0, 'motorcycles-serious-injuries': 0.0, 'motorcycles-minor-injuries': 0.0, 'deceased-cars': 0.0, 'cars-serious-injuries': 0.0, 'cars-minor-injuries': 0.0, 'deceased-vans': 0.0, 'vans-serious-injuries': 0.0, 'vans-minor-injuries': 0.0, 'deceased-trucks': 0.0, 'trucks-serious-injuries': 0.0, 'trucks-minor-injuries': 0.0, 'deceased-buses': 0.0, 'buses-serious-injuries': 0.0, 'buses-minor-injuries': 0.0, 'other-deceased': 0.0, 'other-serious-injuries': 0.0, 'other-minor-injuries': 0.0, 'deceased-pedestrians': 0.0, 'pedestrians-serious-injuries': 1.0, 'pedestrians-minor-injuries': 0.0, 'n-accidents-with-victim': 1.0, 'deceased': 0.0, 'injured-hospitalized': 1.0, 'injured-not-hospitalized': 0.0, 'year': 2023}, {'ine-code': 1010, 'municipality': 'Ayala/Aiara', 'province': 'Araba/Álava', 'ccaa': 'País Vasco', 'deceased-bicyclists': 0.0, 'bicycles-serious-injuries': 0.0, 'bicycles-minor-injuries': 0.0, 'deceased-mopeds': 0.0, 'mopeds-serious-injuries': 0.0, 'mopeds-minor-injuries': 0.0, 'deceased-motrocycles': 0.0, 'motorcycles-serious-injuries': 0.0, 'motorcycles-minor-injuries': 1.0, 'deceased-cars': 0.0, 'cars-serious-injuries': 0.0, 'cars-minor-injuries': 0.0, 'deceased-vans': 0.0, 'vans-serious-injuries': 0.0, 'vans-minor-injuries': 0.0, 'deceased-trucks': 0.0, 'trucks-serious-injuries': 0.0, 'trucks-minor-injuries': 0.0, 'deceased-buses': 0.0, 'buses-serious-injuries': 0.0, 'buses-minor-injuries': 0.0, 'other-deceased': 0.0, 'other-serious-injuries': 0.0, 'other-minor-injuries': 0.0, 'deceased-pedestrians': 0.0, 'pedestrians-serious-injuries': 0.0, 'pedestrians-minor-injuries': 0.0, 'n-accidents-with-victim': 1.0, 'deceased': 0.0, 'injured-hospitalized': 0.0, 'injured-not-hospitalized': 1.0, 'year': 2023}, {'ine-code': 1011, 'municipality': 'Baños de Ebro/Mañueta', 'province': 'Araba/Álava', 'ccaa': 'País Vasco', 'deceased-bicyclists': 0.0, 'bicycles-serious-injuries': 0.0, 'bicycles-minor-injuries': 0.0, 'deceased-mopeds': 0.0, 'mopeds-serious-injuries': 0.0, 'mopeds-minor-injuries': 0.0, 'deceased-motrocycles': 0.0, 'motorcycles-serious-injuries': 0.0, 'motorcycles-minor-injuries': 0.0, 'deceased-cars': 0.0, 'cars-serious-injuries': 0.0, 'cars-minor-injuries': 0.0, 'deceased-vans': 0.0, 'vans-serious-injuries': 0.0, 'vans-minor-injuries': 0.0, 'deceased-trucks': 0.0, 'trucks-serious-injuries': 0.0, 'trucks-minor-injuries': 0.0, 'deceased-buses': 0.0, 'buses-serious-injuries': 0.0, 'buses-minor-injuries': 0.0, 'other-deceased': 0.0, 'other-serious-injuries': 0.0, 'other-minor-injuries': 0.0, 'deceased-pedestrians': 0.0, 'pedestrians-serious-injuries': 0.0, 'pedestrians-minor-injuries': 0.0, 'n-accidents-with-victim': 0.0, 'deceased': 0.0, 'injured-hospitalized': 0.0, 'injured-not-hospitalized': 0.0, 'year': 2023}, {'ine-code': 1013, 'municipality': 'Barrundia', 'province': 'Araba/Álava', 'ccaa': 'País Vasco', 'deceased-bicyclists': 0.0, 'bicycles-serious-injuries': 0.0, 'bicycles-minor-injuries': 1.0, 'deceased-mopeds': 0.0, 'mopeds-serious-injuries': 0.0, 'mopeds-minor-injuries': 0.0, 'deceased-motrocycles': 0.0, 'motorcycles-serious-injuries': 0.0, 'motorcycles-minor-injuries': 0.0, 'deceased-cars': 0.0, 'cars-serious-injuries': 0.0, 'cars-minor-injuries': 0.0, 'deceased-vans': 0.0, 'vans-serious-injuries': 0.0, 'vans-minor-injuries': 0.0, 'deceased-trucks': 0.0, 'trucks-serious-injuries': 0.0, 'trucks-minor-injuries': 0.0, 'deceased-buses': 0.0, 'buses-serious-injuries': 0.0, 'buses-minor-injuries': 0.0, 'other-deceased': 0.0, 'other-serious-injuries': 0.0, 'other-minor-injuries': 1.0, 'deceased-pedestrians': 0.0, 'pedestrians-serious-injuries': 0.0, 'pedestrians-minor-injuries': 0.0, 'n-accidents-with-victim': 2.0, 'deceased': 0.0, 'injured-hospitalized': 0.0, 'injured-not-hospitalized': 2.0, 'year': 2023}, {'ine-code': 2001, 'municipality': 'Abengibre', 'province': 'Albacete', 'ccaa': 'Castilla-La Mancha', 'deceased-bicyclists': 0.0, 'bicycles-serious-injuries': 0.0, 'bicycles-minor-injuries': 0.0, 'deceased-mopeds': 0.0, 'mopeds-serious-injuries': 0.0, 'mopeds-minor-injuries': 0.0, 'deceased-motrocycles': 0.0, 'motorcycles-serious-injuries': 0.0, 'motorcycles-minor-injuries': 0.0, 'deceased-cars': 0.0, 'cars-serious-injuries': 0.0, 'cars-minor-injuries': 0.0, 'deceased-vans': 0.0, 'vans-serious-injuries': 0.0, 'vans-minor-injuries': 0.0, 'deceased-trucks': 0.0, 'trucks-serious-injuries': 0.0, 'trucks-minor-injuries': 0.0, 'deceased-buses': 0.0, 'buses-serious-injuries': 0.0, 'buses-minor-injuries': 0.0, 'other-deceased': 0.0, 'other-serious-injuries': 0.0, 'other-minor-injuries': 0.0, 'deceased-pedestrians': 0.0, 'pedestrians-serious-injuries': 0.0, 'pedestrians-minor-injuries': 0.0, 'n-accidents-with-victim': 0.0, 'deceased': 0.0, 'injured-hospitalized': 0.0, 'injured-not-hospitalized': 0.0, 'year': 2023}, {'ine-code': 2002, 'municipality': 'Alatoz', 'province': 'Albacete', 'ccaa': 'Castilla-La Mancha', 'deceased-bicyclists': 0.0, 'bicycles-serious-injuries': 0.0, 'bicycles-minor-injuries': 0.0, 'deceased-mopeds': 0.0, 'mopeds-serious-injuries': 0.0, 'mopeds-minor-injuries': 0.0, 'deceased-motrocycles': 0.0, 'motorcycles-serious-injuries': 0.0, 'motorcycles-minor-injuries': 0.0, 'deceased-cars': 0.0, 'cars-serious-injuries': 0.0, 'cars-minor-injuries': 0.0, 'deceased-vans': 0.0, 'vans-serious-injuries': 0.0, 'vans-minor-injuries': 0.0, 'deceased-trucks': 0.0, 'trucks-serious-injuries': 0.0, 'trucks-minor-injuries': 0.0, 'deceased-buses': 0.0, 'buses-serious-injuries': 0.0, 'buses-minor-injuries': 0.0, 'other-deceased': 0.0, 'other-serious-injuries': 0.0, 'other-minor-injuries': 0.0, 'deceased-pedestrians': 0.0, 'pedestrians-serious-injuries': 0.0, 'pedestrians-minor-injuries': 0.0, 'n-accidents-with-victim': 0.0, 'deceased': 0.0, 'injured-hospitalized': 0.0, 'injured-not-hospitalized': 0.0, 'year': 2023}];;
let data = [];

// Función para cargar datos desde el CSV
function cargarDatosDesdeCSV() {
    fs.createReadStream(path)
        .pipe(csv({ separator: ';' }))
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {
            console.log('CSV file successfully processed');
            console.log(data.length); // Aquí puedes ver los datos cargados
            calculateDeceased();
        })
        .on('error', (error) => {
            console.error('Error reading CSV file', error);
        });
}
cargarDatosDesdeCSV()
function calculateDeceased() {

        let filtrado = data.filter((x)=> x.ccaa=='País Vasco');
        let sum=0;
        let x= filtrado.map((x)=>Number(x['injured-not-hospitalized'])).reduce((sum,value)=>sum+value,sum);
        console.log(`Media heridos no hosptalizados en País Vasco:`, x/filtrado.length);
        return x/filtrado.length;
    ;
}

module.exports= calculateDeceased
//cargarDatosDesdeCSV()
//calculateDeceased()

   