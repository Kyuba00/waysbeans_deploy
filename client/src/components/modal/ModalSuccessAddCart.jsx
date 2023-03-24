import { Col, Container, Modal, Row } from "react-bootstrap";
import { useQuery } from "react-query";
import { API } from "../../config/api";
import CartProductList from "../cart/CartProductList";
import CardProduct from "../product/CardProduct";
import SuccessAddToCart from "../product/SuccessAddToCart";

export default function ModalSuccessAddCart({ show, onHide, image, price, name }) {
    let { data: products } = useQuery("productsCache", async () => {
        const response = await API.get("/products/top");
        return response.data.data;
    })
    return (
        <>

            <Modal className="modal-xl" show={show} onHide={onHide} centered>
            
                <Modal.Title className="p-3">Success add to cart</Modal.Title>
                <Modal.Body className=" m-auto p-3 w-100">
                    <Col>
                        <Row className="mb-3">
                            <SuccessAddToCart
                                image={image}
                                price={price}
                                name={name}
                            />
                        </Row>
                        <Row  md="10">
                        <h3 className="mb-2">Our Products</h3>
                            {products?.map((item, index) => (
                                <CardProduct product={item} key={index} onHide={onHide}/>

                            ))}
                        </Row>
                    </Col>
                </Modal.Body>
            </Modal>

        </>
    )
}