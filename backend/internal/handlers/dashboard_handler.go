package handlers

import (
	"net/http"

	"github.com/Krrishnam/sprint-board/backend/internal/services"
	"github.com/gin-gonic/gin"
)

type DashboardHandler struct {
	dashboardService *services.DashboardService
}

func NewDashboardHandler(
	dashboardService *services.DashboardService,
) *DashboardHandler {
	return &DashboardHandler{
		dashboardService: dashboardService,
	}
}

func (h *DashboardHandler) GetDashboard(c *gin.Context) {

	dashboard, err := h.dashboardService.GetDashboard()

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, dashboard)
}