
import WrappedMenu from '@/components/wrapped_menu';

// Menu data for Header Menu
const menuData = {
  "id": "82a34405-4813-46c7-b58f-7a49e416b231",
  "name": "Header Menu",
  "untouchable": false,
  "font": "Roboto",
  "direction": "horizontal",
  "fontSize": "text-lg",
  "items": [
    {
      "id": "4300a0cc-d009-4346-9ae8-c0543044cef5",
      "name": "About Us",
      "page": "about",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "9ed6f1ad-c846-42b4-8462-f30b1d4507c1",
      "name": "Catering Services",
      "page": "catering",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "90776ac1-cb05-4016-b1ba-515a77eced6f",
      "name": "Contact",
      "page": "contact",
      "menu": null,
      "untouchable": false,
      "hiddenOnDesktop": true
    },
    {
      "id": "61132bdf-54bd-4216-8f14-56ec375dd398",
      "name": "Locations & Schedule",
      "page": "locations",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "a7a3dfe4-05e6-407c-b93b-19e46e227ae2",
      "name": "Menu",
      "page": "menu",
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

export default function HeaderMenuView() {
    return <WrappedMenu menu={menuData} pages={pagesData} />;
}