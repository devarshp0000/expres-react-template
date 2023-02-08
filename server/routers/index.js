const { StorefrontClient } = require("../utils");
const config = require("../config");

const options = {
  domain: `${config.storeCredentials.name}.myshopify.com`,
  storefrontAccessToken: config.storeCredentials.storeFrontAccessToken,
};

const sfClient = new StorefrontClient(
  options.domain,
  options.storefrontAccessToken
);

const { getAuthRouter } = require("./auth");
const { getCartRouter } = require("./cart");

module.exports = {
  authRouter: getAuthRouter({ sfClient }),
  cartRouter: getCartRouter({ sfClient }),
};
