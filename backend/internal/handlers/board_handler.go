package handlers

import (
	"net/http"

	"github.com/Krrishnam/sprint-board/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type BoardHandler struct {
	boardService *services.BoardService
}

func NewBoardHandler(boardService *services.BoardService) *BoardHandler {
	return &BoardHandler{
		boardService: boardService,
	}
}

// GET /board/:sprintId
func (h *BoardHandler) GetBoard(c *gin.Context) {

	sprintID := c.Param("sprintId")

	board, err := h.boardService.GetBoard(sprintID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, board)
}