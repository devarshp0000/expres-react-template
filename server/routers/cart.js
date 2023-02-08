const express = require("express");

const config = require("../config");
const { StorefrontClient } = require("../utils");

/**
 *
 * @param {{sfClient: StorefrontClient}}
 */
module.exports.getCartRouter = ({ sfClient }) => {
  const router = express.Router();

  /**
   * @description - Create a new empty cart
   */
  router.post("/", async (req, res) => {
    if (!req.user?.email) return res.status(401).send("Not logged in");
    try {
      res.send(
        await sfClient.createEmptyCart(req.user.email, req.cookies.token)
      );
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong.");
    }
  });
  /**
   * @description - Get cart using id
   */
  router.get("/:id", async (req, res) => {
    const { id } = req.params;
    const { numLineItems, cursor } = req.query;
    if (!id) return res.status(400).send("Please provide cartId");

    try {
      const cartId = `${config.cartIdPreFix}${id}`;
      res.send(await sfClient.getCart(cartId, numLineItems, cursor));
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong.");
    }
  });
  /**
   * @description - Add new item in a cart
   */
  router.post("/:cartId/items", async (req, res) => {
    let { cartId } = req.params;

    const { item } = req.body;

    try {
      cartId = `${config.cartIdPreFix}${cartId}`;
      await sfClient.addItemsInCart(cartId, item);
      res.send();
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong.");
    }
  });
  /**
   *  @description - Update an item in a cart
   */
  router.put("/:cartId/items/:itemId", async (req, res) => {
    let { cartId, itemId } = req.params;

    const { item } = req.body;
    try {
      itemId = `${config.cartItemIdPreFix}${itemId}?cart=${cartId}`;
      cartId = `${config.cartIdPreFix}${cartId}`;
      const items = [
        {
          id: itemId,
          ...item,
        },
      ];
      await sfClient.updateItemsInCart(cartId, items);
      res.send();
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong.");
    }
  });
  /**
   * @description - Delete item from a cart
   */
  router.delete("/:cartId/items/:itemId", async (req, res) => {
    let { cartId, itemId } = req.params;

    try {
      itemId = `${config.cartItemIdPreFix}${itemId}?cart=${cartId}`;
      cartId = `${config.cartIdPreFix}${cartId}`;
      await sfClient.removeItemsInCart(cartId, [itemId]);
      res.send();
    } catch (error) {
      console.error(error);
      res.status(500).send("Something went wrong.");
    }
  });
  return router;
};
