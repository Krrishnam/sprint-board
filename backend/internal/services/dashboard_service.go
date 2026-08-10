package services

import (
	"github.com/Krrishnam/sprint-board/backend/internal/dto"
	"github.com/Krrishnam/sprint-board/backend/internal/models"
	"github.com/Krrishnam/sprint-board/backend/internal/repositories"
)

type DashboardService struct {
	taskRepo   *repositories.TaskRepository
	sprintRepo *repositories.SprintRepository
}

func NewDashboardService(
	taskRepo *repositories.TaskRepository,
	sprintRepo *repositories.SprintRepository,
) *DashboardService {
	return &DashboardService{
		taskRepo:   taskRepo,
		sprintRepo: sprintRepo,
	}
}

func (s *DashboardService) GetDashboard() (*dto.DashboardResponse, error) {

	total, err := s.taskRepo.CountAll()
	if err != nil {
		return nil, err
	}

	todo, err := s.taskRepo.CountByStatus(models.TaskTodo)
	if err != nil {
		return nil, err
	}

	inProgress, err := s.taskRepo.CountByStatus(models.TaskInProgress)
	if err != nil {
		return nil, err
	}

	inReview, err := s.taskRepo.CountByStatus(models.TaskInReview)
	if err != nil {
		return nil, err
	}

	completed, err := s.taskRepo.CountByStatus(models.TaskDone)
	if err != nil {
		return nil, err
	}

	response := &dto.DashboardResponse{
		TotalTasks:      int(total),
		TodoTasks:       int(todo),
		InProgressTasks: int(inProgress),
		InReviewTasks:   int(inReview),
		CompletedTasks:  int(completed),
	}

	sprint, err := s.sprintRepo.GetActive()

	if err == nil {
		response.ActiveSprint = &dto.SprintSummary{
			ID:   sprint.ID.String(),
			Name: sprint.Name,
		}
	}

	return response, nil
}