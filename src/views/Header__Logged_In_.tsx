
import WrappedMenu from '@/components/wrapped_menu';

// Menu data for Header (Logged In)
const menuData = {
  "id": "4ef7ecef-2faa-4114-bcf3-d5890632ad48",
  "name": "Header (Logged In)",
  "untouchable": false,
  "font": "Roboto",
  "direction": "horizontal",
  "fontSize": "text-lg",
  "items": [
    {
      "id": "672648d1-6791-42e3-a979-955ebb3f72ab",
      "name": "Order History",
      "page": "order_history",
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

export default function HeaderLoggedInView() {
    return <WrappedMenu menu={menuData} pages={pagesData} />;
}