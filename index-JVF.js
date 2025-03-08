const TARGET_REGION = "andalucia";

function CalculateChanges(){

    let datos= [{autonomous_community:"andalucia", province:"jaen", truck:2620, van:3710, bus:55, car:19639, motocycle:3297, industrial_truck:459, trailer_and_semitrailer:460, other_vehicle:774, total:31014, year:2023},
        {autonomous_community:"andalucia", province:"granada", truck:3127, van:3787, bus:99, car:33356, motocycle:9888, industrial_truck:680, trailer_and_semitrailer:616, other_vehicle:1099, total:52652, year:2023},
        {autonomous_community:"andalucia", province:"malaga", truck:6254, van:8913, bus:133, car:80556, motocycle:19402, industrial_truck:874, trailer_and_semitrailer:1270, other_vehicle:1435, total:118837, year:2023},
        {autonomous_community:"aragon", province:"zaragoza", truck:2988, van:4402, bus:55, car:39804, motocycle:6791, industrial_truck:919, trailer_and_semitrailer:2113, other_vehicle:1008, total:58080, year:2023},
        {autonomous_community:"aragon", province:"teruel", truck:1905, van:1099, bus:4, car:5545, motocycle:481, industrial_truck:197, trailer_and_semitrailer:234, other_vehicle:119, total:9584, year:2023},
        {autonomous_community:"aragon", province:"huesca", truck:1494, van:1199, bus:17, car:9452, motocycle:900, industrial_truck:176, trailer_and_semitrailer:258, other_vehicle:314, total:13810, year:2023},
        {autonomous_community:"canarias", province:"santa cruz de tenerife", truck:7614, van:5544, bus:212, car:47106, motocycle:9429, industrial_truck:131, trailer_and_semitrailer:232, other_vehicle:1203, total:71471, year:2023},
        {autonomous_community:"cantabria", province:"cantabria", truck:1966, van:1936, bus:24, car:23810, motocycle:4081, industrial_truck:580, trailer_and_semitrailer:1074, other_vehicle:533, total:34004, year:2023},
        {autonomous_community:"castilla y leon", province:"segovia", truck:493, van:490, bus:11, car:4473, motocycle:2143, industrial_truck:93, trailer_and_semitrailer:202, other_vehicle:197, total:8102, year:2023},
        {autonomous_community:"castilla y leon", province:"salamanca", truck:973, van:1064, bus:48, car:13084, motocycle:1429, industrial_truck:164, trailer_andsemitrailer:260, other_vehicle:327, total:17349, year:2023}
        ];
    
    // filtrado por la comunidad autonoma 
    let filtrado = datos.filter((x)=> x.autonomous_community == TARGET_REGION)

    let totalChanges= filtrado.reduce((sum,changes) => sum+ changes.car,0);

    let averageChanges = filtrado.length > 0 ? totalChanges / filtrado.length : 0;

    console.log(`Media de cambios de coches en ${TARGET_REGION}:`, averageChanges);
    return averageChanges;
}

module.exports = CalculateChanges;
CalculateChanges();