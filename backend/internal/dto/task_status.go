package dto

type UpdateTaskStatusRequest struct {
	Status string `json:"status" binding:"required"`
}
