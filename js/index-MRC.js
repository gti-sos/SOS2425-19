const fs = require('fs');
const csv = require('csv-parser');

const path = 'data/DatosMunicipalesSiniestralidad_2023.csv';
function loadInitialDataMRC(){
    const datos = [
        {
            "ine-code": "01001",
            "municipality": "Alegría-Dulantzi",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2,023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "0"
        },
        {
            "ine-code": "01002",
            "municipality": "Amurrio",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2,023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "1"
        },
        {
            "ine-code": "01003",
            "municipality": "Aramaio",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2,023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "0"
        },
        {
            "ine-code": "01004",
            "municipality": "Artziniega",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2,023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "0"
        },
        {
            "ine-code": "01006",
            "municipality": "Armiñón",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2,023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "0"
        },
        {
            "ine-code": "01008",
            "municipality": "Arratzua-Ubarrundia",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2,023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "2"
        },
        {
            "ine-code": "01009",
            "municipality": "Asparrena",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2,023",
            "deceased": "0",
            "injured-hospitalized": "1",
            "injured-not-hospitalized": "0"
        },
        {
            "ine-code": "01010",
            "municipality": "Ayala/Aiara",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2,023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "1"
        },
        {
            "ine-code": "01011",
            "municipality": "Baños de Ebro/Mañueta",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2,023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "0"
        },
        {
            "ine-code": "01013",
            "municipality": "Barrundia",
            "province": "Araba/Álava",
            "ccaa": "País Vasco",
            "year": "2,023",
            "deceased": "0",
            "injured-hospitalized": "0",
            "injured-not-hospitalized": "2"
        }
    ];
    return datos;
}

let data = [];
function csvToArray(csvString, delimiter = ";") {
    const lines = csvString.trim().split("\n");
    const headers = lines[0].split(delimiter).map(header => header.trim());

    return lines.slice(1).map(line => {
        const values = line.split(delimiter).map(value => value.trim());
        return headers.reduce((obj, header, index) => {
            obj[header] = isNaN(values[index]) ? values[index] : Number(values[index]);
            return obj;
        }, {});
    });
}

const csvContent = fs.readFileSync(path, 'utf8');

const siniestralidadData = csvToArray(csvContent);
//console.log(siniestralidadData);
function calculateDeceased(ccaa) {
    
           
    let filtrado = siniestralidadData.filter((x) => x.ccaa === ccaa);
    
    let sum = filtrado
        .map((x) => Number(x['injured-not-hospitalized']) || 0) // Convierte a número o usa 0 si no es válido
        .reduce((sum, value) => sum + value, 0);
    let media = sum / filtrado.length;
    console.log(`Media heridos no hospitalizados en la Comunidad Valenciana: ${media}`);   
    return media;
}

module.exports = {calculateDeceased,siniestralidadData,loadInitialDataMRC};
calculateDeceased();