import {
  BarChart3,
  PieChart,
  FileText,
  FileSearch,
  LifeBuoy,
  Settings,
  Users,
  UserCheck,
  Shield,
  MessageSquare,
  Calendar,
  Heart,
  DollarSign,
  Receipt,
  Search,
  CheckCircle,
  BookOpen,
  Book,
  Headphones,
  ImageIcon,
  Megaphone,
  ClipboardList,
} from "lucide-react"

export interface MegaMenuProps {
  module: string
}

export const menuData = {
  Hub: {
    description: "Monitor performance, manage settings, and view system activity",
    featured: {
      title: "Admin Dashboard",
      description: "Comprehensive temple management and analytics platform.",
      icon: <BarChart3 className="w-8 h-8" />,
      image: "/sai-baba-blessing-devotees-in-temple-setting-with-.png",
    },
    sections: [
      {
        name: "Dashboard",
        description: "Overview of key metrics and temple activity",
        icon: <PieChart className="w-4 h-4" />,
        href: "/hub",
      },
     
      {
        name: "Support Tickets",
        description: "Raise and track support issues",
        icon: <LifeBuoy className="w-4 h-4" />,
        href: "/communication/support",
      },
      {
        name: "Settings",
        description: "Configure temple settings and preferences",
        icon: <Settings className="w-4 h-4" />,
        href: "/admin/settings",
      },
      {
        name: "Notifications",
        description: "Manage notifications triggers",
        icon: <Settings className="w-4 h-4" />,
        href: "/admin/notifications",
      },
    ],
  },
  Identity: {
    description: "Manage users, roles, volunteers, and secure identity",
    featured: {
      title: "User Management",
      description: "Comprehensive user and identity control system for temple community.",
      icon: <Users className="w-8 h-8" />,
      image: "/sai-baba-with-devotees-showing-community-unity-and.png",
    },
    sections: [
      {
        name: "Users",
        description: "Manage user profiles and accounts",
        icon: <UserCheck className="w-4 h-4" />,
        href: "/identity/users",
      },
      {
        name: "Roles",
        description: "Assign and manage roles and permissions",
        icon: <Shield className="w-4 h-4" />,
        href: "/identity/roles",
      },
      {
        name: "Groups",
        description: "Manage temple groups and members",
        icon: <Users className="w-4 h-4" />,
        href: "/identity/groups",
      },
    ],
  },
  Communication: {
    description: "Share announcements, events, and support community engagement",
    featured: {
      title: "Community Hub",
      description: "Central platform for temple communications and community engagement.",
      icon: <MessageSquare className="w-8 h-8" />,
      image: "/sai-baba-teaching-and-speaking-to-gathered-devotee.png",
    },
    sections: [
      {
        name: "Calendar",
        description: "View scheduled events and important dates",
        icon: <Calendar className="w-4 h-4" />,
        href: "/communication/calendar",
      },
      {
        name: "Engagements",
        description: "Announcements, events, meetings and more",
        icon: <Megaphone className="w-4 h-4" />,
        href: "/communication/engagements",
      },
      {
        name: "Forms",
        description: "Create and manage interactive forms",
        icon: <ClipboardList className="w-4 h-4" />,
        href: "/communication/forms",
      },
      {
        name: "Volunteers",
        description: "Track and manage volunteer activities",
        icon: <Heart className="w-4 h-4" />,
        href: "/communication/volunteers",
      },
    ],
  },
  Contributions: {
    description: "Facilitate donations and provide spiritual services",
    featured: {
      title: "Donation Review",
      description: "Admin panel for reviewing and managing donation requests from devotees.",
      icon: <Heart className="w-8 h-8" />,
      image: "/sai-baba-receiving-offerings-and-donations-with-ha.png",
    },
    sections: [
      {
        name: "Donation Review",
        description: "Review, approve, and manage donation requests",
        icon: <DollarSign className="w-4 h-4" />,
        href: "/contributions/donations",
      },
      {
        name: "Donation Requests",
        description: "Submit and track donation requests",
        icon: <Receipt className="w-4 h-4" />,
        href: "/contributions/donation-requests",
      },
      {
        name: "Track Donations",
        description: "Check the status of your donations",
        icon: <Search className="w-4 h-4" />,
        href: "/contributions/donation-tracker",
      },
      {
        name: "Donation Templates",
        description: "Create and manage donation templates",
        icon: <FileText className="w-4 h-4" />,
        href: "/contributions/donation-templates",
      },
    ],
  },
  Library: {
    description: "Access spiritual knowledge, media, and resources",
    featured: {
      title: "Digital Library",
      description: "Comprehensive collection of spiritual knowledge and temple resources.",
      icon: <BookOpen className="w-8 h-8" />,
      image: "/sai-baba-reading-sacred-texts-surrounded-by-books-.png",
    },
    sections: [
      {
        name: "Gallery",
        description: "View photos and media from engagements",
        icon: <ImageIcon className="w-4 h-4" />,
        href: "/library/gallery",
      },
      {
        name: "Ebooks",
        description: "Access and read digital books",
        icon: <Book className="w-4 h-4" />,
        href: "/library/ebooks",
      },
      {
        name: "Audiobooks",
        description: "Listen to spiritual and community audiobooks",
        icon: <Headphones className="w-4 h-4" />,
        href: "/library/audiobooks",
      },
      
    ],
  },
}
