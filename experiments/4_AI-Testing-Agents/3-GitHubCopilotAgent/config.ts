export const config = {
  baseUrl: "https://www.saucedemo.com/v1/",
  model: "gpt-4.1",
  testInstructions: `
    Test login procedure.
    Login with valid credentials (standard_user / secret_sauce).
    Verify successful login by checking the products page is displayed.
  `,

  // // 2. Purchase test
  // testInstructions: `
  //   Test purchasing process.
  //   Login with standard_user / secret_sauce.
  //   Add "Sauce Labs Bike Light" to cart.
  //   Go to cart and proceed to checkout.
  //   Fill checkout info and complete the purchase.
  //   Verify order confirmation is displayed.
  // `,

  // // 3. Problem user test
  // testInstructions: `
  //   Test login with problem_user / secret_sauce.
  //   Try to add items to cart and observe any issues.
  //   Report all bugs found.
  // `,
};
