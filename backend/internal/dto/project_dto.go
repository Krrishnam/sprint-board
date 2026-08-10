package dto

type CreateProjectRequest struct {
	Name        string `json:"name" binding:"required,min=3,max=100"`
	Description string `json:"description"`
	TeamID      string `json:"team_id" binding:"required"`
}

type UpdateProjectRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

type ProjectResponse struct {
	ID          string `json:"id"`
	Name        string `json:"name"`
	Description string `json:"description"`
	TeamID      string `json:"team_id"`
}