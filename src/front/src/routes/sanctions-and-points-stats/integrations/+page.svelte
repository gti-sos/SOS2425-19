<svelte:head>
    <script src="https://code.highcharts.com/highcharts.js"></script>
    <script src="https://code.highcharts.com/modules/exporting.js"></script>
    <script src="https://code.highcharts.com/modules/accessibility.js"></script>

    <!-- Billboard JS -->
        <!-- Step 1) Load D3.js -->
    <script src="https://d3js.org/d3.v6.min.js"></script>

    <script src="https://cdn.jsdelivr.net/npm/billboard.js/dist/billboard.min.js"></script>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/billboard.js/dist/billboard.min.css">


</svelte:head>
<!-- svelte-ignore css_unused_selector -->
<style>
    #bar {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
    }

    #bar>svg {
        display: block;
    }

    .highcharts-figure,
.highcharts-data-table table {
    min-width: 320px;
    max-width: 800px;
    margin: 1em auto;
}

.highcharts-data-table table {
    font-family: Verdana, sans-serif;
    border-collapse: collapse;
    border: 1px solid #ebebeb;
    margin: 10px auto;
    text-align: center;
    width: 100%;
    max-width: 500px;
}

.highcharts-data-table caption {
    padding: 1em 0;
    font-size: 1.2em;
    color: #555;
}

.highcharts-data-table th {
    font-weight: 600;
    padding: 0.5em;
}

.highcharts-data-table td,
.highcharts-data-table th,
.highcharts-data-table caption {
    padding: 0.5em;
}

.highcharts-data-table thead tr,
.highcharts-data-table tbody tr:nth-child(even) {
    background: #f8f8f8;
}

.highcharts-data-table tr:hover {
    background: #f1f7ff;
}

input[type="number"] {
    min-width: 50px;
}

.highcharts-description {
    margin: 0.3rem 10px;
}

</style>

