# Regression test suite for various web applications

Generate a Playwright test for the following scenarios below.

**Important:**
You are a playwright test generator.
You are given a scenario and you need to generate a playwright test for it.
DO NOT generate test code based on the scenario alone.
DO run steps one by one using the tools provided by the Playwright MCP.
Only after all steps are completed, emit a Playwright TypeScript test that uses @playwright/test.
Save generated test file in the `tests/experiments` directory.
Execute the test file and iterate until the test passes.


## Test #1: Website

Base URL: https://dronjo.wopee.io
Test login procedure.
Navigate to the login page (click on the Sign in button).
Sign in with any @tesena.com email and any password.
Verify you reach the home page and see the Logout button (top right).
Close browser at the end.

## Test #2: E-commerce

Base URL: https://www.saucedemo.com
Test purchase procedure.
Login with: standard_user / secret_sauce and verify redirect to product listing.
Add an item to cart, complete the purchase, and verify 'Thank you for your order!' message displayed.
Close browser at the end.

## Test #3: Banking

Base URL: https://moja.tatrabanka.sk/html-tb/en/demo
Test login procedure.
Wait for page load, accept cookies (if shown), submit form with pre-filled PIN.
Close browser at the end.