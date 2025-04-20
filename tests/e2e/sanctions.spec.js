// @ts-check
import { test, expect,request as playwrightRequest  } from '@playwright/test';

//Pruebas DLC

test('has title', async ({ page }) => {
  await page.goto('localhost:16078/sanctions-and-points-stats');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Sanctions Manager/);
  console.log("Pasa el test 1")
});



test('create and delete sanction', async ({ page }) => {
  const testIneCode = "2";
  const testProvince = "Sevilla";
  const testAutonomousCommunity = "Andalucía";
  const testYear = "2024";
  const testTotalSanctions = "1";
  const testTotalPoints = "2";
  await page.goto('localhost:16078/sanctions-and-points-stats/');
  await page.getByRole('button', { name: 'Borrar datos' }).click();

  await page.getByRole('textbox').nth(6).fill(testIneCode);
  await page.getByRole('textbox').nth(7).fill(testProvince);
  await page.getByRole('textbox').nth(8).fill(testAutonomousCommunity);
  await page.getByRole('textbox').nth(9).fill(testYear);
  await page.getByRole('textbox').nth(10).fill(testTotalSanctions);
  await page.getByRole('textbox').nth(11).fill(testTotalPoints); 


  await page.getByRole('button', { name: 'Crear registro' }).click();

  
  const fullRowText = `${testIneCode} ${testProvince} ${testAutonomousCommunity} ${testYear} ${testTotalSanctions} ${testTotalPoints}`;
  const sanctionRow = page.getByRole('row', { name: fullRowText });
  await expect(sanctionRow).toContainText(testProvince);
  await expect(sanctionRow).toContainText(testAutonomousCommunity);
  await expect(sanctionRow).toContainText(testYear);
  await expect(sanctionRow).toContainText(testTotalSanctions);
  await expect(sanctionRow).toContainText(testTotalPoints);

  await sanctionRow.getByRole('button', { name: 'Borrar' },).click({ timeout: 60000 });
  await expect(page.getByRole('row', { name: fullRowText })).toHaveCount(0);

  const apiContext = await playwrightRequest.newContext({
    baseURL: 'http://localhost:16078'
  });

  const response = await apiContext.post(`/api/v1/sanctions-and-points-stats/reset`);
  expect(response.status()).toBe(200);
  console.log("Pasa el test 2")
});
/*
test ("edit a sanction record",async ({page})=>{

  await page.goto('http://localhost:16078/sanctions-and-points-stats/');
  
  //borrar y cargar
  await page.getByRole("button", {name:"Borrar datos"}).click();
  await page.getByRole("button", {name:"Datos de prueba"}).click();

  //editar
  await page.getByRole("button", {name: "Editar"}).nth(0).click();

  const inputs = page.locator("input");
  await inputs.nth(5).fill("99999");
  await page.getByRole("button", {name: "Actualizar"}).click();
  await expect(page).toHaveURL(/sanctions-and-points-stats/);
  await expect(page.locator("table")).toContainText("99999")
  console.log("Pasa el test 3")
});

test('edit a sanction record', async ({ page }) => {
  
  const testIneCode = "2";
  const testProvince = "Sevilla";
  const testAutonomousCommunity = "Andalucía";
  const testYear = "2024";
  const testTotalSanctions = "1";
  const testTotalPoints = "999";
  await page.goto('localhost:16078/sanctions-and-points-stats/');
  await page.getByRole('button', { name: 'Borrar datos' }).click();
  await page.getByRole('button', { name: 'Datos de prueba' }).click();
  await page.getByRole('button', { name: 'Editar' }).nth(0).click();
  await expect(page).toHaveTitle(/Edit Sanctions Info/);
  await page.getByRole('textbox').nth(1).fill(testProvince);
  await page.getByRole('textbox').nth(2).fill(testAutonomousCommunity);
  await page.getByRole('textbox').nth(4).fill(testTotalSanctions);
  await page.getByRole('textbox').nth(5).fill(testTotalPoints); 
  await page.getByRole('button', { name: 'Actualizar' }).click();

  // Verificamos que vuelve a la página principal y esperamos la URL
  await page.waitForURL(/sanctions-and-points-stats/);
  await expect(page).toHaveURL(/sanctions-and-points-stats/);
  
  const fullRowText = `${testIneCode} ${testProvince} ${testAutonomousCommunity} ${testYear} ${testTotalSanctions} ${testTotalPoints}`;
  const sanctionRow = page.getByRole('row', { name: fullRowText });
  await expect(sanctionRow).toContainText(testProvince);
  await expect(sanctionRow).toContainText(testAutonomousCommunity);
  await expect(sanctionRow).toContainText(testYear);
  await expect(sanctionRow).toContainText(testTotalSanctions);
  await expect(sanctionRow).toContainText(testTotalPoints);
  

  await expect(page.getByRole('row', { name: fullRowText })).toHaveCount(1);

  const apiContext = await playwrightRequest.newContext({
    baseURL: 'http://localhost:16078'
  });

  const response = await apiContext.post(`/api/v1/sanctions-and-points-stats/reset`);
  expect(response.status()).toBe(200);
  
  
  console.log("Paso el test 3");
});

await page.goto('http://localhost:16078/sanctions-and-points-stats/');

// Limpiar y cargar datos de prueba con esperas
await page.getByRole('button', { name: 'Borrar datos' }).click();
  // Verificar que no haya filas de datos (asumiendo que la primera fila es la cabecera)
  const rowCount = await page.locator('table tr:not(:first-child)').count();
  await expect(rowCount).toBe(0);
await page.getByRole('button', { name: 'Datos de prueba' }).click();
await page.waitForSelector('table tr', { state: 'visible' }); // Espera a que la tabla tenga filas
await expect(page.locator('table')).toContainText('Alicante/Alacant');

// Hacer clic en el botón Editar del primer registro
await page.getByRole('button', { name: 'Editar' }).nth(0).click();
await expect(page).toHaveTitle(/Edit Sanctions Info/);

// Seleccionamos el input por un selector más específico (si es posible)
const totalPointsInput = page.locator('input').nth(5); // Considera un selector mejor

// Cambiamos el campo 'total_points_deducted'
await totalPointsInput.fill('999');

// Clic en el botón "Actualizar"
await page.getByRole('button', { name: 'Actualizar' }).click();

// Verificamos que vuelve a la página principal y esperamos la URL
await page.waitForURL(/sanctions-and-points-stats/);
await expect(page).toHaveURL(/sanctions-and-points-stats/);

// Verificamos que la fila actualizada sea visible
const updatedRow = page.getByRole('row', { name: /999/ });
await updatedRow.waitFor({ state: 'visible' });
await expect(updatedRow).toBeVisible();

// Reseteamos los datos vía API con una espera para asegurar la finalización
const apiContext = await playwrightRequest.newContext({
  baseURL: 'http://localhost:16078'
});

const response = await apiContext.post(`/api/v1/sanctions-and-points-stats/reset`);
expect(response.status()).toBe(200);*/


