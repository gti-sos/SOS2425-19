<svelte:head>
    <!-- Carga de estilos de C3 -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.css" rel="stylesheet">

    <!-- Carga de D3.js (requerido por C3) -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js"></script>

    <!-- Carga de C3.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js"></script>

</svelte:head>

<script>
	//@ts-nocheck
    import { onMount } from "svelte";
    import{dev} from "$app/environment";

    let DEVEL_HOST= "http://localhost:16078";
    let API= "/api/v2/ownerships-changes-stats";

    if (dev){
        API= DEVEL_HOST + API
    };

    onMount(async() =>{
        //datos mi api
        let api1 = await fetch(API);
        let exchangeData = await api1.json();
    
        //datos api externa
        const api2 = await fetch("https://sos2425-14.onrender.com/api/v1/cybercrime-data");
        const crimeData = await api2.json();
    
    const result = [];

    crimeData.forEach(entry => {
        const comunidad = entry.autonomous_community;
        const criminal_ofense = entry.criminal_ofense || 0;
        const arrested = entry.arrested_investigated || 0;

        // Busca intercambios de vehículos en esa comunidad
        const match = exchangeData.find(e => e.autonomous_community === comunidad);
        if (!match) return null;
        const motorcycles = match?.motocycle || 0;
        const cars = match?.car || 0;

        result.push({
        comunidad,
        criminal_ofense,
        arrested,
        motorcycles,
        cars
        });
    });
    const comunidades = result.map(r => r.comunidad);
    // Preparamos los datos para el gráfico tipo scatter
    const columns = [
        ['criminal_ofense', ...result.map(r => r.criminal_ofense)],
        ['arrested', ...result.map(r => r.arrested)],
        ['motorcycles', ...result.map(r => r.motorcycles)],
        ['cars', ...result.map(r => r.cars)]
    ];

  // Dibujamos el gráfico
        var chart = c3.generate({
            bindto: '#chart',
            data: {
            xs: {
                motorcycles: 'criminal_ofense',
                cars: 'criminal_ofense',
                arrested: 'criminal_ofense'
            },
            columns: columns,
            type: 'scatter'
            },
            axis: {
            x: {
                label: 'Criminal Offenses',
                tick: {
                fit: false
                }
            },
            y: {
                label: 'Vehículos intercambiados'
            }
            },
            tooltip: {
            contents: function (d, defaultTitleFormat, defaultValueFormat, color) {
                const index = d[0].index; // posición del punto
                const comunidad = comunidades[index];
                return `<strong>${comunidad}</strong><br/>
                        ${d.map(p => `${p.name}: ${p.value}`).join("<br/>")}`;
            }
            },
            point: {
            r: 5
            }
        });
        });


</script>
<div id="chart"></div>