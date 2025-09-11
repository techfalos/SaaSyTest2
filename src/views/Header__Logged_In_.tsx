
import WrappedMenu from '@/components/wrapped_menu';

// Menu data for Header (Logged In)
const menuData = {
  "id": "366323bb-7626-4d54-adae-e12a6308a45f",
  "name": "Header (Logged In)",
  "untouchable": false,
  "font": "Roboto",
  "direction": "horizontal",
  "fontSize": "text-lg",
  "items": [
    {
      "id": "2518cd32-c7ce-46ff-8aa4-9fde3acf172d",
      "name": "Order Online",
      "page": "order_online",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "61e14fc7-60c0-4f88-92ba-eacd07fef36b",
      "name": "Shopping Cart",
      "page": "shopping_cart",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "a62021d7-5168-4ed2-9638-66aa57a072e3",
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

export default function HeaderLoggedInView() {
    return <WrappedMenu menu={menuData} pages={pagesData} />;
}