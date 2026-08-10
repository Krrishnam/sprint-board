package routes

import (
	"github.com/Krrishnam/sprint-board/backend/internal/database"
	"github.com/Krrishnam/sprint-board/backend/internal/handlers"
	"github.com/Krrishnam/sprint-board/backend/internal/repositories"
	"github.com/Krrishnam/sprint-board/backend/internal/services"

	"github.com/gin-gonic/gin"
)

func RegisterBoardRoutes(router *gin.RouterGroup) {

	taskRepo := repositories.NewTaskRepository(database.DB)
	sprintRepo := repositories.NewSprintRepository(database.DB)

	boardService := services.NewBoardService(taskRepo, sprintRepo)

	boardHandler := handlers.NewBoardHandler(boardService)

	board := router.Group("/board")
	{
		board.GET("/:sprintId", boardHandler.GetBoard)
	}
}