package models

import (
	"time"
	"github.com/google/uuid"
)

type TaskStatus string

const (
	TaskTodo       TaskStatus = "todo"
	TaskCommitted  TaskStatus = "committed"
	TaskActive     TaskStatus = "active"
	TaskInProgress TaskStatus = "in_progress"
	TaskInReview   TaskStatus = "in_review"
	TaskDone       TaskStatus = "done"
)

type TaskPriority string

const (
	PriorityLow      TaskPriority = "low"
	PriorityMedium   TaskPriority = "medium"
	PriorityHigh     TaskPriority = "high"
	PriorityCritical TaskPriority = "critical"
)

type Task struct {
	BaseModel

	TaskNumber string `gorm:"size:20;uniqueIndex;not null"`

	Title       string `gorm:"size:200;not null"`
	Description string `gorm:"type:text"`

	Status TaskStatus `gorm:"type:varchar(30);default:'todo'"`

	Priority TaskPriority `gorm:"type:varchar(20);default:'medium'"`

	StoryPoints int

	EstimatedHours int

	RemainingHours int

	DueDate *time.Time

	ProjectID uuid.UUID `gorm:"type:uuid;not null"`

	Project Project `gorm:"foreignKey:ProjectID"`

	Comments []Comment `gorm:"foreignKey:TaskID"`

	ActivityLogs []ActivityLog `gorm:"foreignKey:TaskID"`

	SprintID uuid.UUID `gorm:"type:uuid;not null"`

	Sprint Sprint `gorm:"foreignKey:SprintID"`

	AssigneeID *uuid.UUID `gorm:"type:uuid"`

	Assignee User `gorm:"foreignKey:AssigneeID"`

	CreatedByID uuid.UUID `gorm:"type:uuid;not null"`

	CreatedBy User `gorm:"foreignKey:CreatedByID"`
}