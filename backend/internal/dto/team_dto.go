package dto

type CreateTeamRequest struct {
	Name        string `json:"name" binding:"required,min=3,max=100"`
	Description string `json:"description"`
}

type UpdateTeamRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type TeamResponse struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
}