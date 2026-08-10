import api from "@/lib/axios";
import { BoardData } from "@/types/board";
import { Task } from "@/types/task";

export const getBoard = async (
  sprintId: string
): Promise<BoardData> => {
  const response = await api.get(`/board/${sprintId}`);

  const data = response.data;

  // Normalize a single task
  const normalizeTask = (task: any): Task => {
    const rawAssignee =
      task.assignee ?? task.Assignee ?? null;

    return {
      // Task ID
      id:
        task.id ??
        task.ID ??
        "",

      // Task Number
      task_number:
        task.task_number ??
        task.TaskNumber ??
        "",

      // Basic information
      title:
        task.title ??
        task.Title ??
        "",

      description:
        task.description ??
        task.Description ??
        "",

      // Status
      status:
        task.status ??
        task.Status ??
        "todo",

      // Priority
      priority:
        task.priority ??
        task.Priority ??
        "medium",

      
      estimated_hours:
        task.estimated_hours ??
        task.EstimatedHours ??
        0,

      remaining_hours:
        task.remaining_hours ??
        task.RemainingHours ??
        0,

      // Date
      due_date:
        task.due_date ??
        task.DueDate ??
        undefined,

  
      // Assignee
  
      assignee: rawAssignee
        ? {
            id:
              rawAssignee.id ??
              rawAssignee.ID ??
              "",

            name:
              rawAssignee.name ??
              rawAssignee.Name ??
              "Unknown",

            email:
              rawAssignee.email ??
              rawAssignee.Email ??
              undefined,
          }
        : null,
    };
  };

  // Normalize task array
  const normalizeTasks = (
    tasks: any
  ): Task[] => {
    if (!Array.isArray(tasks)) {
      return [];
    }

    return tasks.map(normalizeTask);
  };

  // Return normalized board
  return {
    project_id:
      data.project_id ??
      data.ProjectID ??
      data.ProjectId ??
      "",

    todo: normalizeTasks(
      data.todo ??
      data.Todo
    ),

    committed: normalizeTasks(
      data.committed ??
      data.Committed
    ),

    active: normalizeTasks(
      data.active ??
      data.Active
    ),

    in_progress: normalizeTasks(
      data.in_progress ??
      data.InProgress
    ),

    in_review: normalizeTasks(
      data.in_review ??
      data.InReview
    ),

    done: normalizeTasks(
      data.done ??
      data.Done
    ),
  };
};