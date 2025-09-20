
import WrappedMenu from '@/components/wrapped_menu';

// Menu data for Header (Admin)
const menuData = {
  "id": "29df3cce-ecf9-4b1b-966d-5304517e9884",
  "name": "Header (Admin)",
  "untouchable": false,
  "font": "Roboto",
  "direction": "horizontal",
  "fontSize": "text-lg",
  "items": [
    {
      "id": "2696a6b8-d6fc-47b2-a14e-9f5aadbcee62",
      "name": "Session Management",
      "page": "admin_sessions",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "e4e3668b-2f17-4561-9a3b-6a483eac1f97",
      "name": "Practitioner Management",
      "page": "admin_practitioners",
      "menu": null,
      "untouchable": false
    },
    {
      "id": "eafc33e7-9103-4aa5-8389-dd9186b49d95",
      "name": "Content Management",
      "page": "admin_content",
      "menu": null,
      "untouchable": false
    }
  ]
};

// Pages data for URL resolution
const pagesData = [
  {
    "id": "3d4050bd-9cc8-404f-8eb0-e0ec33278c74",
    "name": "Dashboard"
  },
  {
    "id": "eb594b19-ebe5-4bd8-9795-eb62f3de58b7",
    "name": "Admin Dashboard"
  },
  {
    "id": "home",
    "name": "Home"
  },
  {
    "id": "services",
    "name": "Services"
  },
  {
    "id": "service_detail",
    "name": "Service Detail"
  },
  {
    "id": "booking",
    "name": "Book Session"
  },
  {
    "id": "about",
    "name": "About"
  },
  {
    "id": "practitioners",
    "name": "Our Practitioners"
  },
  {
    "id": "practitioner_detail",
    "name": "Practitioner Profile"
  },
  {
    "id": "sound_library",
    "name": "Sound Library"
  },
  {
    "id": "wellness_resources",
    "name": "Wellness Resources"
  },
  {
    "id": "testimonials",
    "name": "Testimonials"
  },
  {
    "id": "contact",
    "name": "Contact"
  },
  {
    "id": "my_sessions",
    "name": "My Sessions"
  },
  {
    "id": "wellness_journal",
    "name": "Wellness Journal"
  },
  {
    "id": "admin_sessions",
    "name": "Session Management"
  },
  {
    "id": "admin_practitioners",
    "name": "Practitioner Management"
  },
  {
    "id": "admin_content",
    "name": "Content Management"
  },
  {
    "id": "b5ddfbf3-d05f-4ba6-826f-cda452a3bc27",
    "name": "Terms of Service"
  },
  {
    "id": "0f7a704e-3408-42b8-97fa-ee84d2c402bc",
    "name": "Privacy Policy"
  },
  {
    "id": "d0467735-83eb-4e1f-9853-c431fda1390c",
    "name": "Login"
  }
];

export default function HeaderAdminView() {
    return <WrappedMenu menu={menuData} pages={pagesData} />;
}