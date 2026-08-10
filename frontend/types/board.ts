import { Task } from "@/types/task";

export interface BoardData {
  project_id: string;

  todo: Task[];
  committed: Task[];
  active: Task[];
  in_progress: Task[];
  in_review: Task[];
  done: Task[];
}