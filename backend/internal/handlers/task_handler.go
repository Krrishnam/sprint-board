package handlers

import (
	"net/http"

	"github.com/Krrishnam/sprint-board/backend/internal/dto"
	"github.com/Krrishnam/sprint-board/backend/internal/services"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type TaskHandler struct {
	taskService *services.TaskService
}

func NewTaskHandler(taskService *services.TaskService) *TaskHandler {
	return &TaskHandler{
		taskService: taskService,
	}
}

// POST /tasks
func (h *TaskHandler) CreateTask(c *gin.Context) {
	var req dto.CreateTaskRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	err := h.taskService.CreateTask(req)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "Task created successfully",
	})
}

// GET /tasks
func (h *TaskHandler) GetTasks(c *gin.Context) {

	userID, exists := c.Get("userID")

	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "user not authenticated",
		})
		return
	}

	userIDString, ok := userID.(string)

	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "invalid user ID",
		})
		return
	}

	tasks, err := h.taskService.GetAllTasks(userIDString)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, tasks)
}

// GET /tasks/:id
func (h *TaskHandler) GetTaskByID(c *gin.Context) {
	id := c.Param("id")

	task, err := h.taskService.GetTaskByID(id)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, task)
}

// PUT /tasks/:id
func (h *TaskHandler) UpdateTask(c *gin.Context) {
	id := c.Param("id")

	// Convert string ID from URL to UUID
	taskID, err := uuid.Parse(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid task ID",
		})
		return
	}

	var req dto.UpdateTaskRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	// Update task
	_, err = h.taskService.UpdateTask(taskID, req)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Task updated successfully",
	})
}

// Update /tasks/:id/status
// PATCH /tasks/:id/status
func (h *TaskHandler) UpdateTaskStatus(c *gin.Context) {

	id := c.Param("id")

	var req dto.UpdateTaskStatusRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	err := h.taskService.UpdateTaskStatus(id, req.Status)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Task status updated successfully",
	})
}

// DELETE /tasks/:id
func (h *TaskHandler) DeleteTask(c *gin.Context) {
	id := c.Param("id")

	// Convert string ID to UUID
	taskID, err := uuid.Parse(id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid task ID",
		})
		return
	}

	err = h.taskService.DeleteTask(taskID)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Task deleted successfully",
	})
}
