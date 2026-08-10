package routes

import (
	"github.com/Krrishnam/sprint-board/backend/internal/database"
	"github.com/Krrishnam/sprint-board/backend/internal/handlers"
	"github.com/Krrishnam/sprint-board/backend/internal/repositories"
	"github.com/Krrishnam/sprint-board/backend/internal/services"

	"github.com/gin-gonic/gin"
)

func RegisterSprintRoutes(router *gin.RouterGroup) {

	sprintRepo := repositories.NewSprintRepository(database.DB)
	projectRepo := repositories.NewProjectRepository(database.DB)

	sprintService := services.NewSprintService(
		sprintRepo,
		projectRepo,
	)

	sprintHandler := handlers.NewSprintHandler(sprintService)

	sprints := router.Group("/sprints")
	{
		sprints.POST("", sprintHandler.CreateSprint)
		sprints.GET("", sprintHandler.GetSprints)
		sprints.GET("/:id", sprintHandler.GetSprintByID)
		sprints.PUT("/:id", sprintHandler.UpdateSprint)
		sprints.DELETE("/:id", sprintHandler.DeleteSprint)
	}
}