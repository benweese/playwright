const { test, expect } = require("@playwright/test");
import { LoginPage } from "../../pages/login";
require("dotenv").config();

const baseUrl = "https://reqres.in/api";
let token;

test("test", async ({ page }) => {
  const Login = new LoginPage(page);

  await Login.goToLoginPage();
  await Login.login("tomsmith", process.env.S_PASS);
});

test.describe.parallel("API Testing", () => {
  test("Simple API test - assert response status", async ({ request }) => {
    const response = await request.get(baseUrl + "/users/1");
    expect(response.status()).toBe(200);

    const responseBody = JSON.parse(await response.text());
    console.log(responseBody);
    expect(responseBody.data.id).toBe(1);
    expect(responseBody.data.first_name).toBe("George");
    expect(responseBody.data.last_name).toBe("Bluth");
  });

  test("Simple API test - assert invalid endpoint", async ({ request }) => {
    const response = await request.get(baseUrl + "/users/invalid");
    expect(response.status()).toBe(404);
  });

  test("POST Request - Login", async ({ request }) => {
    const response = await request.post(baseUrl + "login", {
      data: {
        email: "eve.holt@reqres.in",
        password: "cityslicka",
      },
    });
    const responseBody = JSON.parse(await response.text());
    expect(response.status()).toBe(200);
    expect(responseBody.token).toBeTruthy();
    token = responseBody.token;
  });
});
