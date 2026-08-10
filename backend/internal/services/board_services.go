package services

import (
	"github.com/Krrishnam/sprint-board/backend/internal/dto"
	"github.com/Krrishnam/sprint-board/backend/internal/models"
	"github.com/Krrishnam/sprint-board/backend/internal/repositories"
)

type BoardService struct {
	taskRepo   *repositories.TaskRepository
	sprintRepo *repositories.SprintRepository
}

func NewBoardService(taskRepo *repositories.TaskRepository, sprintRepo *repositories.SprintRepository) *BoardService {
	return &BoardService{
		taskRepo:   taskRepo,
		sprintRepo: sprintRepo,
	}
}

func (s *BoardService) GetBoard(sprintID string) (*dto.BoardResponse, error) {

	sprint, err := s.sprintRepo.GetByID(sprintID)

	if err != nil {
		return nil, err
	}

	tasks, err := s.taskRepo.GetTasksBySprint(sprintID)

	if err != nil {
		return nil, err
	}

	board := &dto.BoardResponse{
		ProjectID: sprint.ProjectID.String(),
	}

	for _, task := range tasks {

		switch task.Status {

		case models.TaskTodo:
			board.Todo = append(board.Todo, task)

		case models.TaskCommitted:
			board.Committed = append(board.Committed, task)

		case models.TaskActive:
			board.Active = append(board.Active, task)

		case models.TaskInProgress:
			board.InProgress = append(board.InProgress, task)

		case models.TaskInReview:
			board.InReview = append(board.InReview, task)

		case models.TaskDone:
			board.Done = append(board.Done, task)
		}
	}

	return board, nil
}