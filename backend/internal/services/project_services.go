package services

import (
	"errors"

	"github.com/google/uuid"
	"github.com/Krrishnam/sprint-board/backend/internal/dto"
	"github.com/Krrishnam/sprint-board/backend/internal/models"
	"github.com/Krrishnam/sprint-board/backend/internal/repositories"
)

type ProjectService struct{
	projectRepo *repositories.ProjectRepositry
	teamRepo *repositories.TeamRepository
}

func NewProjectService(
	projectRepo *repositories.ProjectRepositry,
	teamRepo *repositories.TeamRepository,
) *ProjectService{
	return &ProjectService{
		projectRepo: projectRepo,
		teamRepo: teamRepo,
	}
}

func (s *ProjectService) CreateProject(req dto.CreateProjectRequest) error{
	_, err := s.teamRepo.GetByID(req.TeamID)

	if err != nil{
		return errors.New("team not found")
	}

	_, err = s.projectRepo.GetByName(req.Name)
	if err == nil{
		return errors.New("project already exists")
	}

	teamID, err := uuid.Parse(req.TeamID)

	if err != nil {
	return errors.New("invalid team id")
	}

	project := models.Project{
		Name: req.Name,
		Description: req.Description,
		TeamID: teamID,
	}
	
	return s.projectRepo.Create(&project)
}

func(s *ProjectService) GetAllProjects() ([]models.Project, error){
	return s.projectRepo.GetAll()
}

func (s *ProjectService) GetProjectByID(id string) (*models.Project, error) {
	return s.projectRepo.GetByID(id)
}

// Update Project
func (s *ProjectService) UpdateProject(id string, req dto.UpdateProjectRequest) error {

	project, err := s.projectRepo.GetByID(id)
	if err != nil {
		return errors.New("project not found")
	}

	if req.Name != "" {
		project.Name = req.Name
	}

	if req.Description != "" {
		project.Description = req.Description
	}

	return s.projectRepo.Update(project)
}

// Delete Project
func (s *ProjectService) DeleteProject(id string) error {

	project, err := s.projectRepo.GetByID(id)
	if err != nil {
		return errors.New("project not found")
	}

	return s.projectRepo.Delete(project)
}