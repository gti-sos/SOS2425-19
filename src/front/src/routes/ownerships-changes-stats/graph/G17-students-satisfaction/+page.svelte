<svelte:head>
    <script src="https://cdn.jsdelivr.net/npm/apexcharts"></script>
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
        let llamada_anterior= await fetch("https://sos2425-17.onrender.com/api/v2/students_satisfaction/loadInitialData");
        let api1 = await fetch(API);
        let exChangesData = await api1.json();
    
        //datos api externa
        
        const api2 = await fetch("https://sos2425-17.onrender.com/api/v2/students_satisfaction/");

        const studentsData = await api2.json();

        let totalSatisfaction = 0;
        let satisfactionCount = 0;

      studentsData.forEach(entry => {
        totalSatisfaction += entry.satisfaccion_total || 0;
        satisfactionCount += 1;
      });

      const averageSatisfaction = totalSatisfaction / satisfactionCount;


      // Total de vehículos por comunidad
      let motoTotal=0;
      let contadorMoto=0;
      exChangesData.forEach(entry => {
        motoTotal= entry.motocycle || 0;
        contadorMoto +=1;
      });
      const averageMoto = motoTotal / contadorMoto;

      console.log(averageMoto);
      console.log(averageSatisfaction);
      // Crear arrays para el gráfico
    
      

      // Configuración del gráfico
      const options = {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false
          },
        },
        series: [{
            name: 'Medias',
            data: [averageSatisfaction.toFixed(4), averageMoto.toFixed(4)]
            }],
        xaxis: {
          categories: ['Media Satisfacción', 'Media Vehículos']
        },
        yaxis: {
          title: {
            text: 'Valores'
          }
        },
        legend: {
          position: 'top'
        }
      };

      const chart = new ApexCharts(document.querySelector("#chart"), options);
      chart.render();
    });
</script>
<div id="chart"></div>