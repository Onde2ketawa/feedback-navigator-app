
import {
  LayoutDashboard,
  Star,
  MessageSquareText,
  Layers,
  Upload,
  Users,
  Clock,
  Smartphone,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';

export const sidebarNavItems = [
  {
    href: "/dashboard",
    title: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/rating-analytics",
    title: "Rating Analytics",
    icon: Star,
  },
  {
    href: "/sentiment-analytics",
    title: "Sentiment Analytics",
    icon: MessageSquareText,
  },
  {
    href: "/category-analytics",
    title: "Category Analytics",
    icon: Layers,
  },
  {
    href: "/time-analytics",
    title: "Time Analytics",
    icon: Clock,
  },
  {
    href: "/upload",
    title: "Upload",
    icon: Upload,
  },
  {
    href: "/categories",
    title: "Categories",
    icon: Layers,
  },
  {
    href: "/user-management",
    title: "User Management",
    icon: Users,
  },
  {
    href: "/device-analytics",
    title: "Device Analytics",
    icon: Smartphone,
  },
  {
    href: "/feedback-analysis",
    title: "Feedback Analysis",
    icon: FileText,
  },
];

