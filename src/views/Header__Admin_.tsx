
import WrappedMenu from '@/components/wrapped_menu';

// Menu data for Header (Admin)
const menuData = {
  "id": "039d3c7c-4acc-474f-ae03-738959c513ce",
  "name": "Header (Admin)",
  "untouchable": false,
  "font": "Roboto",
  "direction": "horizontal",
  "fontSize": "text-lg",
  "items": [
    {
      "id": "95d2c648-fc10-4c7d-8ffd-4d14e6e743ef",
      "name": "Order Management",
      "page": "admin_orders",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "d772e680-4975-4b62-84c1-98b7032b7adb",
      "name": "Menu Management",
      "page": "admin_menu",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "83ba9dc6-35ec-4d4e-a962-a1ff38bba409",
      "name": "Location Management",
      "page": "admin_locations",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "4daedd37-c6e2-4ef3-aae4-5e1c4e22b3bc",
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

export default function HeaderAdminView() {
    return <WrappedMenu menu={menuData} pages={pagesData} />;
}