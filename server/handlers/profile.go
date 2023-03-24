package handlers

import (
	"context"
	"net/http"
	profiledto "nis-waybeans/dto/profile"
	dto "nis-waybeans/dto/result"
	"nis-waybeans/models"
	"nis-waybeans/repositories"
	"os"
	"strconv"

	"github.com/cloudinary/cloudinary-go/v2"
	"github.com/cloudinary/cloudinary-go/v2/api/uploader"
	"github.com/go-playground/validator"
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
)

type handlerProfile struct {
	ProfileRepository repositories.ProfileRepository
}

func HandlerProfile(ProfileRepository repositories.ProfileRepository) *handlerProfile {
	return &handlerProfile{ProfileRepository}
}

func convertResponseProfile(u models.Profile) profiledto.ProfileResponse {
	return profiledto.ProfileResponse{
		ID:             u.ID,
		Name:           u.Name,
		Phone:          u.Phone,
		Address:        u.Address,
		PostCode:       u.PostCode,
		UserID:         u.UserID,
		ProfilePicture: u.ProfilePicture,
		User:           u.User,
	}
}

func (h *handlerProfile) FindProfile(c echo.Context) error {
	profiles, err := h.ProfileRepository.FindProfiles()
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: profiles,
	})
}

func (h *handlerProfile) GetProfile(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))
	profile, err := h.ProfileRepository.GetProfile(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: convertResponseProfile(profile),
	})
}

func (h *handlerProfile) GetProfileByUserID(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userID := userLogin.(jwt.MapClaims)["id"].(float64)
	profile, err := h.ProfileRepository.GetProfileByUserID(int(userID))
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: convertResponseProfile(profile),
	})
}
func (h *handlerProfile) CreateProfile(c echo.Context) error {
	userLogin := c.Get("userLogin")
	userID := userLogin.(jwt.MapClaims)["id"].(float64)

	profile, _ := h.ProfileRepository.GetProfileByUserID(int(userID))
	if profile.ID != 0 {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: "Profile untuk user ini sudah pernah di buat.",
		})
	}

	dataFile := c.Get("dataFile").(string)

	request := profiledto.CreateProfileRequest{
		Phone:          c.FormValue("phone"),
		Address:        c.FormValue("address"),
		UserID:         int(userID),
		ProfilePicture: dataFile,
	}

	validation := validator.New()
	err := validation.Struct(request)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	Profile := models.Profile{
		Phone:          request.Phone,
		Address:        request.Address,
		UserID:         request.UserID,
		ProfilePicture: request.ProfilePicture,
	}

	data, err := h.ProfileRepository.CreateProfile(Profile)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: convertResponseProfile(data),
	})
}

func (h *handlerProfile) UpdateProfile(c echo.Context) error {
	var ctx = context.Background()
	var CLOUD_NAME = os.Getenv("CLOUD_NAME")
	var API_KEY = os.Getenv("API_KEY")
	var API_SECRET = os.Getenv("API_SECRET")

	userLogin := c.Get("userLogin")
	userID := userLogin.(jwt.MapClaims)["id"].(float64)
	dataFile := c.Get("dataFile").(string)

	cld, _ := cloudinary.NewFromParams(CLOUD_NAME, API_KEY, API_SECRET)

	resp, err := cld.Upload.Upload(ctx, dataFile, uploader.UploadParams{Folder: "waysbeans"})
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	request := profiledto.UpdateProfileRequest{
		Name:           c.FormValue("name"),
		Phone:          c.FormValue("phone"),
		Address:        c.FormValue("address"),
		PostCode:       c.FormValue("post_code"),
		UserID:         int(userID),
		ProfilePicture: resp.SecureURL,
	}

	profile, err := h.ProfileRepository.GetProfileByUserID(int(userID))

	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	if request.Name != "" {
		profile.Name = request.Name
	}
	if request.Phone != "" {
		profile.Phone = request.Phone
	}

	if request.Address != "" {
		profile.Address = request.Address
	}

	if request.PostCode != "" {
		profile.PostCode = request.PostCode
	}
	if request.UserID != 0 {
		profile.UserID = request.UserID
	}
	if request.ProfilePicture != "" {
		profile.ProfilePicture = request.ProfilePicture
	}

	data, err := h.ProfileRepository.UpdateProfile(profile)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, dto.ErrorResult{
			Code:    http.StatusInternalServerError,
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: convertResponseProfile(data),
	})

}

func (h *handlerProfile) DeleteProfile(c echo.Context) error {
	id, _ := strconv.Atoi(c.Param("id"))

	profile, err := h.ProfileRepository.GetProfile(id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	data, err := h.ProfileRepository.DeleteProfile(profile, id)
	if err != nil {
		return c.JSON(http.StatusBadRequest, dto.ErrorResult{
			Code:    http.StatusBadRequest,
			Message: err.Error(),
		})
	}

	return c.JSON(http.StatusOK, dto.SuccessResult{
		Code: http.StatusOK,
		Data: convertResponseProfile(data),
	})
}
