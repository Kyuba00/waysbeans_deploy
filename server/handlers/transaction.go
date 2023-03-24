package handlers

import (
	"fmt"
	"log"
	"net/http"
	dto "nis-waybeans/dto/result"
	transactiondto "nis-waybeans/dto/transaction"
	"nis-waybeans/models"
	"nis-waybeans/repositories"
	"os"
	"strconv"
	"time"

	"github.com/go-playground/validator"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
	"gopkg.in/gomail.v2"
)

type handlerTransaction struct {
	TransactionRepository repositories.TransactionRepository
	CartRepository        repositories.CartRepository
	ProductRepository     repositories.ProductRepository
}

func HandlerTransaction(TransactionRepository repositories.TransactionRepository, CartRepository repositories.CartRepository, ProductRepository repositories.ProductRepository) *handlerTransaction {

	return &handlerTransaction{
		TransactionRepository,
		CartRepository,
		ProductRepository,
	}
}

func (h *handlerTransaction) FindTransactions(c echo.Context) error {
	transactions, err := h.TransactionRepository.FindTransactions()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: transactions,
	})
}

func (h *handlerTransaction) FindTransactionsByUser(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userID := userLogin.(jwt.MapClaims)["id"].(float64)
	transactions, err := h.TransactionRepository.FindTransactionsByUser(int(userID))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: transactions,
	})
}

func (h *handlerTransaction) GetTransaction(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	transaction, err := h.TransactionRepository.GetTransactionWithCart(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseTransaction(transaction)})
}

func (h *handlerTransaction) GetUncheckedOutTransaction(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userID := userLogin.(jwt.MapClaims)["id"].(float64)
	transaction, err := h.TransactionRepository.GetUncheckedOutTransactionByUserID(int(userID))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseTransactionUnfinished(transaction)})
}

func (h *handlerTransaction) CreateTransaction(c echo.Context) error {
	request := new(transactiondto.CreateTransactionRequest)
	if err := c.Bind(request); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}
	userLogin := c.Get("userLogin")
	userID := userLogin.(jwt.MapClaims)["id"].(float64)
	var transaction models.Transaction

	transaction, _ = h.TransactionRepository.GetUncheckedOutTransaction(int(userID))

	var transactionIsMatch = false
	var transactionId int
	for !transactionIsMatch {
		transactionId = int(time.Now().Unix())
		transactionData, _ := h.TransactionRepository.GetTransaction(transactionId)
		if transactionData.ID == 0 {
			transactionIsMatch = true
		}
	}
	if transaction.ID == 0 {
		transaction = models.Transaction{
			UserID:   int(userID),
			ID:       transactionId,
			Name:     request.Name,
			Email:    request.Email,
			Phone:    request.Phone,
			PostCode: request.PostCode,
			Address:  request.Address,
			Status:   request.Status,
		}

		data, err := h.TransactionRepository.CreateTransaction(transaction)
		if err != nil {
			return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
		}
		return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseTransaction(data)})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseTransaction(transaction)})
}

func (h *handlerTransaction) UpdateTransaction(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userID := userLogin.(jwt.MapClaims)["id"].(float64)
	request := transactiondto.CreateTransactionRequest{

		Name:     c.FormValue("name"),
		Email:    c.FormValue("email"),
		Phone:    c.FormValue("phone"),
		PostCode: c.FormValue("post_code"),
		Address:  c.FormValue("address"),
		Status:   "Waiting For Validation",
	}

	transaction, err := h.TransactionRepository.GetUncheckedOutTransactionByUserID(int(userID))

	if transaction.ID == 0 {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: "User ini belum memiliki transaksi"})
	}

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	if request.Name != "" {
		transaction.Name = request.Name
	}

	if request.Email != "" {
		transaction.Email = request.Email
	}

	if request.Phone != "" {
		transaction.Phone = request.Phone
	}

	if request.PostCode != "" {
		transaction.PostCode = request.PostCode
	}

	if request.Address != "" {
		transaction.Address = request.Address
	}

	if request.Status != "" {
		transaction.Status = request.Status
	}

	var s = snap.Client{}
	s.New(os.Getenv("SERVER_KEY"), midtrans.Sandbox)

	req := &snap.Request{
		TransactionDetails: midtrans.TransactionDetails{
			OrderID:  strconv.Itoa(transaction.ID),
			GrossAmt: int64(transaction.SubTotal),
		},
		CreditCard: &snap.CreditCardDetails{
			Secure: true,
		},
		CustomerDetail: &midtrans.CustomerDetails{
			FName: transaction.Name,
			Email: transaction.Email,
		},
	}

	snapResp, _ := s.CreateTransaction(req)

	_, err = h.TransactionRepository.UpdateTransaction(transaction)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{Code: http.StatusInternalServerError, Message: err.Error()})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: snapResp})
}

func (h *handlerTransaction) DeleteTransaction(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	transaction, err := h.TransactionRepository.GetTransaction(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}

	data, err := h.TransactionRepository.DeleteTransaction(transaction, id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{Code: http.StatusBadRequest, Message: err.Error()})
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: convertResponseTransaction(data)})
}

