package models

import (
	"time"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type UserRole string

const(
	Admin UserRole 	= "admin"
	Manager UserRole = "manager"
	Developer UserRole = "developer"
)

type User struct{
	ID uuid.UUID 	`gorm:"type:uuid;primaryKey"`
	Name string 	`gorm:"size:100;not null"`
	Email string 	`gorm:"size:255;uniqueIndex;not null"`
	Password string `gorm:"not null"`
	Role UserRole `gorm:"type:varchar(20);default:'developer'"`
	AssignedTasks []Task `gorm:"foreignKey:AssigneeID"`
	CreatedTasks []Task `gorm:"foreignKey:CreatedByID"`

	CreatedAt time.Time
	UpdatedAt time.Time
}

func (u *User) BeforeCreate(tx *gorm.DB) error {
	u.ID = uuid.New()
	return nil
}