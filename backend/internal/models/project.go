package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Project struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name        string    `gorm:"size:100;not null"`
	Description string    `gorm:"size:255"`

	TeamID uuid.UUID `gorm:"type:uuid;not null"`

	Team Team `gorm:"foreignKey:TeamID"`

	Sprints []Sprint `gorm:"foreignKey:ProjectID"`
	Tasks []Task `gorm:"foreignKey:ProjectID"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (p *Project) BeforeCreate(tx *gorm.DB) error {
	p.ID = uuid.New()
	return nil
}