func (h *handlerTransaction) CheckOutCart(userID int) {
	var transaction models.Transaction
	transaction, _ = h.TransactionRepository.GetUncheckedOutTransaction(int(userID))
	transactionID := transaction.ID

	carts, _ := h.CartRepository.FindUnCheckedOutCarts(transactionID)

	for _, element := range carts {
		id := element.ID
		if !element.Checkout {
			cart, _ := h.CartRepository.GetCart(id)
			cart.Checkout = true
			h.CartRepository.UpdateCart(cart)
		}

	}
	h.UpdateStockProduct(transaction.ID)
}

func (h *handlerTransaction) UpdateStockProduct(TransactionID int) {
	carts, err := h.CartRepository.FindCartsByTransactionID(TransactionID)
	if err != nil {
		fmt.Println(err.Error())
	}
	for _, element := range carts {
		product, _ := h.ProductRepository.GetProduct(element.ProductID)
		product.Stock = product.Stock - element.OrderQuantity
		h.ProductRepository.UpdateProduct(product)
	}
}

func convertResponseTransaction(u models.Transaction) transactiondto.TransactionResponse {
	return transactiondto.TransactionResponse{
		ID:      u.ID,
		User:    u.User,
		Name:    u.Name,
		Email:   u.Email,
		Phone:   u.Phone,
		Address: u.Address,
		Status:  u.Status,
		Cart:    u.Cart,
	}

}

func convertResponseTransactionUnfinished(u models.Transaction) transactiondto.TransactionResponse {
	return transactiondto.TransactionResponse{
		ID:       u.ID,
		User:     u.User,
		Name:     u.Name,
		Email:    u.Email,
		Phone:    u.Phone,
		Address:  u.Address,
		Status:   u.Status,
		Cart:     u.Cart,
		SubTotal: u.SubTotal,
		TotalQty: u.TotalQty,
	}
}

func (h *handlerTransaction) Notification(c echo.Context) error {

	var notificationPayLoad map[string]interface{}

	if err := c.Bind(&notificationPayLoad); err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	transactionStatus := notificationPayLoad["transaction_status"].(string)
	fraudStatus := notificationPayLoad["fraud_status"].(string)
	orderId := notificationPayLoad["order_id"].(string)

	order_id, _ := strconv.Atoi(orderId)

	transaction, err := h.TransactionRepository.GetTransaction(order_id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}
	if transactionStatus == "capture" {
		if fraudStatus == "challenge" {
			h.TransactionRepository.UpdateStatusTransaction("pending", order_id)
		} else if fraudStatus == "accept" {
			h.CheckOutCart(transaction.UserID)
			SendMail("Success", transaction)
			h.TransactionRepository.UpdateStatusTransaction("Success", order_id)
		}
	} else if transactionStatus == "settlement" {
		h.CheckOutCart(transaction.UserID)
		SendMail("Success", transaction)
		h.TransactionRepository.UpdateStatusTransaction("Success", order_id)
	} else if transactionStatus == "deny" {
		h.CheckOutCart(transaction.UserID)
		h.TransactionRepository.UpdateStatusTransaction("failed", order_id)
	} else if transactionStatus == "cancel" || transactionStatus == "expire" {
		h.TransactionRepository.UpdateStatusTransaction("failed", order_id)
	} else if transactionStatus == "pending" {
		h.TransactionRepository.UpdateStatusTransaction("pending", order_id)
	}
	return c.JSON(http.StatusOK, dto.SuccessResult{Code: http.StatusOK, Data: notificationPayLoad})
}

func SendMail(status string, transaction models.Transaction) {
	if status != transaction.Status && (status == "Success") {
		var CONFIG_SMTP_HOST = "smtp.gmail.com"
		var CONFIG_SMTP_PORT = 587
		var CONFIG_SENDER_NAME = "WaysBeans <akanime1@gmail.com>"
		var CONFIG_AUTH_EMAIL = os.Getenv("SYSTEM_EMAIL")
		var CONFIG_AUTH_PASSWORD = os.Getenv("SYSTEM_PASSWORD")

		var productList = ""
		for _, element := range transaction.Cart {
			fmt.Println("Transaction cart:", element)
			productList = productList + " " + element.Product.Name
		}
		var subTotal = strconv.Itoa(transaction.SubTotal)
		//var totalQty = strconv.Itoa(transaction.TotalQty)

		mailer := gomail.NewMessage()
		mailer.SetHeader("From", CONFIG_SENDER_NAME)
		mailer.SetHeader("To", transaction.Email)
		mailer.SetHeader("Subject", "Transaction Status")
		mailer.SetBody("text/html", fmt.Sprintf(`<!DOCTYPE html>
					<html lang="en">
					<head>
					<meta charset="UTF-8" />
					<meta http-equiv="X-UA-Compatible" content="IE=edge" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Document</title>
					<style>
					h1 {
						color: brown;
						}
					  </style>
					</head>
					<body>
					
						<h2>Your Payment :</h2>
						<ul style="list=style-type:none;">
							<li>Name : %s </li>
							<li>Total Payment: Rp.%s </li>
							<li>Status : <b>%s</b></li>
						</ul>
						<p>Thank You For Your Buying in WaysBeanss</p>
					</body>
					</html>`, productList, subTotal, status))

		dialer := gomail.NewDialer(
			CONFIG_SMTP_HOST,
			CONFIG_SMTP_PORT,
			CONFIG_AUTH_EMAIL,
			CONFIG_AUTH_PASSWORD,
		)

		err := dialer.DialAndSend(mailer)
		if err != nil {
			log.Fatal(err.Error())
		}
		log.Println("Mail sent! to " + transaction.Email)
	}
}
