
import WrappedMenu from '@/components/wrapped_menu';

// Menu data for Header Menu
const menuData = {
  "id": "8631b772-368a-4fe0-8669-c4411844f44a",
  "name": "Header Menu",
  "untouchable": false,
  "font": "Roboto",
  "direction": "horizontal",
  "fontSize": "text-lg",
  "items": [
    {
      "id": "762914a8-c0e9-490b-822a-fccb27a7f967",
      "name": "About Us",
      "page": "about_us",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "716b49d5-fe88-4fc8-aadf-5b2e62d01435",
      "name": "Contact Us",
      "page": "contact",
      "menu": null,
      "untouchable": false,
      "hiddenOnDesktop": true
    },
    {
      "id": "43167e62-3fb2-46fa-a725-ac4e0e58b271",
      "name": "Dress Categories",
      "page": "dress_categories",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "be29d498-e963-4b5d-853d-6b2d01515d61",
      "name": "Dress Collection",
      "page": "dress_listing",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "9b8887ae-03ba-4bb6-9f33-1583f68dc987",
      "name": "Shipping & Returns",
      "page": "shipping_returns",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "dbd1624b-9f05-46dc-8bad-6bc154f49699",
      "name": "Shopping Cart",
      "page": "shopping_cart",
      "menu": null,
      "untouchable": false,
      "hiddenOnDesktop": true
    },
    {
      "id": "b9529e19-1d4f-4dd2-8a54-1c9feb22059d",
      "name": "Size Guide",
      "page": "size_guide",
      "menu": null,
      "untouchable": false
    }
  ]
};

// Pages data for URL resolution
const pagesData = [
  {
    "id": "a89c54f8-dee4-4626-bbd0-865dd1cf203f",
    "name": "Dashboard"
  },
  {
    "id": "4b34f144-e83c-493d-8015-dcc14cd3f25e",
    "name": "Admin Dashboard"
  },
  {
    "id": "home",
    "name": "Home"
  },
  {
    "id": "dress_categories",
    "name": "Dress Categories"
  },
  {
    "id": "dress_listing",
    "name": "Dress Collection"
  },
  {
    "id": "dress_detail",
    "name": "Dress Details"
  },
  {
    "id": "shopping_cart",
    "name": "Shopping Cart"
  },
  {
    "id": "checkout",
    "name": "Checkout"
  },
  {
    "id": "order_confirmation",
    "name": "Order Confirmation"
  },
  {
    "id": "order_history",
    "name": "Order History"
  },
  {
    "id": "order_details",
    "name": "Order Details"
  },
  {
    "id": "about_us",
    "name": "About Us"
  },
  {
    "id": "contact",
    "name": "Contact Us"
  },
  {
    "id": "size_guide",
    "name": "Size Guide"
  },
  {
    "id": "shipping_returns",
    "name": "Shipping & Returns"
  },
  {
    "id": "admin_inventory",
    "name": "Inventory Management"
  },
  {
    "id": "admin_orders",
    "name": "Order Management"
  },
  {
    "id": "admin_customers",
    "name": "Customer Management"
  },
  {
    "id": "5c56b107-5d10-46bc-a8f6-c6bc49fccb95",
    "name": "Terms of Service"
  },
  {
    "id": "cf86149c-fe51-47b4-bdb3-565842d2a44a",
    "name": "Privacy Policy"
  },
  {
    "id": "61b0ae7e-da91-414e-a3cd-b05a1fc02c2d",
    "name": "Login"
  }
];

export default function HeaderMenuView() {
    return <WrappedMenu menu={menuData} pages={pagesData} />;
}