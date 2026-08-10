package repositories

import (
	"github.com/Krrishnam/sprint-board/backend/internal/models"
	"gorm.io/gorm"
)

type SprintRepository struct {
	db *gorm.DB
}

func NewSprintRepository(db *gorm.DB) *SprintRepository {
	return &SprintRepository{
		db: db,
	}
}

// Create Sprint
func (r *SprintRepository) Create(sprint *models.Sprint) error {
	return r.db.Create(sprint).Error
}

// Get All Sprints
func (r *SprintRepository) GetAll() ([]models.Sprint, error) {
	var sprints []models.Sprint

	err := r.db.Find(&sprints).Error

	if err != nil {
		return nil, err
	}

	return sprints, nil
}

// Get Sprint By ID
func (r *SprintRepository) GetByID(id string) (*models.Sprint, error) {
	var sprint models.Sprint

	err := r.db.First(&sprint, "id = ?", id).Error

	if err != nil {
		return nil, err
	}

	return &sprint, nil
}

// Get Sprint By Name
func (r *SprintRepository) GetByName(name string) (*models.Sprint, error) {
	var sprint models.Sprint

	err := r.db.Where("name = ?", name).First(&sprint).Error

	if err != nil {
		return nil, err
	}

	return &sprint, nil
}

// Update Sprint
func (r *SprintRepository) Update(sprint *models.Sprint) error {
	return r.db.Save(sprint).Error
}

// Delete Sprint
func (r *SprintRepository) Delete(sprint *models.Sprint) error {
	return r.db.Delete(sprint).Error
}