
import WrappedMenu from '@/components/wrapped_menu';

// Menu data for Header (Admin)
const menuData = {
  "id": "18ba64cf-8ed0-4671-9ffb-96a834ab412e",
  "name": "Header (Admin)",
  "untouchable": false,
  "font": "Roboto",
  "direction": "horizontal",
  "fontSize": "text-lg",
  "items": [
    {
      "id": "939e8c92-4f0c-42af-9022-0f6be245234b",
      "name": "Inventory Management",
      "page": "admin_inventory",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "c7684fd0-ed27-4666-bb2d-12e21621621a",
      "name": "Order Management",
      "page": "admin_orders",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "df3ec4b0-ca25-40b4-8fa8-e2b207f5c01b",
      "name": "Customer Management",
      "page": "admin_customers",
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

export default function HeaderAdminView() {
    return <WrappedMenu menu={menuData} pages={pagesData} />;
}