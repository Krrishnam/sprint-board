package dto

import "github.com/Krrishnam/sprint-board/backend/internal/models"

type BoardResponse struct {
	ProjectID  string        `json:"project_id"`
	Todo       []models.Task `json:"todo"`
	Committed  []models.Task `json:"committed"`
	Active     []models.Task `json:"active"`
	InProgress []models.Task `json:"in_progress"`
	InReview   []models.Task `json:"in_review"`
	Done       []models.Task `json:"done"`
}