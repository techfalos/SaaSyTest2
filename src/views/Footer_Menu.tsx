
import WrappedMenu from '@/components/wrapped_menu';

// Menu data for Footer Menu
const menuData = {
  "id": "453f3625-c07c-433f-9e06-9c03f5aafd8f",
  "name": "Footer Menu",
  "untouchable": false,
  "font": "Roboto",
  "direction": "horizontal",
  "fontSize": "text-base",
  "items": [
    {
      "id": "9a65ee9d-f0ab-4b0e-808d-a00482ff5ed9",
      "name": "About Us",
      "page": "about",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "b8e75419-dae9-40cc-985d-10b42cd630e1",
      "name": "Contact",
      "page": "contact",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "48bf6f9e-eb94-49c4-aa46-b9588592f969",
      "name": "Terms of Service",
      "page": "008c67f7-2a1d-4e08-a5dd-59d024a6fa5b",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "977f1ab4-7a72-46cf-b158-a48d319118d2",
      "name": "Privacy Policy",
      "page": "552eea5a-70ae-417e-bdee-9c63a805e564",
      "menu": null,
      "untouchable": false
    }
  ]
};

// Pages data for URL resolution
const pagesData = [
  {
    "id": "c6ed7b1e-f82a-486e-884f-5640c0022579",
    "name": "Dashboard"
  },
  {
    "id": "6d5054b9-94b1-4a33-87ae-5e7e5712db09",
    "name": "Admin Dashboard"
  },
  {
    "id": "home",
    "name": "Home"
  },
  {
    "id": "menu",
    "name": "Menu"
  },
  {
    "id": "order_online",
    "name": "Order Online"
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
    "id": "locations",
    "name": "Locations & Schedule"
  },
  {
    "id": "about",
    "name": "About Us"
  },
  {
    "id": "contact",
    "name": "Contact"
  },
  {
    "id": "catering",
    "name": "Catering Services"
  },
  {
    "id": "admin_orders",
    "name": "Order Management"
  },
  {
    "id": "admin_menu",
    "name": "Menu Management"
  },
  {
    "id": "admin_locations",
    "name": "Location Management"
  },
  {
    "id": "admin_customers",
    "name": "Customer Management"
  },
  {
    "id": "008c67f7-2a1d-4e08-a5dd-59d024a6fa5b",
    "name": "Terms of Service"
  },
  {
    "id": "552eea5a-70ae-417e-bdee-9c63a805e564",
    "name": "Privacy Policy"
  },
  {
    "id": "ac01e8ce-c52e-435a-aa7f-68539070cf6d",
    "name": "Login"
  }
];

export default function FooterMenuView() {
    return <WrappedMenu menu={menuData} pages={pagesData} />;
}