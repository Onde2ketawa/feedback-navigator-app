
import {
  LayoutDashboard,
  Star,
  MessageSquareText,
  Layers,
  Upload,
  Users,
  Clock,
  Smartphone,
  FileText,
  Home,
  Brain,
  Package,
} from 'lucide-react';

// allowedRoles: missing means admin only, otherwise ['admin', 'user'] means both etc.
export const sidebarNavItems = [
  {
    href: "/",
    title: "Home",
    icon: Home,
    allowedRoles: ['admin', 'user'],
  },
  {
    href: "/dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
    allowedRoles: ['admin', 'user'],
  },
  {
    href: "/natural-language-query",
    title: "AI Data Query",
    icon: Brain,
    allowedRoles: ['admin', 'user'],
  },
  {
    href: "/feedback-analysis",
    title: "Feedback Analysis",
    icon: FileText,
    allowedRoles: ['admin', 'user'],
  },
  {
    href: "/feedback-review",
    title: "Feedback Review",
    icon: MessageSquareText,
    allowedRoles: ['admin'],
  },
  {
    href: "/rating-analytics",
    title: "Rating Analytics",
    icon: Star,
    allowedRoles: ['admin'],
  },
  {
    href: "/sentiment-analytics",
    title: "Sentiment Analytics",
    icon: MessageSquareText,
    allowedRoles: ['admin'],
  },
  {
    href: "/category-analytics",
    title: "Category Analytics",
    icon: Layers,
    allowedRoles: ['admin'],
  },
  {
    href: "/time-analytics",
    title: "Time Analytics",
    icon: Clock,
    allowedRoles: ['admin'],
  },
  {
    href: "/app-version-analytics",
    title: "App Version Analytics",
    icon: Package,
    allowedRoles: ['admin'],
  },
  {
    href: "/upload",
    title: "Upload",
    icon: Upload,
    allowedRoles: ['admin'],
  },
  {
    href: "/categories",
    title: "Categories",
    icon: Layers,
    allowedRoles: ['admin'],
  },
  {
    href: "/user-management",
    title: "User Management",
    icon: Users,
    allowedRoles: ['admin'],
  },
  {
    href: "/device-analytics",
    title: "Device Analytics",
    icon: Smartphone,
    allowedRoles: ['admin'],
  },
];
