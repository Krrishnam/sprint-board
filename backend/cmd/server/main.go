package main

import (
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/Krrishnam/sprint-board/backend/internal/config"
	"github.com/Krrishnam/sprint-board/backend/internal/database"
	"github.com/Krrishnam/sprint-board/backend/internal/routes"
)

func main() {

	cfg := config.LoadConfig()

	database.Connect(cfg)
	database.AutoMigrate()
	router := routes.SetupRouter(cfg)

	router.Run()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Sprint Board API is running",
		})
	})

	log.Println("Server running on port", cfg.AppPort)

	router.Run(":" + cfg.AppPort)
}
