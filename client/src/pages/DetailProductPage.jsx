import { Container, Row, Col, Button, Image } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { ConvertFormatRupiah } from "../utils";
import { useMutation, useQuery } from "react-query";

import { API } from "../config/api";
import { useContext, useEffect, useState } from "react";

import ModalFailed from "../components/modal/ModalFailed";
import LoadingSpinner from "../components/LoadingSpinner";
import ModalSuccessAddCart from "../components/modal/ModalSuccessAddCart";
import { UserContext } from "../context/userContext";
import ModalLogin from "../components/modal/ModalLogin";
import ModalRegister from "../components/modal/ModalRegister";

export default function DetailProductPage() {
  const [state, _] = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleShowModalSuccess = () => setShowSuccessAlert(true);
  const handleCloseModalSuccess = () => {
    setShowSuccessAlert(false);
    // navigate('/cart')
  };
  const handleCloseRegister = () => setShowRegister(false);

  const handleCloseLogin = () => setShowLogin(false);
  const handleShowLogin = () => setShowLogin(true);

  const popLogin = () => {
    setShowLogin(true);
    setShowRegister(false);
  };
  const popRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const popSuccessCart = () => {
    setShowLogin(false);
    setShowSuccessAlert(true);
  };

  const [showFailedAlert, setShowFailedAlert] = useState(false);
  const handleShowModalFailed = () => setShowFailedAlert(true);
  const handleCloseModalFailed = () => setShowFailedAlert(false);
  let { id } = useParams();
  let navigate = useNavigate();
  let { data: product, refetch } = useQuery("productDetailCache", async () => {
    const response = await API.get("/product/" + id);
    return response.data.data;
  });

  document.title = "Waysbeans | Product Detail";
  const handleCart = useMutation(async (e) => {
    try {
      e.preventDefault();

      if (state.isLogin) {
        setIsLoading(true);
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };

        const data = {
          product_id: product.id,
          order_quantity: 1,
        };

        const body = JSON.stringify(data);
        const response = await API.post("/cart", body, config);
        window.dispatchEvent(new Event("badge"));
        setIsLoading(false);
        handleShowModalSuccess();
        console.log("Add Cart success :", response);
      } else {
        handleShowLogin();
      }
    } catch (error) {
      setIsLoading(false);
      console.log("transaction failed : ", error);
    }
  });

  useEffect(() => {
    refetch();
  }, [showSuccessAlert]);

  return (
    <>
      <Container>
        <Row className="p-5 m-auto">
          <Col>
            <Image
              className="w-100"
              alt="photo-product"
              src={`${product?.image}`}
            />
          </Col>
          <Col className="align-items-center m-auto justify-content-center">
            <h1 className="header-color">{product?.name}</h1>
            <p className="header-color fs-4 mb-5">Stock: {product?.stock}</p>
            <p className="fs-5">{product?.description}</p>
            <br />
            <br />
            <p className="d-flex justify-content-end fs-3 fw-bolder header-color">
              {ConvertFormatRupiah(product?.price)}
            </p>

            {state.user.role !== "admin" ? (
              <Button
                disabled={product?.stock == 0 ? true : false}
                onClick={(e) => {
                  handleCart.mutate(e);
                }}
                className="w-100 fs-4 main-button"
              >
                {isLoading ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    {product?.stock <= 0 ? (
                      <>Out of stock</>
                    ) : (
                      <> Add to cart </>
                    )}
                  </>
                )}
              </Button>
            ) : (
              <Button
                className="w-100 fs-4 main-button"
                onClick={() => navigate("/update-product/" + product.id)}
              >
                Edit Product
              </Button>
            )}
          </Col>
        </Row>
      </Container>
      <ModalSuccessAddCart
        show={showSuccessAlert}
        onHide={handleCloseModalSuccess}
        image={product?.image}
        price={product?.price}
        name={product?.name}
      />

      <ModalFailed
        show={showFailedAlert}
        onHide={handleCloseModalFailed}
        content={"Failed add product to cart"}
      />

      <ModalLogin
        show={showLogin}
        onHide={() => handleCloseLogin()}
        handleRegister={() => popRegister()}
        product={product}
        handleSuccessCart={() => popSuccessCart()}
      />

      <ModalRegister
        show={showRegister}
        onHide={() => handleCloseRegister()}
        handleLogin={() => popLogin()}
      />
    </>
  );
}
