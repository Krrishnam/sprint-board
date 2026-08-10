export type TaskStatus =
  | "todo"
  | "committed"
  | "active"
  | "in_progress"
  | "in_review"
  | "done";

export type TaskPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface Assignee {
  id: string;
  name: string;
  email?: string;
}

export interface Task {
  id: string;
  task_number: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimated_hours: number;
  remaining_hours: number;
  due_date?: string;
  project_id?: string;
  sprint_id?: string;
  assignee?: Assignee | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimated_hours?: number;
  remaining_hours?: number;
  due_date?: string;
  project_id: string;
  sprint_id: string;
  created_by_id: string;
  assignee_id?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  estimated_hours?: number;
  remaining_hours?: number;
  due_date?: string;
  assignee_id?: string;
}