package routes

import (
	"github.com/Krrishnam/sprint-board/backend/internal/database"
	"github.com/Krrishnam/sprint-board/backend/internal/handlers"
	"github.com/Krrishnam/sprint-board/backend/internal/repositories"
	"github.com/Krrishnam/sprint-board/backend/internal/services"

	"github.com/gin-gonic/gin"
)

func RegisterDashboardRoutes(router *gin.RouterGroup) {

	taskRepo := repositories.NewTaskRepository(database.DB)
	sprintRepo := repositories.NewSprintRepository(database.DB)

	dashboardService := services.NewDashboardService(
		taskRepo,
		sprintRepo,
	)

	dashboardHandler := handlers.NewDashboardHandler(
		dashboardService,
	)

	dashboard := router.Group("/dashboard")
	{
		dashboard.GET("", dashboardHandler.GetDashboard)
	}
}