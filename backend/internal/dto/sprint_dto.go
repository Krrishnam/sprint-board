package dto

type CreateSprintRequest struct {
	Name        string `json:"name" binding:"required,min=3,max=100"`
	Goal        string `json:"goal"`
	StartDate   string `json:"start_date" binding:"required"`
	EndDate     string `json:"end_date" binding:"required"`
	Status      string `json:"status"`
	ProjectID   string `json:"project_id" binding:"required"`
}

type UpdateSprintRequest struct {
	Name      string `json:"name"`
	Goal      string `json:"goal"`
	StartDate string `json:"start_date"`
	EndDate   string `json:"end_date"`
	Status    string `json:"status"`
}

type SprintResponse struct {
	ID         string `json:"id"`
	Name       string `json:"name"`
	Goal       string `json:"goal"`
	StartDate  string `json:"start_date"`
	EndDate    string `json:"end_date"`
	Status     string `json:"status"`
	ProjectID  string `json:"project_id"`
}