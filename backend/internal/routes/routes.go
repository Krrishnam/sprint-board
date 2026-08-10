package routes

import (
	"github.com/Krrishnam/sprint-board/backend/internal/config"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter(cfg *config.Config) *gin.Engine {
	router := gin.Default()
	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:3000"},
		AllowMethods: []string{
			"GET",
			"POST",
			"PUT",
			"PATCH",
			"DELETE",
			"OPTIONS",
		},
		AllowHeaders: []string{
			"Origin",
			"Content-Type",
			"Authorization",
		},
		AllowCredentials: true,
	}))
	api := router.Group("/api/v1")
	{
		RegisterAuthRoutes(api, cfg)
		RegisterTeamRoutes(api)
		RegisterProjectRoutes(api)
		RegisterSprintRoutes(api)
		RegisterTaskRoutes(api)
		RegisterBoardRoutes(api)
		RegisterDashboardRoutes(api)
	}
	return router
}
