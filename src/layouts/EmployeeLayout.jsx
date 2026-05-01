import AppShell from "./AppShell";

const employeeNav = [
  { label: "Dashboard", to: "/employee", icon: "dashboard", end: true },
  { label: "Create Order", to: "/employee/create-order", icon: "createOrder" },
  { label: "My Orders", to: "/employee/orders", icon: "orders" },
];

export default function EmployeeLayout() {
  return <AppShell role="Employee" navItems={employeeNav} />;
}
