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
let album = {
  imgUrl:
    "https://d1csarkz8obe9u.cloudfront.net/posterpreviews/record-on-fire-album-cover-design-template-356b3587da37e244ddb52f863d4cf05d_screen.jpg?ts=1687538584",
  price: "12.99",
  releaseDate: "12.05.2026",
  artist: "random artist",
  genre: "rock",
  description: "this is random generated album for auto test",
};

describe("e2e tests", () => {
  beforeAll(async () => {
    user.email = `user-${Date.now()}@mail.com`;
    albumName = `Test Album-${Date.now()}`;
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
      await page.goto(host);
      await page.getByRole("link", { name: "Register" }).click();

      // await expect(page.locator('#registerPage form')).toBeVisible();

      // await page.locator('#email').fill(user.email);
      await page.fill("input[name='email']", user.email);
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
      await page.goto(host);
      await page.getByRole("link", { name: "Login" }).click();

      await page.fill("input[name='email']", user.email);
      await page.fill("input[name='password']", user.password);

      // await page.locator('button.register').click();
      await page.click("button[type='submit']");

      await page.waitForNavigation();
      // await page.waitForURL(`${host}/`);
      await expect(page.url()).toBe(`${host}/`);
      await expect(
        page.getByRole("heading", { name: "Welcome to" }),
      ).toHaveText("Welcome to");
      await expect(
        page.getByRole("heading", { name: "My Music Application!" }),
      ).toHaveText("My Music Application!");
    });

    test("logout user", async () => {
      await page.goto(host);
      await page.getByRole("link", { name: "Login" }).click();

      await page.fill("input[name='email']", user.email);
      await page.fill("input[name='password']", user.password);

      // await page.locator('button.register').click();
      await page.click("button[type='submit']");
      await page.click("a[href='/logout']");

      await page.waitForNavigation();
      // await page.waitForURL(`${host}/`);
      await expect(page.url()).toBe(`${host}/`);
      await expect(
        page.getByRole("heading", { name: "Welcome to" }),
      ).toHaveText("Welcome to");
      await expect(
        page.getByRole("heading", { name: "My Music Application!" }),
      ).toHaveText("My Music Application!");
    });
  });

  describe("navbar", () => {
    test("Navigation for logged-in user", async () => {
      //login user
      await page.goto(host);
      await page.getByRole("link", { name: "Login" }).click();
      await page.waitForSelector("form");

      await expect(page).toHaveURL(`${host}/login`);

      await page.fill("input[name='email']", user.email);
      await page.fill("input[name='password']", user.password);
      await page.click("button[type='submit']");
      //verify navbar
      await expect(page).toHaveURL(`${host}/`);
      await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Catalog" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Search" })).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Create Album" }),
      ).toBeVisible();
      await expect(page.getByRole("link", { name: "Logout" })).toBeVisible();

      await expect(page.getByRole("link", { name: "Login" })).toBeHidden();
      await expect(page.getByRole("link", { name: "Register" })).toBeHidden();
    });

    test("Navigation for guest user", async () => {
      //go to hosh page
      await page.goto(host);
      await expect(page).toHaveURL(`${host}/`);
      //check the nav bar
      await expect(page.getByRole("link", { name: "Home" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Catalog" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Search" })).toBeVisible();
      await expect(
        page.getByRole("link", { name: "Create Album" }),
      ).toBeHidden();
      await expect(page.getByRole("link", { name: "Logout" })).toBeHidden();

      await expect(page.getByRole("link", { name: "Login" })).toBeVisible();
      await expect(page.getByRole("link", { name: "Register" })).toBeVisible();
    });
  });
  describe("CRUD", () => {
    beforeEach(async () => {
      //login user
      await page.goto(host);
      await page.getByRole("link", { name: "Login" }).click();
      await page.waitForSelector("form");
      await page.fill("input[name='email']", user.email);
      await page.fill("input[name='password']", user.password);
      await page.click("button[type='submit']");
    });

    test("Create an album", async () => {
      await page.click("text=Create Album");
      await page.waitForSelector("form");

      await page.fill("[name=name]", albumName);
      await page.fill("[name=imgUrl]", album.imgUrl);
      await page.fill("[name=price]", album.price);
      await page.fill("[name=releaseDate]", album.releaseDate);
      await page.fill("[name=artist]", album.artist);
      await page.fill("[name=genre]", album.genre);
      await page.fill("[name=description]", album.description);
      await page.click("button[type='submit']");

      await expect(page).toHaveURL(`${host}/catalog`);
      await expect(
        page.locator("#catalogPage >> text=" + albumName),
      ).toBeVisible();
    });

    test("Edit an album", async () => {
      let editedAlbumName = albumName + "edited";
      await page.getByRole("link", { name: "Search" }).click();
      await page.waitForSelector("#searchPage");

      await page.fill("#search-input", albumName);
      await page.locator(".button-list").click();

      await page.waitForSelector(".search-result .card-box");
      await page
        .locator(".search-result .card-box")
        .filter({ hasText: albumName })
        .getByRole("link", { name: "Details" })
        .click();

      await page.waitForURL(/\/details\//);
      await page.getByRole("link", { name: "Edit" }).click();
      await page.waitForSelector(".editPage form");

      await page.fill("[name=name]", editedAlbumName);
      await page.fill("[name=description]", "this album was edited");

      await page.click("button.edit-album[type='submit']");

      await page.waitForURL(/\/details\//);
      await expect(page.locator("#detailsPage h1")).toContainText(
        editedAlbumName,
      );
    });
    test("delete an album", async () => {
      let deletedAlbumName = albumName + "edited";
      await page.getByRole("link", { name: "Search" }).click();
      await page.waitForSelector("#searchPage");

      await page.fill("#search-input", deletedAlbumName);
      await page.locator(".button-list").click();

      await page.waitForSelector(".search-result .card-box");
      await page
        .locator(".search-result .card-box")
        .filter({ hasText: deletedAlbumName })
        .getByRole("link", { name: "Details" })
        .click();

      await page.waitForURL(/\/details\//);
      await page.getByRole("link", { name: "Delete" }).click();

      await expect(page).toHaveURL(`${host}/catalog`);
      //assert the book is not in the list
      await expect(
        page.locator("#collectionPage >> text=" + deletedAlbumName),
      ).toBeHidden();
    });
  });
});
