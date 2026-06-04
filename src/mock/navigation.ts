import {
  Home,
  MessageSquare,
  User,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  path: string;
  icon: LucideIcon;
  label: string;
  badge?: string;
}

export const navItems: NavItem[] = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/chat", icon: MessageSquare, label: "Messages", badge: "12" },
  { path: "/profile", icon: User, label: "Profile" },
  { path: "/settings", icon: Settings, label: "Settings" },
];
