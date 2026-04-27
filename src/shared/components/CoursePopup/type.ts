export interface CourseData {
  title: string;
  description: string;
  coverImage: string;
}

export interface CoursePopupProps {
  onCancel: () => void;
  onSave: (courseData: CourseData) => void;
}

export interface CourseCardProps {
  course: CourseData;
  onEdit?: (course: CourseData) => void;
  onDelete?: (courseId: string) => void;
}
