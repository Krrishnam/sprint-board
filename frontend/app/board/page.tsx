"use client";

import {
  DragEvent,
  Suspense,
  useEffect,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";

import ProtectedRoute from "@/components/auth/ProtectedRoutes";
import CreateTaskModule from "@/components/board/CreateTaskModule";

import { getBoard } from "@/services/board.service";
import { updateTaskStatus } from "@/services/task.service";

import { useAuth } from "@/context/Authcontext";

import { BoardData } from "@/types/board";
import {
  Task,
  TaskStatus,
} from "@/types/task";

const columns = [
  {
    key: "todo",
    title: "Todo",
  },
  {
    key: "committed",
    title: "Committed",
  },
  {
    key: "active",
    title: "Active",
  },
  {
    key: "in_progress",
    title: "In Progress",
  },
  {
    key: "in_review",
    title: "In Review",
  },
  {
    key: "done",
    title: "Done",
  },
] as const;

type ColumnKey = (typeof columns)[number]["key"];

// BOARD CONTENT
function BoardContent() {
  const searchParams = useSearchParams();
  const sprintId = searchParams.get("sprintId");

  const { user } = useAuth();

  const [showCreateModal, setShowCreateModal] = useState(false);

  const [board, setBoard] = useState<BoardData | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [draggedTask, setDraggedTask] =
    useState<Task | null>(null);

  const [dragOverColumn, setDragOverColumn] =
    useState<ColumnKey | null>(null);

 // Load Board
  useEffect(() => {
    if (!sprintId) {
      setError("Sprint ID is missing");
      setLoading(false);
      return;
    }

    const loadBoard = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getBoard(sprintId);

        setBoard(data);
      } catch (err) {
        console.error("Failed to load board:", err);

        setError("Failed to load board");
      } finally {
        setLoading(false);
      }
    };

    loadBoard();
  }, [sprintId]);

 // Drag start
  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    task: Task
  ) => {
    setDraggedTask(task);

    event.dataTransfer.effectAllowed = "move";

    event.dataTransfer.setData(
      "text/plain",
      task.id
    );
  };

  // Drag Over
  const handleDragOver = (
    event: DragEvent<HTMLDivElement>,
    column: ColumnKey
  ) => {
    event.preventDefault();

    event.dataTransfer.dropEffect = "move";

    setDragOverColumn(column);
  };

  // drag Leave
  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  //Drop
  const handleDrop = async (
    event: DragEvent<HTMLDivElement>,
    destination: ColumnKey
  ) => {
    event.preventDefault();

    setDragOverColumn(null);

    if (!draggedTask) {
      return;
    }

    const currentStatus = draggedTask.status;

    const newStatus = destination as TaskStatus;

    // Don't call API if task is dropped
    // into the same column.
    if (currentStatus === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      // Update backend
      await updateTaskStatus(
        draggedTask.id,
        newStatus
      );

      // Update frontend immediately
      setBoard((previousBoard) => {
        if (!previousBoard) {
          return previousBoard;
        }

        const updatedTask: Task = {
          ...draggedTask,
          status: newStatus,
        };

        const updatedBoard: BoardData = {
          project_id: previousBoard.project_id,

          todo: [...previousBoard.todo],

          committed: [
            ...previousBoard.committed,
          ],

          active: [
            ...previousBoard.active,
          ],

          in_progress: [
            ...previousBoard.in_progress,
          ],

          in_review: [
            ...previousBoard.in_review,
          ],

          done: [
            ...previousBoard.done,
          ],
        };

        const taskColumns: ColumnKey[] = [
          "todo",
          "committed",
          "active",
          "in_progress",
          "in_review",
          "done",
        ];

        // Remove task from every column
        taskColumns.forEach((key) => {
          updatedBoard[key] =
            updatedBoard[key].filter(
              (task) =>
                task.id !== draggedTask.id
            );
        });

        // Add task to destination column
        updatedBoard[destination].push(
          updatedTask
        );

        return updatedBoard;
      });
    } catch (err) {
      console.error(
        "Failed to update task status:",
        err
      );

      alert(
        "Failed to update task status"
      );
    } finally {
      setDraggedTask(null);
    }
  };


  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-slate-500">
          Loading board...
        </p>
      </main>
    );
  }

 // Error
  if (error) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-red-500">
          {error}
        </p>
      </main>
    );
  }

  if (!board) {
    return null;
  }

  // Project Id
  const projectId =
    board.project_id ||
    columns
      .flatMap(
        (column) =>
          board[column.key] ?? []
      )
      .find(
        (task) => task.project_id
      )?.project_id ||
    "";

  // Main UI
  return (
    <main className="min-h-screen bg-slate-50 p-6">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Sprint Board
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track your sprint tasks
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setShowCreateModal(true)
          }
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          + Create Task
        </button>
      </div>

      {/* Board */}
      <div className="flex gap-4 overflow-x-auto pb-6">

        {columns.map((column) => {
          const tasks =
            board[column.key] ?? [];

          const isDragOver =
            dragOverColumn === column.key;

          return (
            <div
              key={column.key}
              className="w-[280px] min-w-[280px]"
            >

              {/* Column Header */}
              <div className="mb-3 flex items-center justify-between">

                <h2 className="font-semibold text-slate-800">
                  {column.title}
                </h2>

                <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {tasks.length}
                </span>

              </div>

              {/* Drop Zone */}
              <div
                onDragOver={(event) =>
                  handleDragOver(
                    event,
                    column.key
                  )
                }
                onDragLeave={
                  handleDragLeave
                }
                onDrop={(event) =>
                  handleDrop(
                    event,
                    column.key
                  )
                }
                className={`
                  min-h-[500px]
                  rounded-xl
                  p-3
                  transition
                  ${
                    isDragOver
                      ? "bg-blue-100 ring-2 ring-blue-400"
                      : "bg-slate-100"
                  }
                `}
              >

                <div className="space-y-3">

                  {tasks.map((task) => (
                    <TaskCard
                      key={
                        task.id ||
                        task.task_number
                      }
                      task={task}
                      onDragStart={
                        handleDragStart
                      }
                    />
                  ))}

                  {tasks.length === 0 && (
                    <div className="flex min-h-[120px] items-center justify-center rounded-lg border border-dashed border-slate-300">
                      <p className="text-sm text-slate-400">
                        {isDragOver
                          ? "Drop task here"
                          : "No tasks"}
                      </p>
                    </div>
                  )}

                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* Create Task Modal */}
      {showCreateModal &&
        sprintId &&
        user?.id && (
          <CreateTaskModule
            sprintId={sprintId}
            projectId={projectId}
            createdById={user.id}
            onClose={() =>
              setShowCreateModal(false)
            }
            onCreated={async () => {
              setShowCreateModal(false);

              try {
                const data =
                  await getBoard(
                    sprintId
                  );

                setBoard(data);
              } catch (err) {
                console.error(
                  "Failed to refresh board:",
                  err
                );
              }
            }}
          />
        )}

    </main>
  );
}

// Page
export default function BoardPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <main className="min-h-screen bg-slate-50 p-6">
            <p className="text-slate-500">
              Loading Sprint Board...
            </p>
          </main>
        }
      >
        <BoardContent />
      </Suspense>
    </ProtectedRoute>
  );
}

// Task card
function TaskCard({
  task,
  onDragStart,
}: {
  task: Task;

  onDragStart: (
    event: DragEvent<HTMLDivElement>,
    task: Task
  ) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(event) =>
        onDragStart(event, task)
      }
      className="
        cursor-grab
        rounded-lg
        border
        bg-white
        p-4
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:shadow-md
        active:cursor-grabbing
      "
    >

      {/* Task Number */}
      <p className="text-xs font-medium text-slate-400">
        {task.task_number}
      </p>

      {/* Title */}
      <h3 className="mt-1 font-semibold text-slate-800">
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
          {task.description}
        </p>
      )}

      {/* Bottom */}
      <div className="mt-4 flex items-center justify-between">

        {/* Priority */}
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize">
          {task.priority}
        </span>

        {/* Assignee */}
        {task.assignee?.name && (
          <div
            className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-medium text-white"
            title={task.assignee.name}
          >
            {task.assignee.name
              .charAt(0)
              .toUpperCase()}
          </div>
        )}

      </div>

    </div>
  );
}