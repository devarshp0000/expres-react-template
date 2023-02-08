const { GraphQLClient, gql } = require("graphql-request");
const config = require("../config");

module.exports = class StorefrontClient {
  /**
   * @type {GraphQLClient}
   */
  #apiClient;
  constructor(domain, accessToken) {
    const endpoint = `https://${domain}${config.shopifyEndpointPostFixGQL}`;
    this.#apiClient = new GraphQLClient(endpoint, {
      headers: {
        "X-Shopify-Storefront-Access-Token": accessToken,
      },
    });
  }

  async login(email, password) {
    const { query, variables } = this.#getLoginQuery(email, password);
    const response = await this.#apiClient.request(query, variables);
    return response.customerAccessTokenCreate.customerAccessToken;
  }

  async logout(token) {
    const { query, variables } = this.#getLogoutQuery(token);

    await this.#apiClient.request(query, variables);
  }

  async getCustomer(token) {
    const { query } = this.#getAuthQuery(token);
    const response = await this.#apiClient.request(query);

    return response.customer;
  }

  async createEmptyCart(email, token) {
    const { query, variables } = this.#getCreateCartQuery(email, token);
    const response = await this.#apiClient.request(query, variables);

    return response.cartCreate;
  }

  async getCart(id, numLineItems, cursor) {
    if (!numLineItems) numLineItems = 10;
    if (!cursor) cursor = "";
    const { query, variables } = this.#getGetCartQuery(
      id,
      numLineItems,
      cursor
    );
    const response = await this.#apiClient.request(query, variables);

    return response.cart;
  }

  /**
   *
   * @param {string} cartId
   * @param {{merchandiseId: string,quantity: number}[]} items
   */
  async addItemsInCart(cartId, items) {
    const { query, variables } = this.#getAddLineItemsInCartQuery(
      cartId,
      items
    );
    const response = await this.#apiClient.request(query, variables);

    return response.cartLinesAdd.cart;
  }

  /**
   *
   * @param {string} cartId
   * @param {{merchandiseId: string,quantity: number, id:string}[]} items
   */
  async updateItemsInCart(cartId, items) {
    const { query, variables } = this.#getUpdateLineItemsInCartQuery(
      cartId,
      items
    );
    const response = await this.#apiClient.request(query, variables);

    return response.cartLinesUpdate.cart;
  }

  /**
   *
   * @param {string} cartId
   * @param {string[]} items
   */
  async removeItemsInCart(cartId, items) {
    const { query, variables } = this.#getRemoveLineItemsInCartQuery(
      cartId,
      items
    );
    const response = await this.#apiClient.request(query, variables);

    return response.cartLinesRemove.cart;
  }

  #getLoginQuery(email, password) {
    return {
      query: gql`
        mutation customerAccessTokenCreate(
          $input: CustomerAccessTokenCreateInput!
        ) {
          customerAccessTokenCreate(input: $input) {
            customerAccessToken {
              # CustomerAccessToken fields
              accessToken
              expiresAt
            }
            customerUserErrors {
              # CustomerUserError fields
              code
              message
              field
            }
          }
        }
      `,
      variables: {
        input: {
          email,
          password,
        },
      },
    };
  }
  #getAuthQuery(token) {
    return {
      query: gql`
        {
          customer(customerAccessToken: "${token}") {
            # Customer fields
            firstName
            lastName
            id
            email
          }
        }
      `,
    };
  }
  #getLogoutQuery(token) {
    return {
      query: gql`
        mutation customerAccessTokenDelete($customerAccessToken: String!) {
          customerAccessTokenDelete(customerAccessToken: $customerAccessToken) {
            deletedAccessToken
            deletedCustomerAccessTokenId
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        customerAccessToken: token,
      },
    };
  }
  #getCreateCartQuery(email, token) {
    return {
      query: gql`
        mutation cartCreate {
          cartCreate {
            cart {
              # Cart fields
              id
              checkoutUrl
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: {
          buyerIdentity: {
            email,
            customerAccessToken: token,
          },
        },
      },
    };
  }
  #getGetCartQuery(cartId, numLineItems, cursor) {
    return {
      query: gql`
        query ($numLineItems: Int!, $cartId: ID!, $cursor: String) {
          cart(id: $cartId) {
            # Cart fields
            id
            cost {
              totalAmount {
                amount
              }
            }
            checkoutUrl
            buyerIdentity {
              email
            }
            lines(first: $numLineItems, after: $cursor) {
              edges {
                node {
                  id
                  quantity
                  # merchandise{
                  #     ... on ProductVariant{
                  #         id
                  #     }
                  # }
                }
              }
            }
          }
        }
      `,
      variables: {
        cartId,
        numLineItems,
        ...(cursor ? { cursor } : {}),
      },
    };
  }
  #getAddLineItemsInCartQuery(cartId, lines) {
    return {
      query: gql`
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              # Cart fields
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        cartId,
        lines,
      },
    };
  }
  #getUpdateLineItemsInCartQuery(cartId, lines) {
    return {
      query: gql`
        mutation cartLinesUpdate(
          $cartId: ID!
          $lines: [CartLineUpdateInput!]!
        ) {
          cartLinesUpdate(cartId: $cartId, lines: $lines) {
            cart {
              # Cart fields
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        cartId,
        lines,
      },
    };
  }
  #getRemoveLineItemsInCartQuery(cartId, lineIds) {
    return {
      query: gql`
        mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
            cart {
              # Cart fields
              id
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        cartId,
        lineIds,
      },
    };
  }
};
