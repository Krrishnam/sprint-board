package dto

import(
	"time"
	"github.com/google/uuid"
	"github.com/Krrishnam/sprint-board/backend/internal/models"
)

type CreateTaskRequest struct {
	TaskNumber      string `json:"task_number" binding:"required"`
	Title           string `json:"title" binding:"required"`
	Description     string `json:"description"`

	Status          string `json:"status"`
	Priority        string `json:"priority"`

	StoryPoints     int    `json:"story_points"`
	EstimatedHours  int    `json:"estimated_hours"`
	RemainingHours  int    `json:"remaining_hours"`

	DueDate         string `json:"due_date"`

	ProjectID       string `json:"project_id" binding:"required"`
	SprintID        string `json:"sprint_id" binding:"required"`
	AssigneeID      string `json:"assignee_id"`
	CreatedByID     string `json:"created_by_id" binding:"required"`
}

type UpdateTaskRequest struct {
    Title           *string         `json:"title"`
    Description     *string         `json:"description"`
    Status          *models.TaskStatus   `json:"status"`
    Priority        *models.TaskPriority  `json:"priority"`
    StoryPoints     *int            `json:"story_points"`
    EstimatedHours  *int            `json:"estimated_hours"`
    RemainingHours  *int            `json:"remaining_hours"`
    DueDate         *time.Time      `json:"due_date"`
    AssigneeID      *uuid.UUID      `json:"assignee_id"`
}