// Business Field types
export interface BusinessField {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  shortDesc: string;
  image: string;
  stats?: { label: string; value: string }[];
  features?: string[];
  services?: string[];
}

// News types
export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  readTime: number;
  featured?: boolean;
}

// Job types
export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "full-time" | "part-time" | "contract";
  deadline: string;
  description: string;
  requirements: string[];
  benefits: string[];
  fieldId: string;
}

// Award types
export interface Award {
  id: string;
  title: string;
  issuer: string;
  year: string;
  image: string;
  description?: string;
}

// Timeline types
export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  milestone?: boolean;
}

// Partner types
export interface Partner {
  id: string;
  name: string;
  logo?: string;
  category: string;
}

// Leader types
export interface Leader {
  id: string;
  name: string;
  title: string;
  image: string;
  bio: string;
  achievements?: string[];
}

// Navigation types
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

// Contact form types
export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

// Equipment types
export interface Equipment {
  id: string;
  name: string;
  category: "van-tai" | "cau" | "kho-bai" | "cong-nghe";
  description: string;
  specs?: string;
  image: string;
  quantity?: number;
}
