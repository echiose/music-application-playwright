const {
  test,
  describe,
  beforeEach,
  afterEach,
  beforeAll,
  afterAll,
  expect,
} = require("@playwright/test");
const { chromium } = require("playwright");

const host = "http://localhost:3000";

let browser;
let context;
let page;

let user = {
  email: "",
  password: "123456",
  confirmPass: "123456",
};

let albumName = "";

describe("e2e tests", () => {
  beforeAll(async () => {
    browser = await chromium.launch();
  });

  afterAll(async () => {
    await browser.close();
  });

  beforeEach(async () => {
    context = await browser.newContext();
    page = await context.newPage();
  });

  afterEach(async () => {
    await page.close();
    await context.close();
  });

  describe("authentication", () => {
    test("register user with Valid Data", async () => {
      user.email = `user-${Date.now()}@mail.com`;

      await page.goto(host);
      await page.getByRole("link", { name: "Register" }).click();

      // await expect(page.locator('#registerPage form')).toBeVisible();

      // await page.locator('#email').fill(user.email);
      await page.fill("input[name='email']", `user-${Date.now()}@mail.com`);
      // await page.locator('#password').fill(user.password);
      await page.fill("input[name='password']", user.password);
      // await page.locator('#conf-pass').fill(user.confirmPass);
      await page.fill("input[name='conf-pass']", user.confirmPass);
      // await page.locator('button.register').click();
      await page.click("button[type='submit']");

      await page.waitForNavigation();
      // await page.waitForURL(`${host}/`);
      await expect(page.url()).toBe(`${host}/`);
      await expect(page.getByRole("link", { name: "Logout" })).toBeVisible();
    });

    test("login with Valid Data", async () => {
      user.email = `user-${Date.now()}@mail.com`;

      await page.goto(host);
      await page.getByRole("link", { name: "Login" }).click();


      await page.fill("input[name='email']", `eri@test.com`);
      await page.fill("input[name='password']", 'eri123');

      // await page.locator('button.register').click();
      await page.click("button[type='submit']");

      await page.waitForNavigation();
      // await page.waitForURL(`${host}/`);
      await expect(page.url()).toBe(`${host}/`);
      await expect(page.getByRole("heading", { name: "Welcome to" })).toHaveText("Welcome to");
      await expect(page.getByRole("heading", { name: "My Music Application!" })).toHaveText("My Music Application!");
    });

test("logout user", async () => {
      user.email = `user-${Date.now()}@mail.com`;

      await page.goto(host);
      await page.getByRole("link", { name: "Login" }).click();


      await page.fill("input[name='email']", `eri@test.com`);
      await page.fill("input[name='password']", 'eri123');

      // await page.locator('button.register').click();
      await page.click("button[type='submit']");
      await page.click("a[href='/logout']");

      await page.waitForNavigation();
      // await page.waitForURL(`${host}/`);
      await expect(page.url()).toBe(`${host}/`);
      await expect(page.getByRole("heading", { name: "Welcome to" })).toHaveText("Welcome to");
      await expect(page.getByRole("heading", { name: "My Music Application!" })).toHaveText("My Music Application!");
    });

  });

  describe("navbar", () => {
    test ("")
  });

  describe("CRUD", () => {});
});
