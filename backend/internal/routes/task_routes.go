package routes

import (
	"github.com/Krrishnam/sprint-board/backend/internal/database"
	"github.com/Krrishnam/sprint-board/backend/internal/handlers"
	"github.com/Krrishnam/sprint-board/backend/internal/repositories"
	"github.com/Krrishnam/sprint-board/backend/internal/services"

	"github.com/gin-gonic/gin"
)

func RegisterTaskRoutes(router *gin.RouterGroup) {

	taskRepo := repositories.NewTaskRepository(database.DB)
	projectRepo := repositories.NewProjectRepository(database.DB)
	sprintRepo := repositories.NewSprintRepository(database.DB)
	userRepo := repositories.NewUserRepository(database.DB)

	taskService := services.NewTaskService(
		taskRepo,
		projectRepo,
		sprintRepo,
		userRepo,
	)

	taskHandler := handlers.NewTaskHandler(taskService)

	tasks := router.Group("/tasks")
	{
		tasks.POST("", taskHandler.CreateTask)
		tasks.GET("", taskHandler.GetTasks)
		tasks.GET("/:id", taskHandler.GetTaskByID)
		tasks.PUT("/:id", taskHandler.UpdateTask)
		tasks.PATCH("/:id/status", taskHandler.UpdateTaskStatus)
		tasks.DELETE("/:id", taskHandler.DeleteTask)
	}
}