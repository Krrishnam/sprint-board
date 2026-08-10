package handlers

import (
	"net/http"

	"github.com/Krrishnam/sprint-board/backend/internal/dto"
	"github.com/Krrishnam/sprint-board/backend/internal/services"

	"github.com/gin-gonic/gin"
)

type SprintHandler struct {
	sprintService *services.SprintService
}

func NewSprintHandler(sprintService *services.SprintService) *SprintHandler {
	return &SprintHandler{
		sprintService: sprintService,
	}
}

// POST /sprints
func (h *SprintHandler) CreateSprint(c *gin.Context) {

	var req dto.CreateSprintRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	err := h.sprintService.CreateSprint(req)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Sprint created successfully",
	})
}

// GET /sprints
func (h *SprintHandler) GetSprints(c *gin.Context) {

	sprints, err := h.sprintService.GetAllSprints()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, sprints)
}

// GET /sprints/:id
func (h *SprintHandler) GetSprintByID(c *gin.Context) {

	id := c.Param("id")

	sprint, err := h.sprintService.GetSprintByID(id)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, sprint)
}

// PUT /sprints/:id
func (h *SprintHandler) UpdateSprint(c *gin.Context) {

	id := c.Param("id")

	var req dto.UpdateSprintRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	err := h.sprintService.UpdateSprint(id, req)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Sprint updated successfully",
	})
}

// DELETE /sprints/:id
func (h *SprintHandler) DeleteSprint(c *gin.Context) {

	id := c.Param("id")

	err := h.sprintService.DeleteSprint(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Sprint deleted successfully",
	})
}