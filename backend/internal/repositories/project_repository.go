package repositories

import(
	"github.com/Krrishnam/sprint-board/backend/internal/models"
	"gorm.io/gorm"
)

type ProjectRepositry struct{
	db *gorm.DB
}

func NewProjectRepository(db *gorm.DB) *ProjectRepositry{
	return &ProjectRepositry{
		db: db,
	}
}

func(r *ProjectRepositry) Create(project *models.Project) error{
	return r.db.Create(project).Error
}

func(r *ProjectRepositry) GetAll() ([]models.Project, error) {
	var projects []models.Project
	
	err := r.db.Find(&projects).Error

	if err != nil{
		return nil, err
	}
	
	return projects, nil
}

func(r *ProjectRepositry) GetByID(id string) (*models.Project, error){
	var project models.Project

	err := r.db.First(&project, "id = ?", id).Error

	if err != nil{
		return nil,err
	}
	return &project, nil
}

func(r *ProjectRepositry) GetByName(name string) (*models.Project, error){
	var project models.Project
	err := r.db.Where("name = ?", name).First(&project).Error
	
	if err != nil{
		return nil, err
	}
	return &project, nil
}

func (r *ProjectRepositry) Update(project *models.Project) error {
	return r.db.Save(project).Error
}

func (r *ProjectRepositry) Delete(project *models.Project) error {
	return r.db.Delete(project).Error
}