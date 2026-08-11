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
import {
  getTasks,
  updateTaskStatus,
} from "@/services/task.service";

import { useAuth } from "@/context/Authcontext";

import api from "@/lib/axios";

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

type Project = {
  id: string;
  name: string;
  team_id: string;
};

type Team = {
  id: string;
  name: string;
};

function createEmptyBoard(): BoardData {
  return {
    project_id: "",
    todo: [],
    committed: [],
    active: [],
    in_progress: [],
    in_review: [],
    done: [],
  };
}

function BoardContent() {
  const searchParams = useSearchParams();

  const sprintId = searchParams.get("sprintId");
  const teamId = searchParams.get("teamId");

  const { user } = useAuth();

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [board, setBoard] =
    useState<BoardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [team, setTeam] =
    useState<Team | null>(null);

  const [draggedTask, setDraggedTask] =
    useState<Task | null>(null);

  const [dragOverColumn, setDragOverColumn] =
    useState<ColumnKey | null>(null);

  /*
   * LOAD BOARD
   *
   * Two modes:
   *
   * 1. sprintId exists
   *    → existing sprint board
   *
   * 2. teamId exists
   *    → show only tasks belonging to that team
   */
  useEffect(() => {
    const loadBoard = async () => {
      try {
        setLoading(true);
        setError("");

        /*
         * EXISTING SPRINT BOARD
         */
        if (sprintId) {
          const data = await getBoard(sprintId);

          setBoard(data);

          return;
        }

        /*
         * TEAM BOARD
         */
        if (teamId) {
          const [
            teamsResponse,
            projectsResponse,
            tasks,
          ] = await Promise.all([
            api.get("/teams"),
            api.get("/projects"),
            getTasks(),
          ]);

          const teamsData = teamsResponse.data;

          const projectsData = projectsResponse.data;

          const selectedTeam = teamsData.find(
            (item: any) =>
              (item.id ?? item.ID) === teamId
          );

          if (!selectedTeam) {
            setError("Team not found.");
            return;
          }

          setTeam({
            id: selectedTeam.id ?? selectedTeam.ID,
            name:
              selectedTeam.name ??
              selectedTeam.Name,
          });

          /*
           * Projects belonging to selected team
           */
          const teamProjects: Project[] =
            projectsData
              .map((project: any) => ({
                id:
                  project.id ??
                  project.ID,

                name:
                  project.name ??
                  project.Name,

                team_id:
                  project.team_id ??
                  project.TeamID,
              }))
              .filter(
                (project: Project) =>
                  project.team_id === teamId
              );

          const teamProjectIds =
            new Set(
              teamProjects.map(
                (project) => project.id
              )
            );

          /*
           * Only tasks whose project belongs
           * to selected team.
           */
          const teamTasks = tasks.filter(
            (task) =>
              task.project_id &&
              teamProjectIds.has(
                task.project_id
              )
          );

          const teamBoard = createEmptyBoard();

          teamTasks.forEach((task) => {
            const status =
              task.status as ColumnKey;

            if (
              status in teamBoard &&
              Array.isArray(
                teamBoard[status]
              )
            ) {
              teamBoard[status].push(task);
            }
          });

          setBoard(teamBoard);

          return;
        }

        /*
         * Nothing selected
         */
        setError(
          "Please select a team or sprint."
        );
      } catch (err) {
        console.error(
          "Failed to load board:",
          err
        );

        setError("Failed to load board");
      } finally {
        setLoading(false);
      }
    };

    loadBoard();
  }, [sprintId, teamId]);

  /*
   * DRAG START
   */
  const handleDragStart = (
    event: DragEvent<HTMLDivElement>,
    task: Task
  ) => {
    setDraggedTask(task);

    event.dataTransfer.effectAllowed =
      "move";

    event.dataTransfer.setData(
      "text/plain",
      task.id
    );
  };

  /*
   * DRAG OVER
   */
  const handleDragOver = (
    event: DragEvent<HTMLDivElement>,
    column: ColumnKey
  ) => {
    event.preventDefault();

    event.dataTransfer.dropEffect =
      "move";

    setDragOverColumn(column);
  };

  /*
   * DRAG LEAVE
   */
  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  /*
   * DROP
   */
  const handleDrop = async (
    event: DragEvent<HTMLDivElement>,
    destination: ColumnKey
  ) => {
    event.preventDefault();

    setDragOverColumn(null);

    if (!draggedTask) {
      return;
    }

    const currentStatus =
      draggedTask.status;

    const newStatus =
      destination as TaskStatus;

    if (currentStatus === newStatus) {
      setDraggedTask(null);
      return;
    }

    try {
      await updateTaskStatus(
        draggedTask.id,
        newStatus
      );

      setBoard((previousBoard) => {
        if (!previousBoard) {
          return previousBoard;
        }

        const updatedTask: Task = {
          ...draggedTask,
          status: newStatus,
        };

        const updatedBoard: BoardData = {
          project_id:
            previousBoard.project_id,

          todo: [
            ...previousBoard.todo,
          ],

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

        /*
         * Remove task from old column
         */
        taskColumns.forEach((key) => {
          updatedBoard[key] =
            updatedBoard[key].filter(
              (task) =>
                task.id !==
                draggedTask.id
            );
        });

        /*
         * Add task to new column
         */
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

  /*
   * LOADING
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-6">
        <p className="text-slate-500">
          Loading board...
        </p>
      </main>
    );
  }

  /*
   * ERROR
   */
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

  /*
   * PROJECT ID
   */
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

  return (
    <main className="min-h-screen bg-slate-50 p-6">

      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {team
              ? `${team.name} Sprint Board`
              : "Sprint Board"}
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            {team
              ? `Tasks for ${team.name}`
              : "Manage and track your sprint tasks"}
          </p>
        </div>

        {/* Create task only for a real sprint board */}
        {sprintId &&
          user?.id && (
            <button
              type="button"
              onClick={() =>
                setShowCreateModal(true)
              }
              className="cursor-pointer rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              + Create Task
            </button>
          )}
      </div>

      {/* BOARD */}
      <div className="flex gap-4 overflow-x-auto pb-6">

        {columns.map((column) => {
          const tasks =
            board[column.key] ?? [];

          const isDragOver =
            dragOverColumn ===
            column.key;

          return (
            <div
              key={column.key}
              className="w-[280px] min-w-[280px]"
            >

              {/* COLUMN HEADER */}
              <div className="mb-3 flex items-center justify-between">

                <h2 className="font-semibold text-slate-800">
                  {column.title}
                </h2>

                <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                  {tasks.length}
                </span>

              </div>

              {/* DROP ZONE */}
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

      {/* CREATE TASK */}
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

/*
 * PAGE
 */
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

/*
 * TASK CARD
 */
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

      {/* TASK NUMBER */}
      <p className="text-xs font-medium text-slate-400">
        {task.task_number}
      </p>

      {/* TITLE */}
      <h3 className="mt-1 font-semibold text-slate-800">
        {task.title}
      </h3>

      {/* DESCRIPTION */}
      {task.description && (
        <p className="mt-2 line-clamp-2 text-sm text-slate-500">
          {task.description}
        </p>
      )}

      {/* BOTTOM */}
      <div className="mt-4 flex items-center justify-between">

        {/* PRIORITY */}
        <span className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize">
          {task.priority}
        </span>

        {/* ASSIGNEE */}
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