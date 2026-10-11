import { toast } from 'sonner';

const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STORE_PERMANENT_DOMAIN = 'oceanfishmarketbh-lbrgl.myshopify.com';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
const SHOPIFY_STOREFRONT_TOKEN = '88ed02921ef51479efbfa6a7d20b448e';

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    priceRange: {
      minVariantPrice: {
        amount: string;
        currencyCode: string;
      };
    };
    images: {
      edges: Array<{
        node: {
          url: string;
          altText: string | null;
        };
      }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          availableForSale: boolean;
          selectedOptions: Array<{
            name: string;
            value: string;
          }>;
        };
      }>;
    };
    options: Array<{
      name: string;
      values: string[];
    }>;
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Shopify API access requires an active billing plan. Visit https://admin.shopify.com to upgrade.",
    });
    return;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`Shopify error: ${data.errors.map((e: { message: string }) => e.message).join(', ')}`);
  }

  return data;
}

const STOREFRONT_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

export async function fetchShopifyProducts(first = 50, query?: string): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_QUERY, { first, query });
  return data?.data?.products?.edges || [];
}

// Subscription products can't be sold through the main storefront channel, so
// membership signups use the separate Headless channel's public token.
const MEMBERSHIP_STOREFRONT_TOKEN = '0af559104462b2b4731c657336109e6e';
const ANNUAL_MEMBERSHIP_VARIANT_ID = 'gid://shopify/ProductVariant/47768065081428';
const ANNUAL_MEMBERSHIP_SELLING_PLAN_ID = 'gid://shopify/SellingPlan/1893531732';

export async function createMembershipCheckoutUrl(): Promise<string | null> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': MEMBERSHIP_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({
      query: `mutation($input: CartInput!) {
        cartCreate(input: $input) { cart { checkoutUrl } userErrors { message } }
      }`,
      variables: {
        input: {
          lines: [{
            quantity: 1,
            merchandiseId: ANNUAL_MEMBERSHIP_VARIANT_ID,
            sellingPlanId: ANNUAL_MEMBERSHIP_SELLING_PLAN_ID,
          }],
        },
      },
    }),
  });
  if (!response.ok) return null;
  const data = await response.json();
  return data?.data?.cartCreate?.cart?.checkoutUrl ?? null;
}
