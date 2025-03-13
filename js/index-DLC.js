const fs = require('fs');
const path = require('path');

const TARGET_REGION = 'Comunitat Valenciana'; // Cambia esto según la comunidad autónoma deseada
const FILE_PATH = path.join(__dirname, '../data/DatosProvincialesSancionesPuntos_2022.csv')

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

const csvContent = fs.readFileSync(FILE_PATH, 'utf8');

const sanctionsData = csvToArray(csvContent);

function calculatePointsDeducted(target) {
    
    
    
let filtered = sanctionsData.filter((x)=> x.autonomous_community === target)

let totalPoints = filtered.reduce((sum, points) => sum + points.total_points_deducted, 0);
let average = filtered.length > 0 ? totalPoints / filtered.length : 0;


console.log(`Media de total_points_deducted en ${TARGET_REGION} :`, average.toFixed(2));
return [target,average];
}


function loadInitialDataDLC(){
    const sanctionsData = [
        {ine_code: 3037, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3038, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3039, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3040, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3041, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 148, total_points_deducted: 696},
        {ine_code: 3042, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 4, total_points_deducted: 18},
        {ine_code: 3043, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3044, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3045, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3046, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0},
        {ine_code: 3047, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 72, total_points_deducted: 330},
        {ine_code: 3048, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 11, total_points_deducted: 51},
        {ine_code: 3049, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 179, total_points_deducted: 809},
        {ine_code: 3050, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 262, total_points_deducted: 1121}
        
    ];
    return sanctionsData
}

module.exports = {calculatePointsDeducted,sanctionsData,loadInitialDataDLC};
