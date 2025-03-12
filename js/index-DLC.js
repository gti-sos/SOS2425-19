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
        {ine_code: 3037, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0, speeding_two_points: 0, speeding_three_points: 0, speeding_four_points: 0, speeding_six_points: 0, alcohol_four_points: 0, alcohol_six_points: 0, drugs_six_points: 0, helmet_seatbelt_child_restraint_system_three_points: 0, helmet_seatbelt_child_restraint_system_four_points: 0, helmet_seatbelt_child_restraint_system_six_points: 0, mobile_phone_three_points: 0, mobile_phone_four_points: 0, mobile_phone_six_points: 0, traffic_light_three_points: 0, traffic_light_four_points: 0, traffic_light_six_points: 0, other_three_points: 0, other_four_points: 0, other_six_points: 0},
        {ine_code: 3038, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0, speeding_two_points: 0, speeding_three_points: 0, speeding_four_points: 0, speeding_six_points: 0, alcohol_four_points: 0, alcohol_six_points: 0, drugs_six_points: 0, helmet_seatbelt_child_restraint_system_three_points: 0, helmet_seatbelt_child_restraint_system_four_points: 0, helmet_seatbelt_child_restraint_system_six_points: 0, mobile_phone_three_points: 0, mobile_phone_four_points: 0, mobile_phone_six_points: 0, traffic_light_three_points: 0, traffic_light_four_points: 0, traffic_light_six_points: 0, other_three_points: 0, other_four_points: 0, other_six_points: 0},
        {ine_code: 3039, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0, speeding_two_points: 0, speeding_three_points: 0, speeding_four_points: 0, speeding_six_points: 0, alcohol_four_points: 0, alcohol_six_points: 0, drugs_six_points: 0, helmet_seatbelt_child_restraint_system_three_points: 0, helmet_seatbelt_child_restraint_system_four_points: 0, helmet_seatbelt_child_restraint_system_six_points: 0, mobile_phone_three_points: 0, mobile_phone_four_points: 0, mobile_phone_six_points: 0, traffic_light_three_points: 0, traffic_light_four_points: 0, traffic_light_six_points: 0, other_three_points: 0, other_four_points: 0, other_six_points: 0},
        {ine_code: 3040, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0, speeding_two_points: 0, speeding_three_points: 0, speeding_four_points: 0, speeding_six_points: 0, alcohol_four_points: 0, alcohol_six_points: 0, drugs_six_points: 0, helmet_seatbelt_child_restraint_system_three_points: 0, helmet_seatbelt_child_restraint_system_four_points: 0, helmet_seatbelt_child_restraint_system_six_points: 0, mobile_phone_three_points: 0, mobile_phone_four_points: 0, mobile_phone_six_points: 0, traffic_light_three_points: 0, traffic_light_four_points: 0, traffic_light_six_points: 0, other_three_points: 0, other_four_points: 0, other_six_points: 0},
        {ine_code: 3041, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 148, total_points_deducted: 696, speeding_two_points: 0, speeding_three_points: 0, speeding_four_points: 0, speeding_six_points: 0, alcohol_four_points: 124, alcohol_six_points: 132, drugs_six_points: 0, helmet_seatbelt_child_restraint_system_three_points: 18, helmet_seatbelt_child_restraint_system_four_points: 32, helmet_seatbelt_child_restraint_system_six_points: 0, mobile_phone_three_points: 0, mobile_phone_four_points: 0, mobile_phone_six_points: 0, traffic_light_three_points: 0, traffic_light_four_points: 0, traffic_light_six_points: 32, other_three_points: 0, other_four_points: 36, other_six_points: 88},
        {ine_code: 3042, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 4, total_points_deducted: 18, speeding_two_points: 0, speeding_three_points: 0, speeding_four_points: 0, speeding_six_points: 0, alcohol_four_points: 4, alcohol_six_points: 6, drugs_six_points: 0, helmet_seatbelt_child_restraint_system_three_points: 0, helmet_seatbelt_child_restraint_system_four_points: 4, helmet_seatbelt_child_restraint_system_six_points: 0, mobile_phone_three_points: 0, mobile_phone_four_points: 0, mobile_phone_six_points: 0, traffic_light_three_points: 0, traffic_light_four_points: 0, traffic_light_six_points: 4, other_three_points: 0, other_four_points: 0, other_six_points: 0},
        {ine_code: 3043, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0, speeding_two_points: 0, speeding_three_points: 0, speeding_four_points: 0, speeding_six_points: 0, alcohol_four_points: 0, alcohol_six_points: 0, drugs_six_points: 0, helmet_seatbelt_child_restraint_system_three_points: 0, helmet_seatbelt_child_restraint_system_four_points: 0, helmet_seatbelt_child_restraint_system_six_points: 0, mobile_phone_three_points: 0, mobile_phone_four_points: 0, mobile_phone_six_points: 0, traffic_light_three_points: 0, traffic_light_four_points: 0, traffic_light_six_points: 0, other_three_points: 0, other_four_points: 0, other_six_points: 0},
        {ine_code: 3044, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0, speeding_two_points: 0, speeding_three_points: 0, speeding_four_points: 0, speeding_six_points: 0, alcohol_four_points: 0, alcohol_six_points: 0, drugs_six_points: 0, helmet_seatbelt_child_restraint_system_three_points: 0, helmet_seatbelt_child_restraint_system_four_points: 0, helmet_seatbelt_child_restraint_system_six_points: 0, mobile_phone_three_points: 0, mobile_phone_four_points: 0, mobile_phone_six_points: 0, traffic_light_three_points: 0, traffic_light_four_points: 0, traffic_light_six_points: 0, other_three_points: 0, other_four_points: 0, other_six_points: 0},
        {ine_code: 3045, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0, speeding_two_points: 0, speeding_three_points: 0, speeding_four_points: 0, speeding_six_points: 0, alcohol_four_points: 0, alcohol_six_points: 0, drugs_six_points: 0, helmet_seatbelt_child_restraint_system_three_points: 0, helmet_seatbelt_child_restraint_system_four_points: 0, helmet_seatbelt_child_restraint_system_six_points: 0, mobile_phone_three_points: 0, mobile_phone_four_points: 0, mobile_phone_six_points: 0, traffic_light_three_points: 0, traffic_light_four_points: 0, traffic_light_six_points: 0, other_three_points: 0, other_four_points: 0, other_six_points: 0},
        {ine_code: 3046, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 0, total_points_deducted: 0, speeding_two_points: 0, speeding_three_points: 0, speeding_four_points: 0, speeding_six_points: 0, alcohol_four_points: 0, alcohol_six_points: 0, drugs_six_points: 0, helmet_seatbelt_child_restraint_system_three_points: 0, helmet_seatbelt_child_restraint_system_four_points: 0, helmet_seatbelt_child_restraint_system_six_points: 0, mobile_phone_three_points: 0, mobile_phone_four_points: 0, mobile_phone_six_points: 0, traffic_light_three_points: 0, traffic_light_four_points: 0, traffic_light_six_points: 0, other_three_points: 0, other_four_points: 0, other_six_points: 0},
        {ine_code: 3047, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 72, total_points_deducted: 330, speeding_two_points: 0, speeding_three_points: 0, speeding_four_points: 0, speeding_six_points: 0, alcohol_four_points: 20, alcohol_six_points: 102, drugs_six_points: 0, helmet_seatbelt_child_restraint_system_three_points: 36, helmet_seatbelt_child_restraint_system_four_points: 36, helmet_seatbelt_child_restraint_system_six_points: 0, mobile_phone_three_points: 0, mobile_phone_four_points: 0, mobile_phone_six_points: 0, traffic_light_three_points: 0, traffic_light_four_points: 0, traffic_light_six_points: 18, other_three_points: 40, other_four_points: 78},
        {ine_code: 3048, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 11, total_points_deducted: 51, speeding_two_points: 0, speeding_three_points: 0, speeding_four_points: 0, speeding_six_points: 0, alcohol_four_points: 8, alcohol_six_points: 18, drugs_six_points: 0, helmet_seatbelt_child_restraint_system_three_points: 6, helmet_seatbelt_child_restraint_system_four_points: 0, helmet_seatbelt_child_restraint_system_six_points: 0, mobile_phone_three_points: 0, mobile_phone_four_points: 0, mobile_phone_six_points: 0, traffic_light_three_points: 0, traffic_light_four_points: 0, traffic_light_six_points: 0, other_three_points: 3, other_four_points: 4, other_six_points: 12},
        {ine_code: 3049, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 179, total_points_deducted: 809, speeding_two_points: 0, speeding_three_points: 0, speeding_four_points: 0, speeding_six_points: 0, alcohol_four_points: 152, alcohol_six_points: 156, drugs_six_points: 0, helmet_seatbelt_child_restraint_system_three_points: 45, helmet_seatbelt_child_restraint_system_four_points: 40, helmet_seatbelt_child_restraint_system_six_points: 0, mobile_phone_three_points: 0, mobile_phone_four_points: 0, mobile_phone_six_points: 0, traffic_light_three_points: 88, traffic_light_four_points: 0, traffic_light_six_points: 24, other_three_points: 112, other_four_points: 192, other_six_points: 0},
        {ine_code: 3050, province: "Alicante/Alacant", autonomous_community: "Comunitat Valenciana", year: 2022, total_sanctions_with_points: 262, total_points_deducted: 1121, speeding_two_points: 16, speeding_three_points: 0, speeding_four_points: 4, speeding_six_points: 6, alcohol_four_points: 192, alcohol_six_points: 180, drugs_six_points: 0, helmet_seatbelt_child_restraint_system_three_points: 45, helmet_seatbelt_child_restraint_system_four_points: 96, helmet_seatbelt_child_restraint_system_six_points: 0, mobile_phone_three_points: 0, mobile_phone_four_points: 0, mobile_phone_six_points: 0, traffic_light_three_points: 100, traffic_light_four_points: 0, traffic_light_six_points: 108, other_three_points: 140, other_four_points: 23, other_six_points: 0}
        
    ];
    return sanctionsData
}

module.exports = {calculatePointsDeducted,sanctionsData,loadInitialDataDLC};
