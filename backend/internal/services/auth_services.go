package services

import (
	"errors"

	"github.com/Krrishnam/sprint-board/backend/internal/config"
	"github.com/Krrishnam/sprint-board/backend/internal/dto"
	"github.com/Krrishnam/sprint-board/backend/internal/models"
	"github.com/Krrishnam/sprint-board/backend/internal/repositories"
	"github.com/Krrishnam/sprint-board/backend/internal/utils"
)

type AuthService struct {
	userRepo *repositories.UserRepository
	cfg      *config.Config
}

func NewAuthService(
	userRepo *repositories.UserRepository,
	cfg *config.Config,
) *AuthService {
	return &AuthService{
		userRepo: userRepo,
		cfg:      cfg,
	}
}

func (s *AuthService) Register(req dto.RegisterRequest) error {

	_, err := s.userRepo.GetByEmail(req.Email)

	if err == nil {
		return errors.New("email already exists")
	}

	hashedPassword, err := utils.HashPassword(req.Password)

	if err != nil {
		return err
	}

	user := models.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: hashedPassword,
		Role:     models.Developer,
	}

	return s.userRepo.Create(&user)
}

func (s *AuthService) Login(req dto.LoginRequest) (*dto.AuthResponse, error) {

	user, err := s.userRepo.GetByEmail(req.Email)

	if err != nil {
		return nil, errors.New("invalid credentials")
	}

	if err := utils.CheckPassword(req.Password, user.Password); err != nil {
		return nil, errors.New("invalid credentials")
	}

	token, err := utils.GenerateJWT(
		user.ID.String(),
		user.Email,
		string(user.Role),
		s.cfg.JWTSecret,
	)

	if err != nil {
		return nil, err
	}

	return &dto.AuthResponse{
		Token: token,
		User: dto.UserDTO{
			ID:    user.ID.String(),
			Name:  user.Name,
			Email: user.Email,
			Role:  string(user.Role),
		},
	}, nil
}