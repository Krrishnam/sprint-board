package services

import (
	"errors"
	"time"

	"github.com/google/uuid"

	"github.com/Krrishnam/sprint-board/backend/internal/dto"
	"github.com/Krrishnam/sprint-board/backend/internal/models"
	"github.com/Krrishnam/sprint-board/backend/internal/repositories"
)

type SprintService struct {
	sprintRepo  *repositories.SprintRepository
	projectRepo *repositories.ProjectRepositry
}

func NewSprintService(
	sprintRepo *repositories.SprintRepository,
	projectRepo *repositories.ProjectRepositry,
) *SprintService {
	return &SprintService{
		sprintRepo:  sprintRepo,
		projectRepo: projectRepo,
	}
}

// Create Sprint
func (s *SprintService) CreateSprint(req dto.CreateSprintRequest) error {

	// Check if project exists
	_, err := s.projectRepo.GetByID(req.ProjectID)
	if err != nil {
		return errors.New("project not found")
	}

	// Check duplicate sprint
	_, err = s.sprintRepo.GetByName(req.Name)
	if err == nil {
		return errors.New("sprint already exists")
	}

	// Parse UUID
	projectID, err := uuid.Parse(req.ProjectID)
	if err != nil {
		return errors.New("invalid project id")
	}

	// Parse Dates
	startDate, err := time.Parse("2006-01-02", req.StartDate)
	if err != nil {
		return errors.New("invalid start date")
	}

	endDate, err := time.Parse("2006-01-02", req.EndDate)
	if err != nil {
		return errors.New("invalid end date")
	}

	// Validate Dates
	if endDate.Before(startDate) {
		return errors.New("end date cannot be before start date")
	}

	// Validate Status
	switch req.Status {
	case "", "planned", "active", "closed":
	default:
		return errors.New("invalid sprint status")
	}

	status := models.SprintPlanned

	if req.Status != "" {
		status = models.SprintStatus(req.Status)
	}

	sprint := models.Sprint{
		Name:       req.Name,
		Goal:       req.Goal,
		StartDate:  startDate,
		EndDate:    endDate,
		Status:     status,
		ProjectID:  projectID,
	}

	return s.sprintRepo.Create(&sprint)
}

// Get All Sprints
func (s *SprintService) GetAllSprints() ([]models.Sprint, error) {
	return s.sprintRepo.GetAll()
}

// Get Sprint By ID
func (s *SprintService) GetSprintByID(id string) (*models.Sprint, error) {
	return s.sprintRepo.GetByID(id)
}

// Update Sprint
func (s *SprintService) UpdateSprint(id string, req dto.UpdateSprintRequest) error {

	sprint, err := s.sprintRepo.GetByID(id)
	if err != nil {
		return errors.New("sprint not found")
	}

	if req.Name != "" {
		sprint.Name = req.Name
	}

	if req.Goal != "" {
		sprint.Goal = req.Goal
	}

	if req.StartDate != "" {

		startDate, err := time.Parse("2006-01-02", req.StartDate)

		if err != nil {
			return errors.New("invalid start date")
		}

		sprint.StartDate = startDate
	}

	if req.EndDate != "" {

		endDate, err := time.Parse("2006-01-02", req.EndDate)

		if err != nil {
			return errors.New("invalid end date")
		}

		sprint.EndDate = endDate
	}

	if sprint.EndDate.Before(sprint.StartDate) {
		return errors.New("end date cannot be before start date")
	}

	if req.Status != "" {

		switch req.Status {
		case "planned", "active", "closed":
			sprint.Status = models.SprintStatus(req.Status)

		default:
			return errors.New("invalid sprint status")
		}
	}

	return s.sprintRepo.Update(sprint)
}

// Delete Sprint
func (s *SprintService) DeleteSprint(id string) error {

	sprint, err := s.sprintRepo.GetByID(id)

	if err != nil {
		return errors.New("sprint not found")
	}

	return s.sprintRepo.Delete(sprint)
}