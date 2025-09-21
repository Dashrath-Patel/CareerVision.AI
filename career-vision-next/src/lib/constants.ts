import { CareerArea, CompanyType, BookType, Subject } from './types';

// Career areas options
export const CAREER_AREAS: CareerArea[] = [
  { label: 'Software Development', value: 'software_development' },
  { label: 'Data Science', value: 'data_science' },
  { label: 'Web Development', value: 'web_development' },
  { label: 'Mobile Development', value: 'mobile_development' },
  { label: 'DevOps', value: 'devops' },
  { label: 'AI/Machine Learning', value: 'ai_ml' },
  { label: 'Cybersecurity', value: 'cybersecurity' },
  { label: 'Database Administration', value: 'database_admin' },
  { label: 'UI/UX Design', value: 'ui_ux_design' },
  { label: 'Product Management', value: 'product_management' },
  { label: 'Quality Assurance', value: 'quality_assurance' },
  { label: 'System Administration', value: 'system_admin' },
];

// Company types
export const COMPANY_TYPES: CompanyType[] = [
  { label: 'Startup', value: 'startup' },
  { label: 'Product Company', value: 'product_company' },
  { label: 'Service Company', value: 'service_company' },
  { label: 'Consulting', value: 'consulting' },
  { label: 'Government', value: 'government' },
  { label: 'Non-Profit', value: 'non_profit' },
  { label: 'Enterprise', value: 'enterprise' },
];

// Book types
export const BOOK_TYPES: BookType[] = [
  { label: 'Technical', value: 'technical' },
  { label: 'Self-Help', value: 'self_help' },
  { label: 'Biography', value: 'biography' },
  { label: 'Fiction', value: 'fiction' },
  { label: 'Business', value: 'business' },
  { label: 'Science', value: 'science' },
  { label: 'History', value: 'history' },
];

// Subjects
export const SUBJECTS: Subject[] = [
  { label: 'Computer Science', value: 'computer_science' },
  { label: 'Mathematics', value: 'mathematics' },
  { label: 'Physics', value: 'physics' },
  { label: 'Chemistry', value: 'chemistry' },
  { label: 'Biology', value: 'biology' },
  { label: 'Economics', value: 'economics' },
  { label: 'Statistics', value: 'statistics' },
  { label: 'Psychology', value: 'psychology' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Business', value: 'business' },
];

// Yes/No options
export const YES_NO_OPTIONS = [
  { label: 'Yes', value: 'yes' },
  { label: 'No', value: 'no' },
];

// Management vs Technical
export const MANAGEMENT_TECHNICAL = [
  { label: 'Management', value: 'management' },
  { label: 'Technical', value: 'technical' },
];

// Work style
export const WORK_STYLE = [
  { label: 'Hard Worker', value: 'hard_worker' },
  { label: 'Smart Worker', value: 'smart_worker' },
];

// Personality type
export const PERSONALITY_TYPE = [
  { label: 'Introvert', value: 'introvert' },
  { label: 'Extrovert', value: 'extrovert' },
];

// Self learning capability levels
export const LEARNING_LEVELS = [
  { label: 'Excellent', value: 'excellent' },
  { label: 'Medium', value: 'medium' },
  { label: 'Poor', value: 'poor' },
];

// Rating scale (1-10)
export const RATING_SCALE = Array.from({ length: 10 }, (_, i) => ({
  label: (i + 1).toString(),
  value: i + 1,
}));