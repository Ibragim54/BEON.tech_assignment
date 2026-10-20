import { defineConfig } from "cypress";
import dotenv from "dotenv";
import { plugin as cypressGrepPlugin } from "@cypress/grep/plugin";

dotenv.config(); //loads .env into process.env

export default defineConfig({
  defaultCommandTimeout: 6000,

  expose: {
    restfulBookerUrl: "https://restful-booker.herokuapp.com",
    saucedemoUrl: "https://www.saucedemo.com/",
  },
  retries: {
    runMode: 1,
  },
  reporter: "cypress-mochawesome-reporter",
  reporterOptions: {
    reportDir: "cypress/reports",
    reportFilename: "[datetime]-report",
    overwrite: true,
    html: true,
    json: false,
  },
  e2e: {
    setupNodeEvents(on, config) {
      require("cypress-mochawesome-reporter/plugin")(on);
      cypressGrepPlugin(config);

      // Public values that come from .env -> read with Cypress.expose()
      config.expose = {
        ...config.expose,
        restfulBookerUrl:
          process.env.RESTFUL_BOOKER_URL ?? config.expose.restfulBookerUrl,
      };

      // Sensitive values -> read with cy.env([...]) only
      config.env = {
        ...config.env,
        restfulBookerUsername: process.env.RESTFUL_BOOKER_USERNAME,
        restfulBookerPassword: process.env.RESTFUL_BOOKER_PASSWORD,
        saucedemoUsername: process.env.SAUCEDEMO_USERNAME,
        saucedemoPassword: process.env.SAUCEDEMO_PASSWORD,
      };
      return config;
    },
  },
});
