package services

import (
	"errors"
	"time"

	"github.com/google/uuid"

	"github.com/Krrishnam/sprint-board/backend/internal/dto"
	"github.com/Krrishnam/sprint-board/backend/internal/models"
	"github.com/Krrishnam/sprint-board/backend/internal/repositories"
)

type TaskService struct {
	taskRepo    *repositories.TaskRepository
	projectRepo *repositories.ProjectRepositry
	sprintRepo  *repositories.SprintRepository
	userRepo    *repositories.UserRepository
}

func NewTaskService(
	taskRepo *repositories.TaskRepository,
	projectRepo *repositories.ProjectRepositry,
	sprintRepo *repositories.SprintRepository,
	userRepo *repositories.UserRepository,
) *TaskService {
	return &TaskService{
		taskRepo:    taskRepo,
		projectRepo: projectRepo,
		sprintRepo:  sprintRepo,
		userRepo:    userRepo,
	}
}


// CREATE TASK
func (s *TaskService) CreateTask(req dto.CreateTaskRequest) error {

	// Check duplicate task number
	_, err := s.taskRepo.GetByTaskNumber(req.TaskNumber)

	if err == nil {
		return errors.New("task number already exists")
	}

	// Check project exists
	_, err = s.projectRepo.GetByID(req.ProjectID)

	if err != nil {
		return errors.New("project not found")
	}

	// Check sprint exists
	_, err = s.sprintRepo.GetByID(req.SprintID)

	if err != nil {
		return errors.New("sprint not found")
	}

	// Check creator exists
	_, err = s.userRepo.GetByID(req.CreatedByID)

	if err != nil {
		return errors.New("creator not found")
	}

	// Parse UUIDs
	projectID, err := uuid.Parse(req.ProjectID)

	if err != nil {
		return errors.New("invalid project id")
	}

	sprintID, err := uuid.Parse(req.SprintID)

	if err != nil {
		return errors.New("invalid sprint id")
	}

	createdByID, err := uuid.Parse(req.CreatedByID)

	if err != nil {
		return errors.New("invalid creator id")
	}

	//  Assignee
	// var assigneeID uuid.UUID

	// if req.AssigneeID != "" {

	// 	_, err := s.userRepo.GetByID(req.AssigneeID)

	// 	if err != nil {
	// 		return errors.New("assignee not found")
	// 	}

	// 	assigneeID, err = uuid.Parse(req.AssigneeID)

	// 	if err != nil {
	// 		return errors.New("invalid assignee id")
	// 	}
	// }

	// Due Date
	var dueDate *time.Time

	if req.DueDate != "" {

		date, err := time.Parse(
			"2006-01-02",
			req.DueDate,
		)

		if err != nil {
			return errors.New("invalid due date")
		}

		dueDate = &date
	}

	// Status
	status := models.TaskTodo

	if req.Status != "" {

		switch req.Status {

		case "todo",
			"committed",
			"active",
			"in_progress",
			"in_review",
			"done":

			status = models.TaskStatus(req.Status)

		default:
			return errors.New("invalid task status")
		}
	}

	// Priority
	priority := models.PriorityMedium

	if req.Priority != "" {

		switch req.Priority {

		case "low",
			"medium",
			"high",
			"critical":

			priority = models.TaskPriority(req.Priority)

		default:
			return errors.New("invalid priority")
		}
	}

	// Create task model
	task := models.Task{
		TaskNumber: req.TaskNumber,
		Title:      req.Title,
		Description: req.Description,

		Status:   status,
		Priority: priority,

		StoryPoints:     req.StoryPoints,
		EstimatedHours:  req.EstimatedHours,
		RemainingHours:  req.RemainingHours,

		DueDate: dueDate,

		ProjectID:   projectID,
		SprintID:    sprintID,
		CreatedByID: createdByID,
		// AssigneeID: assigneeID,
	}

	return s.taskRepo.Create(&task)
}


// GET ALL TASKS
func (s *TaskService) GetAllTasks() ([]models.Task, error) {
	return s.taskRepo.GetAll()
}


// GET TASK BY ID
func (s *TaskService) GetTaskByID(
	id string,
) (*models.Task, error) {

	return s.taskRepo.GetByID(id)
}


// UPDATE TASK STATUS
// Used by Sprint Board Drag & Drop
func (s *TaskService) UpdateTaskStatus(id string, status string) error {

	switch status {
	case "todo",
		"committed",
		"active",
		"in_progress",
		"in_review",
		"done":
	default:
		return errors.New("invalid task status")
	}

	_, err := s.taskRepo.GetByID(id)
	if err != nil {
		return errors.New("task not found")
	}

	return s.taskRepo.UpdateStatus(id, status)
}

// UPDATE TASK
// Used for normal task editing
func (s *TaskService) UpdateTask(
	id uuid.UUID,
	req dto.UpdateTaskRequest,
) (*models.Task, error) {

	// Find task
	task, err := s.taskRepo.GetByID(id.String())

	if err != nil {
		return nil, errors.New("task not found")
	}

	// Title
	if req.Title != nil {
		task.Title = *req.Title
	}

	// Description
	if req.Description != nil {
		task.Description = *req.Description
	}

	// Status
	if req.Status != nil {

		switch *req.Status {

		case "todo",
			"committed",
			"active",
			"in_progress",
			"in_review",
			"done":

			task.Status = models.TaskStatus(*req.Status)

		default:
			return nil, errors.New("invalid task status")
		}
	}

	// Priority
	if req.Priority != nil {

		switch *req.Priority {

		case "low",
			"medium",
			"high",
			"critical":

			task.Priority = models.TaskPriority(*req.Priority)

		default:
			return nil, errors.New("invalid priority")
		}
	}

	// Story Points
	if req.StoryPoints != nil {
		task.StoryPoints = *req.StoryPoints
	}

	// Estimated Hours
	if req.EstimatedHours != nil {
		task.EstimatedHours = *req.EstimatedHours
	}

	// Remaining Hours
	if req.RemainingHours != nil {
		task.RemainingHours = *req.RemainingHours
	}

	// Due Date
	if req.DueDate != nil {
		task.DueDate = req.DueDate
	}

	// Assignee
	if req.AssigneeID != nil {

		_, err := s.userRepo.GetByID(
			req.AssigneeID.String(),
		)

		if err != nil {
			return nil, errors.New("assignee not found")
		}

		task.AssigneeID = req.AssigneeID
	}

	// Save task
	err = s.taskRepo.Update(task)

	if err != nil {
		return nil, err
	}

	return task, nil
}


// DELETE TASK
func (s *TaskService) DeleteTask(
	id uuid.UUID,
) error {

	return s.taskRepo.Delete(
		id.String(),
	)
}