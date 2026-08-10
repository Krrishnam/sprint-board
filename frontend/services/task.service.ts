import api from "@/lib/axios";

import {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
} from "@/types/task";

// GET ALL TASKS

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get("/tasks");

  const data = response.data;

  return data.map((task: any) => ({
    id: task.id ?? task.ID,
    task_number: task.task_number ?? task.TaskNumber,

    title: task.title ?? task.Title ?? "",
    description: task.description ?? task.Description ?? "",

    status: task.status ?? task.Status,
    priority: task.priority ?? task.Priority,

    story_points: task.story_points ?? task.StoryPoints ?? 0,
    estimated_hours:
      task.estimated_hours ?? task.EstimatedHours ?? 0,
    remaining_hours:
      task.remaining_hours ?? task.RemainingHours ?? 0,

    due_date: task.due_date ?? task.DueDate,

    project_id: task.project_id ?? task.ProjectID,
    sprint_id: task.sprint_id ?? task.SprintID,

    assignee: task.assignee ?? task.Assignee ?? null,
  }));
};
// GET SINGLE TASK

export const getTask = async (
  id: string
): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);

  return response.data;
};

// CREATE TASK

export const createTask = async (
  data: CreateTaskRequest
): Promise<Task> => {
  try {
    console.log("SENDING TASK:", data);

    const response = await api.post("/tasks", data);

    console.log("TASK CREATED:", response.data);

    return response.data;
  } catch (err: any) {
    console.error("createTask failed:", err.response?.data ?? err.message);
    throw err; // let the caller (component) handle showing it to the user
  }
};

// UPDATE TASK

export const updateTask = async (
  id: string,
  data: UpdateTaskRequest
): Promise<Task> => {
  const response = await api.put(
    `/tasks/${id}`,
    data
  );

  return response.data;
};

// DELETE TASK

export const deleteTask = async (
  id: string
): Promise<void> => {
  await api.delete(`/tasks/${id}`);
};

// updatetaskStatus
export const updateTaskStatus = async (
  id: string,
  status: string
): Promise<void> => {
  await api.patch(`/tasks/${id}/status`, {
    status,
  });
};