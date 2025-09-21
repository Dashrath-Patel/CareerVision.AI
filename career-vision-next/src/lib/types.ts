// Type definitions for the application
export interface User {
  id?: string;
  name?: string;
  email?: string;
}

export interface QuizQuestion {
  id: number;
  question_text: string;
  choices: {
    id: number;
    choice_text: string;
    is_correct: boolean;
  }[];
}

export interface QuizResult {
  score: number;
  total_questions: number;
  logical_quotient_rating: number;
}

export interface CareerArea {
  label: string;
  value: string;
}

export interface CompanyType {
  label: string;
  value: string;
}

export interface BookType {
  label: string;
  value: string;
}

export interface Subject {
  label: string;
  value: string;
}

// Form validation types
export interface FormErrors {
  [key: string]: string | undefined;
}

// Navigation items
export interface NavItem {
  title: string;
  href: string;
  description?: string;
}

// Feature card data
export interface Feature {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  gradient: string;
}