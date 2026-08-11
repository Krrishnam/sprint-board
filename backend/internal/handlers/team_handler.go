package handlers

import (
	"net/http"

	"github.com/Krrishnam/sprint-board/backend/internal/dto"
	"github.com/Krrishnam/sprint-board/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type TeamHandler struct {
	teamService *services.TeamService
}

func NewTeamHandler(teamService *services.TeamService) *TeamHandler {
	return &TeamHandler{
		teamService: teamService,
	}
}

// POST /teams
func (h *TeamHandler) CreateTeam(c *gin.Context) {

	var req dto.CreateTeamRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	err := h.teamService.CreateTeam(req)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Team created successfully",
	})
}

// GET /teams
func (h *TeamHandler) GetTeams(c *gin.Context) {

	teams, err := h.teamService.GetAllTeams()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	// c.JSON(http.StatusOK, teams)
	response := make([]dto.TeamResponse, 0, len(teams))

	for _, team := range teams {
		response = append(response, dto.TeamResponse{
			ID:          team.ID.String(),
			Name:        team.Name,
			Description: team.Description,
		})
	}

	c.JSON(http.StatusOK, response)
}

// GET /teams/:id
func (h *TeamHandler) GetTeamByID(c *gin.Context) {

	id := c.Param("id")

	team, err := h.teamService.GetTeamByID(id)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dto.TeamResponse{
		ID:          team.ID.String(),
		Name:        team.Name,
		Description: team.Description,
	})
}

func (h *TeamHandler) UpdateTeam(c *gin.Context) {

	id := c.Param("id")

	var req dto.UpdateTeamRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	err := h.teamService.UpdateTeam(id, req)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Team updated successfully",
	})
}

// DELETE /teams/:id
func (h *TeamHandler) DeleteTeam(c *gin.Context) {

	id := c.Param("id")

	err := h.teamService.DeleteTeam(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Team deleted successfully",
	})
}
