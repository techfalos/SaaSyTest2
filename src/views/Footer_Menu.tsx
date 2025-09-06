
import WrappedMenu from '@/components/wrapped_menu';

// Menu data for Footer Menu
const menuData = {
  "id": "086cbbe6-6bdd-4b22-a17e-88ca5449d9f9",
  "name": "Footer Menu",
  "untouchable": false,
  "font": "Roboto",
  "direction": "horizontal",
  "fontSize": "text-base",
  "items": [
    {
      "id": "e2425a1b-aa28-4ef9-a34f-8ed79899b981",
      "name": "About Us",
      "page": "about_us",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "1a66ebf0-9c10-4578-bde6-893516c36fab",
      "name": "Contact Us",
      "page": "contact",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "8d1843b2-fe92-4e50-b0f4-c0b6c8453f95",
      "name": "Terms of Service",
      "page": "5c56b107-5d10-46bc-a8f6-c6bc49fccb95",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "93ffacb1-521d-4bbe-aa4d-dd9cff09d9ee",
      "name": "Privacy Policy",
      "page": "cf86149c-fe51-47b4-bdb3-565842d2a44a",
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

export default function FooterMenuView() {
    return <WrappedMenu menu={menuData} pages={pagesData} />;
}