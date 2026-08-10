package repositories

import (
	"github.com/Krrishnam/sprint-board/backend/internal/models"
	"gorm.io/gorm"
)

type TeamRepository struct {
	db *gorm.DB
}

func NewTeamRepository(db *gorm.DB) *TeamRepository {
	return &TeamRepository{
		db: db,
	}
}

func (r *TeamRepository) Create(team *models.Team) error {
	return r.db.Create(team).Error
}

func (r *TeamRepository) GetAll() ([]models.Team, error) {
	var teams []models.Team

	err := r.db.Find(&teams).Error

	return teams, err
}

func (r *TeamRepository) GetByID(id string) (*models.Team, error) {
	var team models.Team

	err := r.db.First(&team, "id = ?", id).Error

	if err != nil {
		return nil, err
	}

	return &team, nil
}

func (r *TeamRepository) GetByName(name string) (*models.Team, error) {
	var team models.Team

	err := r.db.Where("name = ?", name).First(&team).Error

	if err != nil {
		return nil, err
	}

	return &team, nil
}

func (r *TeamRepository) Update(team *models.Team) error {
	return r.db.Save(team).Error
}

func (r *TeamRepository) Delete(team *models.Team) error {
	return r.db.Delete(team).Error
}