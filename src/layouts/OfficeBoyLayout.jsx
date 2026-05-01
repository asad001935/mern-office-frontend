import AppShell from "./AppShell";

const officeBoyNav = [
  { label: "Dashboard", to: "/office-boy", icon: "dashboard", end: true },
  { label: "Pending Orders", to: "/office-boy/orders", icon: "orders" },
];

export default function OfficeBoyLayout() {
  return <AppShell role="officeBoy" navItems={officeBoyNav} />;
}
