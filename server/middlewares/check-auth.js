const { StorefrontClient } = require("../utils");

/**
 *
 * @param {{sfClient: StorefrontClient}}
 */
module.exports.getCheckAuth =
  ({ sfClient }) =>
  async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).send("Not logged in");
    
    const customer = await sfClient.getCustomer(token);
    console.log(customer);

    if (!customer) return res.status(401).send("Not logged in");
    req.user = customer;
    next();
  };
