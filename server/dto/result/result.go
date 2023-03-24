package dto

type SuccessResult struct {
	Code int         `json:"code"`
	Data interface{} `json:"data"`
}
type TransactionSuccessResult struct {
	Code     int         `json:"code"`
	Data     interface{} `json:"data"`
	DataSnap interface{} `json:"data_snap"`
}

type ErrorResult struct {
	Code    int    `json:"code"`
	Message string `json:"message"`
}
