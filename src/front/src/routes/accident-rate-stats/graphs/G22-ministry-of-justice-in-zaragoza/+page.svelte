<svelte:head>
    <title></title>
    <script src="https://cdn.amcharts.com/lib/5/index.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/xy.js"></script>
    <script src="https://cdn.amcharts.com/lib/5/themes/Animated.js"></script>
</svelte:head>

<style>
  #chartdiv {
    width: 100%;
    height: 500px;
  }
</style>

<script>
  import { onMount } from 'svelte';
  import { dev } from "$app/environment";

  let DEVEL_HOST = "http://localhost:16078";
  let API = "/api/v1/accident-rate-stats/";

  if (dev) {
    API = DEVEL_HOST + API;
  }

  onMount(async () => {
    // Obtener datos de la primera API
    let response = await fetch(API);
    let apiData = await response.json();

    const communityMap = {};
    // @ts-ignore
    apiData.forEach(entry => {
      const province = entry.province;
      const hospitalized = Number(entry.injured_hospitalized) || 0;
      const notHospitalized = Number(entry.injured_not_hospitalized) || 0;
      const totalInjured = hospitalized + notHospitalized; // Sumar los dos tipos de heridos

      // @ts-ignore
      if (entry.province === "Zaragoza") {
        // @ts-ignore
        if (communityMap[province]) {
          // @ts-ignore
          communityMap[province] += totalInjured; // Sumar los heridos por provincia
        } else {
          // @ts-ignore
          communityMap[province] = totalInjured;
        }
      }
    });

    // Datos de heridos agrupados por provincia
    const data = Object.entries(communityMap).map(([province, injured]) => ({
      year: province,
      income: injured
    }));

    // Obtener datos de la segunda API
    const res2 = await fetch("https://sos2425-22.onrender.com/api/v2/ministry-of-justice-in-zaragoza/");
    const numWorkersData = await res2.json();

    const numWorkersGrouped = {};
    // @ts-ignore
    numWorkersData.forEach(item => {
      const province = item.province;
      const numWorkers = Number(item.num_workers) || 0;

      // Si la provincia ya tiene trabajadores, sumamos
      // @ts-ignore
      if (numWorkersGrouped[province]) {
        // @ts-ignore
        numWorkersGrouped[province] += numWorkers;
      } else {
        // @ts-ignore
        numWorkersGrouped[province] = numWorkers;
      }
    });

    // Fusionar num_workers con los datos existentes
    data.forEach(item => {
      // Asegurarse de que siempre agreguemos el valor de num_workers, si existe
      // @ts-ignore
      item.num_workers = numWorkersGrouped[item.year] || 0;
    });

    // Generar el gráfico
    // @ts-ignore
    am5.ready(function() {
      // @ts-ignore
      var root = am5.Root.new("chartdiv");

      // @ts-ignore
      root.setThemes([am5themes_Animated.new(root)]);

      var chart = root.container.children.push(
        // @ts-ignore
        am5xy.XYChart.new(root, {
          panX: false,
          panY: false,
          wheelX: "panX",
          wheelY: "zoomX",
          paddingLeft: 0,
          layout: root.verticalLayout
        })
      );

      var yAxis = chart.yAxes.push(
        // @ts-ignore
        am5xy.CategoryAxis.new(root, {
          categoryField: "year",
          // @ts-ignore
          renderer: am5xy.AxisRendererY.new(root, {
            inversed: true,
            cellStartLocation: 0.1,
            cellEndLocation: 0.9,
            minorGridEnabled: true,
            minGridDistance: 1
          })
        })
      );

      yAxis.data.setAll(data);

      var xAxis = chart.xAxes.push(
        // @ts-ignore
        am5xy.ValueAxis.new(root, {
          // @ts-ignore
          renderer: am5xy.AxisRendererX.new(root, {
            strokeOpacity: 0.1,
            minGridDistance: 50
          }),
          min: 0
        })
      );

      // Crear series para las gráficas
      // @ts-ignore
      function createSeries(field, name) {
        var series = chart.series.push(
          // @ts-ignore
          am5xy.ColumnSeries.new(root, {
            name: name,
            xAxis: xAxis,
            yAxis: yAxis,
            valueXField: field,
            categoryYField: "year",
            sequencedInterpolation: true,
            // @ts-ignore
            tooltip: am5.Tooltip.new(root, {
              pointerOrientation: "horizontal",
              labelText: "[bold]{name}[/]\n{categoryY}: {valueX}"
            })
          })
        );

        series.columns.template.setAll({
          // @ts-ignore
          height: am5.p100,
          strokeOpacity: 0
        });

        series.bullets.push(function () {
          // @ts-ignore
          return am5.Bullet.new(root, {
            locationX: 1,
            locationY: 0.5,
            // @ts-ignore
            sprite: am5.Label.new(root, {
              // @ts-ignore
              centerY: am5.p50,
              text: "{valueX}",
              populateText: true
            })
          });
        });

        series.bullets.push(function () {
          // @ts-ignore
          return am5.Bullet.new(root, {
            locationX: 1,
            locationY: 0.5,
            // @ts-ignore
            sprite: am5.Label.new(root, {
              // @ts-ignore
              centerX: am5.p100,
              // @ts-ignore
              centerY: am5.p50,
              text: "{name}",
              // @ts-ignore
              fill: am5.color(0xffffff),
              populateText: true
            })
          });
        });

        series.data.setAll(data);
        series.appear();

        return series;
      }

      // Añadir series al gráfico
      createSeries("income", "Heridos Totales");
      createSeries("num_workers", "Trabajadores");

      var legend = chart.children.push(
        // @ts-ignore
        am5.Legend.new(root, {
          // @ts-ignore
          centerX: am5.p50,
          // @ts-ignore
          x: am5.p50
        })
      );

      legend.data.setAll(chart.series.values);

      // Configuración del cursor
      // @ts-ignore
      var cursor = chart.set("cursor", am5xy.XYCursor.new(root, {
        behavior: "zoomY"
      }));
      cursor.lineY.set("forceHidden", true);
      cursor.lineX.set("forceHidden", true);

      chart.appear(1000, 100);
    });
  });
</script>

<div id="chartdiv"></div>
