package models

import (
	"github.com/google/uuid"
)

type Comment struct {
	BaseModel

	Content string `gorm:"type:text;not null"`

	TaskID uuid.UUID `gorm:"type:uuid;not null"`
	Task   Task      `gorm:"foreignKey:TaskID"`

	UserID uuid.UUID `gorm:"type:uuid;not null"`
	User   User      `gorm:"foreignKey:UserID"`
}