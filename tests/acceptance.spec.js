const { test, expect } = require('./fixture');

const button = (page, name) => page.getByRole('button', { name, exact: true });
const choice = (page, name) => page.getByRole('radio', { name: new RegExp(name) });
const frequency = page => page.getByRole('combobox', { name: 'Delivery frequency' });
const blend = page => page.getByLabel('Blend');
const read = async page => JSON.parse(await page.locator('#payload').innerText()).items[0];
async function submit(page) {
  await button(page, 'Add to cart').click();
  return read(page);
}
async function subscribe(page) {
  await choice(page, 'Subscription').check();
  await frequency(page).selectOption('8108');
}
test.beforeEach(async ({ page }) => { await page.goto('./?v=b'); });

test('01 Control and B submit identical selections', async ({ page }) => {
  await button(page, 'Control').click();
  await subscribe(page);
  await blend(page).selectOption('4102');
  await page.getByLabel('Quantity').fill('3');
  const control = await submit(page);
  await button(page, 'Variation B').click();
  expect(await submit(page)).toEqual(control);
  expect(control).toEqual({ id: 4102, quantity: 3, selling_plan: 8108 });
});
test('02 One-time submits quantity without a plan', async ({ page }) => {
  await page.getByLabel('Quantity').fill('2');
  expect(await submit(page)).toEqual({ id: 4101, quantity: 2 });
});
test('03 Frequency updates submitted plan', async ({ page }) => {
  await choice(page, 'Subscription').check();
  expect((await submit(page)).selling_plan).toBe(8104);
  await frequency(page).selectOption('8108');
  expect((await submit(page)).selling_plan).toBe(8108);
});
test('04 Variant switch preserves a valid plan', async ({ page }) => {
  await subscribe(page);
  await blend(page).selectOption('4102');
  expect(await submit(page)).toEqual({ id: 4102, quantity: 1, selling_plan: 8108 });
});
test('05 Returning to one-time clears stale plan', async ({ page }) => {
  await subscribe(page);
  await choice(page, 'One-time').check();
  expect(await submit(page)).toEqual({ id: 4101, quantity: 1 });
});
test('06 Double init mounts once and submits once', async ({ page }) => {
  await button(page, 'Run init twice').click();
  await expect(page.locator('.foldleaf-options')).toHaveCount(1);
  await submit(page);
  await expect(page.locator('#status')).toHaveText(/Request 1$/);
});
test('07 App replacement attaches once to the current form', async ({ page }) => {
  await button(page, 'Simulate app re-render').click();
  await expect(page.locator('.foldleaf-options')).toHaveCount(1);
  await subscribe(page);
  expect((await submit(page)).selling_plan).toBe(8108);
  await expect(page.locator('#status')).toHaveText(/Request 1$/);
});
test('08 Disable restores native form and detached controls are inert', async ({ page }) => {
  const old = await page.locator('.foldleaf-options input[value=subscription]').elementHandle();
  await button(page, 'Disable variation').click();
  await old.evaluate(input => { input.checked = true; input.dispatchEvent(new Event('change', { bubbles: true })); });
  await button(page, 'Simulate app re-render').click();
  await expect(page.locator('.foldleaf-options')).toHaveCount(0);
  expect(await submit(page)).toEqual({ id: 4101, quantity: 1 });
  await expect(page.locator('#status')).toHaveText(/Request 1$/);
});
test('09 Keyboard purchase, frequency and submission fit viewport', async ({ page }) => {
  await choice(page, 'One-time').focus();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  await expect(frequency(page)).toBeFocused();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Tab');
  await expect(button(page, 'Add to cart')).toBeFocused();
  await page.keyboard.press('Enter');
  expect((await read(page)).selling_plan).toBe(8108);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
