// @ts-check
import { test, expect,request as playwrightRequest  } from '@playwright/test';

//Pruebas DLC

test('has title', async ({ page,request }) => {
  await page.goto('localhost:16078/sanctions-and-points-stats');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Sanctions Manager/);
});



test('create and delete sanction', async ({ page }) => {
  const testIneCode = "2";
  const testProvince = "Sevilla";
  const testAutonomousCommunity = "Andalucía";
  const testYear = "2024";
  const testTotalSanctions = "1";
  const testTotalPoints = "2";
  console.log(testProvince)
  await page.goto('localhost:16078/sanctions-and-points-stats');
  await page.getByRole('button', { name: 'Borrar datos' }).click();

  await page.getByRole('textbox').nth(6).fill(testIneCode);
  await page.getByRole('textbox').nth(7).fill(testProvince);
  await page.getByRole('textbox').nth(8).fill(testAutonomousCommunity);
  await page.getByRole('textbox').nth(9).fill(testYear);
  await page.getByRole('textbox').nth(10).fill(testTotalSanctions);
  await page.getByRole('textbox').nth(11).fill(testTotalPoints); 

  console.log(testProvince)

  await page.getByRole('button', { name: 'Crear registro' }).click();

  
  const fullRowText = `${testIneCode} ${testProvince} ${testAutonomousCommunity} ${testYear} ${testTotalSanctions} ${testTotalPoints}`;
  const sanctionRow = page.getByRole('row', { name: fullRowText });
  console.log(sanctionRow);
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
});


/*test('edit a sanction record', async ({ page }) => {
  await page.goto('http://localhost:16078/sanctions-and-points-stats/');

  // Limpiar y cargar datos de prueba
  await page.getByRole('button', { name: 'Borrar datos' }).click();
  await page.getByRole('button', { name: 'Datos de prueba' }).click();

  // Hacer clic en el botón Editar del primer registro
  await page.getByRole('button', { name: 'Editar' }).nth(0).click();

  await expect(page).toHaveTitle(/Edit Sanctions Info/);

  // Seleccionamos los inputs por su orden en el DOM
  const inputs = page.locator('input');

  // Cambiamos el campo 'total_points_deducted' (sexto input)
  await inputs.nth(5).fill('999');

  // Clic en el botón "Actualizar"
  await page.getByRole('button', { name: 'Actualizar' }).click();

  // Verificamos que vuelve a la página principal
  await expect(page).toHaveURL(/sanctions-and-points-stats/);

  // Comprobamos que el cambio se refleja (opcionalmente podrías buscar por texto en la tabla)
  await expect(page.locator('table')).toContainText('999');
});


*/