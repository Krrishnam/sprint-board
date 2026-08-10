package routes

import (
	"github.com/Krrishnam/sprint-board/backend/internal/database"
	"github.com/Krrishnam/sprint-board/backend/internal/handlers"
	"github.com/Krrishnam/sprint-board/backend/internal/repositories"
	"github.com/Krrishnam/sprint-board/backend/internal/services"

	"github.com/gin-gonic/gin"
)

func RegisterTeamRoutes(router *gin.RouterGroup) {

	teamRepo := repositories.NewTeamRepository(database.DB)

	teamService := services.NewTeamService(teamRepo)

	teamHandler := handlers.NewTeamHandler(teamService)

	teams := router.Group("/teams")
	{
		teams.POST("", teamHandler.CreateTeam)
		teams.GET("", teamHandler.GetTeams)
		teams.GET("/:id", teamHandler.GetTeamByID)
		teams.PUT("/:id", teamHandler.UpdateTeam)
		teams.DELETE("/:id", teamHandler.DeleteTeam)
	}
}