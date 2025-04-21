<svelte:head>
    <title> Edit Sanctions Info</title>
</svelte:head>
<script>
    //@ts-nocheck
    import { onMount } from "svelte";
    import { dev } from "$app/environment";
    import { Table, Button } from "@sveltestrap/sveltestrap";
    import { page } from "$app/stores";
    import { get } from "svelte/store";
    import { goto } from '$app/navigation';
	import { title } from "process";


    let DEVEL_HOST = "http://localhost:16078";
    let API = "/api/v1/sanctions-and-points-stats/";
    if (dev) {
        API = DEVEL_HOST + API;
    }

    let sanctionsData = [];
    let result = "";
    let resultStatus = "";

    // Variables para editar
    let editIneCode = "";
    let editProvince = "";
    let editAutonomousCommunity = "";
    let editYear = "";
    let editTotalSanctions = "";
    let editTotalPoints = "";

    async function getSanction() {
        resultStatus = result = "";

        const $page = get(page);
        let ineCode = $page.params.ine_code;
        let year = $page.params.year;

        try {
            const res = await fetch(`${API}${ineCode}/${year}`, { method: "GET" });
            const data = await res.json();

            sanctionsData = [data]; // aseguramos que sea array
            const s = sanctionsData[0];

            // Rellenar inputs con valores del recurso
            editIneCode = s.ine_code;
            editProvince = s.province;
            editAutonomousCommunity = s.autonomous_community;
            editYear = s.year;
            editTotalSanctions = s.total_sanctions_with_points;
            editTotalPoints = s.total_points_deducted;

        } catch (error) {
            console.log(`ERROR: GET data from ${API}: ${error}`);
        }
    }

    
    async function updateSanction(sanction) {
        const url = `${API}${sanction.ine_code}/${sanction.year}`;
        try {
            const res = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(sanction)
            });

            status = await res.status
            if (status ==200) {
                console.log("Sanction updated successfully");
                console.log("Dato actualizado correctamente")
                goto("/sanctions-and-points-stats"); // recarga el dato actualizado
            } else {
                console.error("Failed to update sanction", res.status);
            }
        } catch (error) {
            console.error("Error updating sanction", error);
        }
    }

    function updateSanctionFromInputs() {
        const updatedSanction = {
            "ine_code": Number(editIneCode),
            "province": editProvince,
            "autonomous_community": editAutonomousCommunity,
            "year": Number(editYear),
            "total_sanctions_with_points": Number(editTotalSanctions),
            "total_points_deducted": Number(editTotalPoints)
        };

        updateSanction(updatedSanction);
    }

    onMount(() => {
        getSanction();
    });
</script>

<Table>
    <thead>
        <tr>
            <th>ine_code</th>
            <th>province</th>
            <th>autonomous_community</th>
            <th>year</th>
            <th>total_sanctions_with_points</th>
            <th>total_points_deducted</th>
            <th>Acciones</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><input bind:value={editIneCode} disabled></td>
            <td><input bind:value={editProvince}></td>
            <td><input bind:value={editAutonomousCommunity}></td>
            <td><input bind:value={editYear} disabled></td>
            <td><input bind:value={editTotalSanctions}></td>
            <td><input bind:value={editTotalPoints}></td>
            <td>
                <Button color="warning" on:click={updateSanctionFromInputs}>Actualizar</Button>
            </td>
        </tr>
    </tbody>
</Table>
