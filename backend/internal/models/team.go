package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Team struct {
	ID          uuid.UUID `gorm:"type:uuid;primaryKey"`
	Name        string    `gorm:"size:100;not null;unique"`
	Description string    `gorm:"size:255"`

	Projects []Project `gorm:"foreignKey:TeamID"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (t *Team) BeforeCreate(tx *gorm.DB) error {
	t.ID = uuid.New()
	return nil
}