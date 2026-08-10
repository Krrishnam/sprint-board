package routes

import (
	"github.com/Krrishnam/sprint-board/backend/internal/config"
	"github.com/Krrishnam/sprint-board/backend/internal/database"
	"github.com/Krrishnam/sprint-board/backend/internal/handlers"
	"github.com/Krrishnam/sprint-board/backend/internal/repositories"
	"github.com/Krrishnam/sprint-board/backend/internal/services"

	"github.com/gin-gonic/gin"
)

func RegisterAuthRoutes(router *gin.RouterGroup, cfg *config.Config) {

	userRepo := repositories.NewUserRepository(database.DB)

	authService := services.NewAuthService(userRepo, cfg)

	authHandler := handlers.NewAuthHandler(authService)

	auth := router.Group("/auth")
	{
		auth.POST("/register", authHandler.Register)
		auth.POST("/login", authHandler.Login)
	}
}