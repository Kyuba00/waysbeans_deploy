package repositories

import (
	"nis-waybeans/models"

	"gorm.io/gorm"
)

type TransactionRepository interface {
	FindTransactions() ([]models.Transaction, error)
	GetTransaction(ID int) (models.Transaction, error)
	GetUncheckedOutTransactionByUserID(userID int) (models.Transaction, error)
	GetTransactionWithCart(userID int) (models.Transaction, error)
	CreateTransaction(transaction models.Transaction) (models.Transaction, error)
	UpdateTransaction(transaction models.Transaction) (models.Transaction, error)
	DeleteTransaction(transaction models.Transaction, ID int) (models.Transaction, error)
	GetUncheckedOutTransaction(UserID int) (models.Transaction, error)
	UpdateStatusTransaction(status string, orderId int) (models.Transaction, error)
	FindTransactionsByUser(userID int) ([]models.Transaction, error)
}

func RepositoryTransaction(db *gorm.DB) *repository {
	return &repository{db}
}

func (r *repository) FindTransactions() ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := r.db.Order("id desc").Preload("User").Preload("Cart.Product").Find(&transactions).Error
	return transactions, err
}

func (r *repository) FindTransactionsByUser(userID int) ([]models.Transaction, error) {
	var transactions []models.Transaction
	err := r.db.Order("id desc").Preload("User").Preload("Cart.Product").Find(&transactions, "user_id = ? and status <> 'Waiting For Verification'", userID).Error
	return transactions, err
}

func (r *repository) GetTransaction(ID int) (models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.Preload("User").First(&transaction, ID).Error
	return transaction, err
}

func (r *repository) GetUncheckedOutTransactionByUserID(userID int) (models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.Order("id desc").Where("user_id = ? and status = 'Waiting For Verification'", userID).Preload("User").First(&transaction).Error
	return transaction, err
}

func (r *repository) GetTransactionWithCart(userID int) (models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.Where("user_id =?", userID).Preload("User").Preload("Cart.Product").First(&transaction).Error
	return transaction, err
}

func (r *repository) CreateTransaction(transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Create(&transaction).Error
	return transaction, err
}

func (r *repository) UpdateTransaction(transaction models.Transaction) (models.Transaction, error) {
	err := r.db.Save(&transaction).Error
	return transaction, err
}

func (r *repository) DeleteTransaction(transaction models.Transaction, ID int) (models.Transaction, error) {
	err := r.db.Delete(&transaction).Error
	return transaction, err
}

func (r *repository) GetUncheckedOutTransaction(userID int) (models.Transaction, error) {
	var transaction models.Transaction
	err := r.db.Where("status = 'Waiting For Verification' AND user_id = ?", userID).First(&transaction).Error
	return transaction, err
}

func (r *repository) UpdateStatusTransaction(status string, orderId int) (models.Transaction, error) {
	var transaction models.Transaction
	r.db.First(&transaction, orderId)
	transaction.Status = status
	err := r.db.Save(&transaction).Error
	return transaction, err
}
