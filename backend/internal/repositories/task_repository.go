package repositories

import (
	"github.com/Krrishnam/sprint-board/backend/internal/models"
	"gorm.io/gorm"
)

type TaskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) *TaskRepository {
	return &TaskRepository{
		db: db,
	}
}

// Create Task
func (r *TaskRepository) Create(task *models.Task) error {
	return r.db.Create(task).Error
}

// Get All Tasks
func (r *TaskRepository) GetAll() ([]models.Task, error) {

	var tasks []models.Task

	err := r.db.
		Preload("Project").
		Preload("Sprint").
		Preload("Assignee").
		Preload("CreatedBy").
		Find(&tasks).Error

	if err != nil {
		return nil, err
	}

	return tasks, nil
}

// Get Task By ID
func (r *TaskRepository) GetByID(id string) (*models.Task, error) {

	var task models.Task

	err := r.db.
		Preload("Project").
		Preload("Sprint").
		Preload("Assignee").
		Preload("CreatedBy").
		First(&task, "id = ?", id).Error

	if err != nil {
		return nil, err
	}

	return &task, nil
}

// Count All
func (r *TaskRepository) CountAll() (int64, error) {
	var count int64

	err := r.db.Model(&models.Task{}).
		Count(&count).Error

	return count, err
}

// Count By Status
func (r *TaskRepository) CountByStatus(status models.TaskStatus) (int64, error) {
	var count int64

	err := r.db.Model(&models.Task{}).
		Where("status = ?", status).
		Count(&count).Error

	return count, err
}

func (r *TaskRepository) GetAllByUser(userID string) ([]models.Task, error) {
	var tasks []models.Task

	err := r.db.
		Preload("Project").
		Preload("Sprint").
		Preload("Assignee").
		Preload("CreatedBy").
		Where("created_by_id = ?", userID).
		Find(&tasks).Error

	if err != nil {
		return nil, err
	}

	return tasks, nil
}

// Get Active
func (r *SprintRepository) GetActive() (*models.Sprint, error) {
	var sprint models.Sprint

	err := r.db.
		Where("status = ?", models.SprintActive).
		First(&sprint).Error

	if err != nil {
		return nil, err
	}

	return &sprint, nil
}

func (r *TaskRepository) GetTasksBySprint(sprintID string) ([]models.Task, error) {

	var tasks []models.Task

	err := r.db.
		Preload("Assignee").
		Preload("Sprint").
		Preload("Project").
		Where("sprint_id = ?", sprintID).
		Order("task_number ASC").
		Find(&tasks).Error

	if err != nil {
		return nil, err
	}

	return tasks, nil
}

// Get By Task Number
func (r *TaskRepository) GetByTaskNumber(taskNumber string) (*models.Task, error) {

	var task models.Task

	err := r.db.
		Where("task_number = ?", taskNumber).
		First(&task).Error

	if err != nil {
		return nil, err
	}

	return &task, nil
}

// Update Task
func (r *TaskRepository) Update(task *models.Task) error {
	return r.db.Save(task).Error
}

// Update Stauts of Task
func (r *TaskRepository) UpdateStatus(id string, status string) error {
	return r.db.
		Model(&models.Task{}).
		Where("id = ?", id).
		Update("status", status).
		Error
}

func (r *TaskRepository) Delete(id string) error {
	return r.db.Delete(&models.Task{}, "id = ?", id).Error
}
