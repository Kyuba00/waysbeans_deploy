import { useContext } from "react";
import { Col, Card, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { ConvertFormatRupiah } from "../../utils";

export default function CardProduct(props) {
  const navigate = useNavigate();
  return (
    <>
      <Col key={props.index}>
        <div
          as={Button}
          onClick={() => navigate("/product/" + props.product.id)}
          style={{ textDecoration: "none" }}
        >
          <Card.Img
            onClick={() => props.onHide && props.onHide()}
            role="button"
            variant="top"
            src={`${props.product.image}`}
          />
          <Card.Body className="p-2 " style={{ backgroundColor: "#F6E6DA" }}>
            <Card.Title className="fs-6 mb-3 fw-bold header-color text-truncate">
              {props.product.name}
            </Card.Title>
            <Card.Text className="m-0 mb-1 header-color">
              {ConvertFormatRupiah(props.product.price)}
            </Card.Text>
            <Card.Text className="header-color">
              Stock : {props.product.stock}
            </Card.Text>
          </Card.Body>
        </div>
      </Col>
    </>
  );
}
