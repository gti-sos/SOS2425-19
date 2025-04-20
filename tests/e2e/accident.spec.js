// @ts-check
import { test, expect, request as playwrightRequest } from '@playwright/test';

// Pruebas para Accidentes

test('has title', async ({ page,request }) => {
  await page.goto('http://localhost:16078/accident-rate-stats'); // Aumenta el timeout al cargar la página

  // Verificar que el título de la página contiene "Accident Rate Stats Manager"
  await expect(page).toHaveTitle(/Accident Rate Stats Manager/);  // Aumenta el timeout para la comprobación del título
});

test('create and delete accident', async ({ page }) => {
  const testIneCode = "1001";
  const testMunicipality = "Alegría-Dulantzi";
  const testProvince = "Araba/Álava";
  const testCCAA = "País Vasco";
  const testYear = "2022";
  const testDeceased = "1";
  const testInjuredHospitalized = "1";
  const testInjuredNotHospitalized = "1";

  await page.goto('http://localhost:16078/accident-rate-stats/');
  await page.getByRole('button', { name: 'Borrar todos los datos' }).click();
  // Llenar los campos con los datos de prueba
  await page.locator('input').nth(9).fill(testIneCode);
  await page.locator('input').nth(10).fill(testMunicipality);
  await page.locator('input').nth(11).fill(testProvince);
  await page.locator('input').nth(12).fill(testCCAA);
  await page.locator('input').nth(13).fill(testYear);
  await page.locator('input').nth(14).fill(testDeceased);
  await page.locator('input').nth(15).fill(testInjuredHospitalized);
  await page.locator('input').nth(16).fill(testInjuredNotHospitalized);

  // Crear el nuevo registro de accidente
  await page.getByRole('button', { name: 'Crear registro' }).click();

  // Esperar a que la tabla se actualice
  //const table = page.locator('table');
  //await table.waitFor({ state: 'visible', timeout: 60000 });

  // Verificar que el registro ha sido creado y está en la tabla
  const fullRowText = `${testIneCode} ${testMunicipality} ${testProvince} ${testCCAA} ${testYear} ${testDeceased} ${testInjuredHospitalized} ${testInjuredNotHospitalized} Editar`;
  const accidentRow = page.getByRole('row', { name: fullRowText });

  // Asegurarse de que la fila con el texto completo está presente
  //await expect(accidentRow).toBeVisible({ timeout: 60000 });
  await expect(accidentRow).toContainText(testMunicipality);
  await expect(accidentRow).toContainText(testProvince);
  await expect(accidentRow).toContainText(testCCAA);
  await expect(accidentRow).toContainText(testYear);
  await expect(accidentRow).toContainText(testDeceased);
  await expect(accidentRow).toContainText(testInjuredHospitalized);
  await expect(accidentRow).toContainText(testInjuredNotHospitalized);
  
  // Borrar el registro recién creado
  await accidentRow.getByRole('button', { name: 'Borrar' }).click({ timeout: 60000 });

  // Verificar que el registro ha sido eliminado
  await expect(page.getByRole('row', { name: fullRowText })).toHaveCount(0);

  const apiContext = await playwrightRequest.newContext({
    baseURL: 'http://localhost:16078'
  });

  const response = await apiContext.post(`/api/v1/accident-rate-stats/reset`);
  expect(response.status()).toBe(200);
});


