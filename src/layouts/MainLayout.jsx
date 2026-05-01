import AppShell from "./AppShell";

const adminNav = [
  { label: "Dashboard", to: "/dashboard", icon: "dashboard" },
  { label: "Orders", to: "/orders", icon: "orders" },
  { label: "Employees", to: "/employees", icon: "employees" },
  { label: "Office Boys", to: "/officeboy", icon: "officeBoys" },
  { label: "Restaurants", to: "/restaurants", icon: "restaurants" },
  { label: "Settings", to: "/settings", icon: "settings" },
];

export default function MainLayout() {
  return <AppShell role="Admin" navItems={adminNav} />;
}
