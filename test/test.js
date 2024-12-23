const request = require("supertest");
const app = require("../app.js");
const constant = require("../src/services/constant.js");

describe("GET /sms-api/test/services", () => {
    it("respond with Server is running", (done) => {
        request(app).get("/sms-api/test/services/").expect(constant.SUCCESS_MESSAGES.TEST_CALLED, done);
      })
  });