package handlers

import (
	"net/http"

	"github.com/Krrishnam/sprint-board/backend/internal/dto"
	"github.com/Krrishnam/sprint-board/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type ProjectHandler struct {
	projectService *services.ProjectService
}

func NewProjectHandler(projectService *services.ProjectService) *ProjectHandler {
	return &ProjectHandler{
		projectService: projectService,
	}
}

// POST /projects
func (h *ProjectHandler) CreateProject(c *gin.Context) {

	var req dto.CreateProjectRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.projectService.CreateProject(req)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Project created successfully",
	})
}

// GET /projects
func (h *ProjectHandler) GetProjects(c *gin.Context) {

	projects, err := h.projectService.GetAllProjects()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, projects)
}

// GET /projects/:id
func (h *ProjectHandler) GetProjectByID(c *gin.Context) {

	id := c.Param("id")

	project, err := h.projectService.GetProjectByID(id)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, project)
}

// PUT /projects/:id
func (h *ProjectHandler) UpdateProject(c *gin.Context) {

	id := c.Param("id")

	var req dto.UpdateProjectRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := h.projectService.UpdateProject(id, req)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Project updated successfully",
	})
}

// DELETE /projects/:id
func (h *ProjectHandler) DeleteProject(c *gin.Context) {

	id := c.Param("id")

	err := h.projectService.DeleteProject(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Project deleted successfully",
	})
}