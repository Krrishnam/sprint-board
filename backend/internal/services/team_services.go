package services

import (
	"errors"

	"github.com/Krrishnam/sprint-board/backend/internal/dto"
	"github.com/Krrishnam/sprint-board/backend/internal/models"
	"github.com/Krrishnam/sprint-board/backend/internal/repositories"
)

type TeamService struct {
	teamRepo *repositories.TeamRepository
}

func NewTeamService(teamRepo *repositories.TeamRepository) *TeamService {
	return &TeamService{
		teamRepo: teamRepo,
	}
}

// Create team
func (s *TeamService) CreateTeam(req dto.CreateTeamRequest) error {

	// Check if team already exists
	_, err := s.teamRepo.GetByName(req.Name)
	if err == nil {
		return errors.New("team already exists")
	}

	team := models.Team{
		Name:        req.Name,
		Description: req.Description,
	}

	return s.teamRepo.Create(&team)
}

// Get All Teams
func (s *TeamService) GetAllTeams() ([]models.Team, error) {
	return s.teamRepo.GetAll()
}

// Get Team By ID
func (s *TeamService) GetTeamByID(id string) (*models.Team, error) {
	return s.teamRepo.GetByID(id)
}

// Update Team
func (s *TeamService) UpdateTeam(id string, req dto.UpdateTeamRequest) error {

	team, err := s.teamRepo.GetByID(id)
	if err != nil {
		return errors.New("team not found")
	}

	if req.Name != "" {
		team.Name = req.Name
	}

	if req.Description != "" {
		team.Description = req.Description
	}

	return s.teamRepo.Update(team)
}

// Delete Team
func (s *TeamService) DeleteTeam(id string) error {

	team, err := s.teamRepo.GetByID(id)
	if err != nil {
		return errors.New("team not found")
	}

	return s.teamRepo.Delete(team)
}