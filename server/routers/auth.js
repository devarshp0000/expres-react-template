const express = require("express");

const { StorefrontClient } = require("../utils");

/**
 *
 * @param {{sfClient: StorefrontClient}}
 */
module.exports.getAuthRouter = function ({ sfClient }) {
  const router = express.Router();

  router.post("/login", async (req, res) => {
    if (req.cookies.token)
      return res.status(400).send({
        message: "Already logged in",
      });
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send({
        message: "Missing email or password",
      });
    }

    try {
      const { accessToken: token, expiresAt } = await sfClient.login(
        email,
        password
      );

      if (!token) {
        return res.status(401).send({
          message: "Invalid credentials",
        });
      }
      res.cookie("token", token, {
        httpOnly: true,
        sameSite: true,
        expires: new Date(expiresAt),
      });
    } catch (error) {
      console.log(error);
    }

    res.send();
  });

  router.post("/logout", async (req, res) => {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).send({
        message: "Not logged in",
      });
    }
    try {
      await sfClient.logout(token);
    } catch (error) {
      console.log(error);
    }
    res.clearCookie("token");
    res.send();
  });

  router.get("/", async (req, res) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).send("Not logged in");

    const customer = await sfClient.getCustomer(token);

    if (!customer) return res.status(401).send("Not logged in");

    // delete customer.id;
    res.send(customer);
  });
  return router;
};
