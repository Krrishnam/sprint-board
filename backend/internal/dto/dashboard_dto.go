package dto

type DashboardResponse struct {
	TotalTasks     int `json:"total_tasks"`
	TodoTasks      int `json:"todo_tasks"`
	InProgressTasks int `json:"in_progress_tasks"`
	InReviewTasks   int `json:"in_review_tasks"`
	CompletedTasks  int `json:"completed_tasks"`

	ActiveSprint *SprintSummary `json:"active_sprint"`
}

type SprintSummary struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
