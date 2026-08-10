package routes

import (
	"github.com/Krrishnam/sprint-board/backend/internal/database"
	"github.com/Krrishnam/sprint-board/backend/internal/handlers"
	"github.com/Krrishnam/sprint-board/backend/internal/repositories"
	"github.com/Krrishnam/sprint-board/backend/internal/services"

	"github.com/gin-gonic/gin"
)

func RegisterProjectRoutes(router *gin.RouterGroup){
	projectRepo := repositories.NewProjectRepository(database.DB)
	teampRepo := repositories.NewTeamRepository(database.DB)

	projectService := services.NewProjectService(projectRepo,teampRepo)

	projectHandler := handlers.NewProjectHandler(projectService)
	
	projects := router.Group("/projects")
	{
		projects.POST("",projectHandler.CreateProject)
		projects.GET("",projectHandler.GetProjects)
		projects.GET("/:id",projectHandler.GetProjectByID)
		projects.PUT("/:id",projectHandler.UpdateProject)
		projects.DELETE("/:id",projectHandler.DeleteProject)
	}
}