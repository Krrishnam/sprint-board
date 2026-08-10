package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type SprintStatus string

const (
	SprintPlanned SprintStatus = "planned"
	SprintActive  SprintStatus = "active"
	SprintClosed  SprintStatus = "closed"
)

type Sprint struct {
	ID uuid.UUID `gorm:"type:uuid;primaryKey"`

	Name string `gorm:"size:100;not null"`

	Goal string `gorm:"type:text"`

	StartDate time.Time
	EndDate   time.Time

	Status SprintStatus `gorm:"type:varchar(20);default:'planned'"`
	Tasks []Task `gorm:"foreignKey:SprintID"`

	ProjectID uuid.UUID `gorm:"type:uuid;not null"`

	Project Project `gorm:"foreignKey:ProjectID"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (s *Sprint) BeforeCreate(tx *gorm.DB) error {
	s.ID = uuid.New()
	return nil
}