<script>
    //@ts-nocheck
    import {onMount} from "svelte";
    import {dev} from "$app/environment"
    import { Table,Button } from '@sveltestrap/sveltestrap';

    let DEVEL_HOST = "http://localhost:16078";
    let API = "/api/v1/sanctions-and-points-stats";
    if(dev){
        API = DEVEL_HOST + API
    }
    let sanctionsData = [];
    let populationData = [];
    let aaccData = [];
    let g10Data = [];
    let g15Data = [];
    let g17Data = [];
    let result ="";
    let resultStatus ="";
    let countryData = null;
    let spainData = null;
    let spainAACCData = null;
    let g15OcupiedData = null;
    let g17UniversityData = null;
    let g10AccidentsData = null;

    const geoNameToSanctionName = {
        "Andalusia": "Andalucía",
        "Aragon": "Aragón",
        "Asturias": "Asturias",
        "Balearic Islands": "Islas Baleares",
        "Basque Country": "País Vasco",
        "Canary Islands": "Canarias",
        "Cantabria": "Cantabria",
        "Castille and León": "Castilla y León",
        "Castille-La Mancha": "Castilla-La Mancha",
        "Catalonia": "Cataluña",
        "Ceuta": "Ceuta",
        "Extremadura": "Extremadura",
        "Galicia": "Galicia",
        "La Rioja": "La Rioja",
        "Madrid": "Madrid",
        "Melilla": "Melilla",
        "Murcia": "Murcia",
        "Navarre": "Navarra",
        "Valencia": "Comunidad Valenciana"
};


    async function getSanctions() {
        resultStatus = result = "";
        try {
            const res = await fetch(API, {method:"GET"});        
            const data = await res.json();
            result = JSON.stringify(data,null,2);
            
            sanctionsData = data;
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
        }
    }

    //GET APIs externas
    async function getSpainData() {
        resultStatus = result = "";
        try {
            const res = await fetch(`${API}/spain`, {method:"GET"});        
            const data = await res.json();
            result = JSON.stringify(data,null,2);
            
            populationData = data;
            console.log(populationData)
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
        }
    }
    async function getAACCData() {
        resultStatus = result = "";
        try {
            const res = await fetch(`${API}/aacc`, {method:"GET"});        
            const data = await res.json();
            result = JSON.stringify(data,null,2);
            
            aaccData = data;
            console.log(aaccData)
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
        }
    }
    
    //GET APIs alumnos SOS
    async function getG10() {
        resultStatus = result = "";
        try {
            const res = await fetch(`${API}/g10`, {method:"GET"});        
            const data = await res.json();
            result = JSON.stringify(data,null,2);
            
            g10Data= data;
            console.log(g10Data)
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
        }
    }
    async function getG15() {
        resultStatus = result = "";
        try {
            const res = await fetch(`${API}/g15`, {method:"GET"});        
            const data = await res.json();
            result = JSON.stringify(data,null,2);
            
            g15Data = data;
            console.log(g15Data)
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
        }
    }
    async function getG17() {
        resultStatus = result = "";
        try {
            const res = await fetch(`${API}/g17`, {method:"GET"});        
            const data = await res.json();
            result = JSON.stringify(data,null,2);
            
            g17Data = data;
            console.log(g17Data)
        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`)
        }
    }


    // Primera grafica-->PIE
    async function getAPIDataWithProxy() {
    try {
        const res = await fetch(`${API}/proxy`);
        if (!res.ok) {
            console.error('Error al cargar datos del proxy', res.status);
            return;
        }

        const countryData = await res.json();
        const totalPopulation = countryData?.[0]?.population || 1;
        const normalizedData = transformDataPerCapita(sanctionsData, totalPopulation);

        // Transformamos los datos al formato ["label", valor]
        const chartData = normalizedData.map(entry => [entry.name, entry.y]);

        const chart = bb.generate({
            data: {
                columns: chartData,
                type: "pie",
                onclick: function (d, i) {
                },
                onover: function (d, i) {
                },
                onout: function (d, i) {
                }
            },
            title: {
                text: "Sanciones por 100.000 habitantes"
            },
            bindto: "#container"
        });

    } catch (error) {
        console.error("Error de red:", error);
    }
    }
    //Segunda grafica--> RADAR
    async function getAPIDataWithoutProxy1() {
    try {
        const res = await fetch(`${API}/spain`);
        if (!res.ok) {
            console.error('Error al cargar datos del proxy', res.status);
            return;
        }

        const spainData = await res.json();
        const totalPopulation = spainData?.[0]?.population || 1;
        const normalizedData = transformDataPerCapita(sanctionsData, totalPopulation);

        const categories = normalizedData.map(d => d.name);
        const values = normalizedData.map(d => d.y);

        // Estructura para gráfico radar
        const columns = [
            ["x", ...categories],
            ["Sanciones", ...values]
        ];

        bb.generate({
    data: {
        x: "x",
        columns: columns,
        type: "radar",
        labels: false  // <-- desactiva las etiquetas
    },
    radar: {
        axis: {
            max: Math.max(...values) * 1.1
        },
        level: {
            depth: 5
        },
        direction: {
            clockwise: true
        }
    },
    tooltip: {
        format: {
            title: function (i) {
                return categories[i];
            },
            value: function (value) {
                return `${value.toFixed(1)} sanciones por 100.000 hab.`;
            }
        }
    },
    title: {
        text: "Sanciones por 100.000 habitantes"
    },
    bindto: "#container-spain"
        });


    } catch (error) {
        console.error("Error de red:", error);
    }
    }
    function transformDataPerCapita(data, totalPopulation) {
    const grouped = {};

    for (const item of data) {
        const community = item.autonomous_community;
        if (!grouped[community]) {
            grouped[community] = 0;
        }
        grouped[community] += item.total_sanctions_with_points;
    }

    // Convertir a tasa por 100.000 habitantes a nivel país (distribución proporcional simple)
    return Object.entries(grouped).map(([name, value]) => ({
        name,
        y: (value / totalPopulation) * 100000
    }));
    }

    //Tercera grafica--> BAR
    function normalizeName(name) {
    return name
        .normalize("NFD")                    // elimina tildes
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/\(.*?\)/g, "")            // elimina paréntesis y su contenido
        .replace(/comunidad foral de|comunidad de|region de/gi, "") // elimina extras
        .replace(/la rioja/i, "rioja")      // excepciones específicas
        .trim()
        .toLowerCase();
    }
    function calculateSanctionPercentageByCommunity(sanctionsData, geoData) {
    const populationMap = {};
    for (const region of geoData.geonames) {
        const geoName = geoNameToSanctionName[region.name] || region.name;
        const normalized = normalizeName(geoName);
        populationMap[normalized] = region.population;
    }

    // Agrupar sanciones por comunidad
    const groupedSanctions = {};
    const originalNames = {};

    for (const item of sanctionsData) {
        const originalName = item.autonomous_community;
        const normalized = normalizeName(originalName);

        if (!groupedSanctions[normalized]) {
            groupedSanctions[normalized] = 0;
            originalNames[normalized] = originalName;
        }
        groupedSanctions[normalized] += item.total_sanctions_with_points || 0;
    }

    // Calcular % población sancionada
    const result = [];
    for (const [normName, totalSanctions] of Object.entries(groupedSanctions)) {
        const population = populationMap[normName];
        const label = originalNames[normName];
        if (population && label) {
            result.push({
                name: label,
                y: parseFloat(((totalSanctions / population) * 100).toFixed(2))
            });
        }
    }

    return result;
    }

    async function getAPIDataWithoutProxy2() {
    try {
        const res = await fetch(`${API}/aacc`);
        if (!res.ok) {
            console.error('Error al cargar datos de comunidades', res.status);
            return;
        }

        const aaccData = await res.json();
        const sanctionPercentData = calculateSanctionPercentageByCommunity(sanctionsData, aaccData);

        const categories = sanctionPercentData.map(d => d.name);
        const values = sanctionPercentData.map(d => d.y);

        bb.generate({
            data: {
                x: "x",
                columns: [
                    ["x", ...categories],
                    ["% sancionada", ...values]
                ],
                types: {
                    "% sancionada": "bar",
                }
            },
            axis: {
                x: {
                    type: "category",
                    label: {
                        text: "Comunidad Autónoma",
                        position: "outer-center"
                    }
                },
                y: {
                    label: {
                        text: "% sancionada",
                        position: "outer-middle"
                    }
                }
            },
            tooltip: {
                format: {
                    value: function (value) {
                        return `${value.toFixed(2)}%`;
                    }
                }
            },
            title: {
                text: "% de población sancionada por comunidad"
            },
            bindto: "#container-aacc"
        });

    } catch (error) {
        console.error("Error de red:", error);
    }
    }

    //Cuarta Gráfica(G15)--> AREA
    async function getCombinedChartData() {
    try {
        const res = await fetch(`${API}/g15`);
        if (!res.ok) {
            console.error('Error al cargar datos de ocupaciones', res.status);
            return;
        }

        const ocupiedData = await res.json();

        const dataOcupied = ["Tierras"];
        const dataSanctions = ["Sanciones"];
        const categories = [];

        const targetYears = [2018, 2019, 2020, 2021, 2022];

        for (const year of targetYears) {
            const totalOcupied = ocupiedData
                .filter(d => parseInt(d.year) === year)
                .reduce((sum, d) => sum + parseInt(d.non_agrarian_surface || 0), 0);

            const totalSanctions = sanctionsData
                .filter(d => parseInt(d.year) === year)
                .reduce((sum, d) => sum + parseInt(d.total_sanctions_with_points || 0), 0);

            categories.push(year);
            dataOcupied.push(totalOcupied);
            dataSanctions.push(totalSanctions);
        }

        bb.generate({
            data: {
                columns: [
                    dataOcupied,
                    dataSanctions
                ],
                types: {
                    "Tierras": "area-spline",
                    "Sanciones": "area-spline"
                }
            },
            color: {
                pattern: ["#2ca02c", "#ff7f0e"] // Verde para tierras, naranja para sanciones
            },
            axis: {
                x: {
                    type: "category",
                    categories: categories,
                    label: {
                        text: "Año",
                        position: "outer-center"
                    }
                },
                y: {
                    label: {
                        text: "Hectáreas / Nº de Sanciones",
                        position: "outer-middle"
                    }
                }
            },
            tooltip: {
                format: {
                    title: function (x) {
                        return `Año ${categories[x]}`;
                    },
                    value: function (value, ratio, id) {
                        return id === "Tierras"
                            ? `${value.toLocaleString("es-ES")} ha`
                            : `${value.toLocaleString("es-ES")} sanciones`;
                    }
                }
            },
            title: {
                text: "Sanciones vs Tierras No Agrarias (2018–2022)"
            },
            bindto: "#container-g15"
        });

    } catch (error) {
        console.error("Error de red:", error);
    }
    }

    //Quinta grafica(G10)-->SCATTER
    async function getCombinedChartData1() {
    try {
        const res = await fetch(`${API}/g10`);
        if (!res.ok) {
            console.error('Error al cargar datos de accidentes', res.status);
            return;
        }

        const accidentsData = await res.json();

        const targetYears = [2022,2023];

        // Agrupar víctimas y sanciones por año
        const victimsByYear = {};
        const sanctionsByYear = {};

        for (const year of targetYears) {
            victimsByYear[year] = accidentsData
                .filter(d => parseInt(d.year) === year)
                .reduce((sum, d) => sum + parseInt(d.total_victims || 0), 0);

            sanctionsByYear[year] = sanctionsData
                .filter(d => parseInt(d.year) === year)
                .reduce((sum, d) => sum + parseInt(d.total_sanctions_with_points || 0), 0);
        }

        // Dos conjuntos: Sanciones (x = año, y = nº sanciones), Accidentes (x = año, y = víctimas)
        const sanciones_x = ["sanciones_x"];
        const sanciones_y = ["Sanciones"];
        const accidentes_x = ["accidentes_x"];
        const accidentes_y = ["Accidentes"];

        for (const year of targetYears) {
            sanciones_x.push(year);
            sanciones_y.push(sanctionsByYear[year] || 0);
            accidentes_x.push(year);
            accidentes_y.push(victimsByYear[year] || 0);
        }

        // Dibujar gráfico
        bb.generate({
            data: {
                xs: {
                    "Sanciones": "sanciones_x",
                    "Accidentes": "accidentes_x"
                },
                columns: [
                    sanciones_x,
                    sanciones_y,
                    accidentes_x,
                    accidentes_y
                ],
                type: "scatter"
            },
            color: {
                pattern: ["#1f77b4", "#d62728"] // Azul y rojo
            },
            axis: {
                x: {
                    label: "Año",
                    tick: {
                        format: d => d.toString()
                    }
                },
                y: {
                    label: "Cantidad"
                }
            },
            tooltip: {
                format: {
                    value: function (value, ratio, id) {
                        return `${value.toLocaleString()} ${id}`;
                    }
                }
            },
            bindto: "#container-g10"
        });

    } catch (error) {
        console.error("Error de red:", error);
    }
    }

    //Sexta grafica (G17)--> CANDELSTICK

    async function getCombinedChartData2() {
    try {
        const eduRes = await fetch(`${API}/g17`);
        if (!eduRes.ok) {
            console.error('Error al cargar datos académicos', eduRes.status);
            return;
        }

        const educationData = await eduRes.json();

        // Agrupar datos por año
        const sancByYear = {};
        sanctionsData.forEach(d => {
            const year = d.year.toString();
            if (!sancByYear[year]) sancByYear[year] = [];
            sancByYear[year].push(parseFloat(d.total_sanctions_with_points || 0));
        });

        const bubbleData = [];

        educationData.forEach((d, index) => {
            const year = d.academicYear?.split("-")[0];
            const successRate = parseFloat(d.successRate || 0);
            if (!year || !(year in sancByYear)) return;

            const avgSanctions = sancByYear[year].reduce((a, b) => a + b, 0) / sancByYear[year].length;

            bubbleData.push({
                id: `Programa ${index + 1}`,
                x: year,
                value: avgSanctions,
                r: successRate
            });
        });

        // Generar gráfico bubble
        bb.generate({
            data: {
                json: bubbleData,
                type: "bubble",
                keys: {
                    x: "x",
                    value: ["value"],
                    radius: "r",
                    id: "id"
                },
                labels: true
            },
            bubble: {
                maxR: 50
            },
            axis: {
                x: {
                    type: "category",
                    label: "Año académico"
                },
                y: {
                    label: "Sanciones con puntos",
                    max: 450
                }
            },
            bindto: "#bubbleChart"
        });

    } catch (error) {
        console.error("Error de red:", error);
    }
}



onMount(async () => {
    await getSanctions();
    // API externa con proxy
    await getAPIDataWithProxy();

    //APIs externas sin proxy
    await getSpainData()
    await getAPIDataWithoutProxy1()

    await getAACCData();        
    await getAPIDataWithoutProxy2();

    //APIs alumnos SOS
    // G15
    await getG15();
    await getCombinedChartData();

    //G10
    await getG10();
    await getCombinedChartData1();
    //G17
    await getG17();
    await getCombinedChartData2();
});


</script>

<h2>Integracion con datos de <a href="https://restcountries.com/"> https://restcountries.com/</a></h2>

<figure class="highcharts-figure">
    <div id="container"></div>     
</figure>

<h2>Integracion con datos de <a href="https://www.apicountries.com/"> https://www.apicountries.com/</a></h2>


<div id="container-spain"></div>    


<h2>Integracion con datos de <a href="http://api.geonames.org/"> http://api.geonames.org/</a></h2>


<div id="container-aacc"></div>   

<h2> Integracion con datos de <a href="https://sos2425-15.onrender.com/api/v1/ocupied-grand-stats"> G15-ocupied-grand-stats  </a></h2>

<div id="container-g15"></div>    

<h2> Integracion con datos de <a href="https://sos2425-10.onrender.com/api/v2/accidents-stats">  G10-accidents-stats  </a></h2>

<div id="container-g10"></div>    

<h2> Integracion con datos de <a href="https://sos2425-17.onrender.com/api/v2/university-academic-performance">  G17-university-academic-performance  </a></h2>

<div id="container-g17"></div>    
