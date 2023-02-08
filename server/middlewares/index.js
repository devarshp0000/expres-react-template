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

const { getCheckAuth } = require("./check-auth");

module.exports = {
  checkAuth: getCheckAuth({ sfClient }),
};
