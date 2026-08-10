package database

import (
	"log"

	"github.com/Krrishnam/sprint-board/backend/internal/models"
)

func AutoMigrate() {
	err := DB.AutoMigrate(
		&models.User{},
		&models.Team{},
		&models.Project{},
		&models.Sprint{},
		&models.Task{},
		&models.Comment{},
		&models.ActivityLog{},
	)

	if err != nil {
		log.Fatal("Migration failed:", err)
	}

	log.Println("✅ Database migrated successfully")
}