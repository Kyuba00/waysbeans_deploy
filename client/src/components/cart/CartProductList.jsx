
import { Row, Col, Form, Button } from 'react-bootstrap'

import { ConvertFormatRupiah } from "../../utils";

export default function CartProductList({incrementCart, decrementCart, carts, deleteCart,message}) {
     
    return (
        <>
            {carts?.map((item, index) => (
                <div key={index}>
                    <hr className="horizontalRule" />
                    <Row>
                        
                        {item.message}
                        <Col md="2" className="m-auto">
                            <img className='w-100' src={`${item.products.image}`} alt="" />
                        </Col>
                        <Col className='d-flex align-items-center'>
                            <Form>
                                <p className='mb-2 fs-5 headerColor fw-bold w-100'>{item.products.name}</p>
                                <Button
                                    variant="link"
                                    style={{ textDecoration: "none", color: "black" }}
                                    className='fs-1 headerColor user-select-none p-0 pb-3'
                                    onClick={() => decrementCart(item.id, item.order_quantity,item.product_id)}
                                >-</Button>
                                <Form.Control
                                    style={{
                                        width: "50px",
                                        height: "40px",
                                        backgroundColor: "#F6E6DA",
                                        textAlign: "center"
                                    }}
                                    className='d-inline mx-3'
                                    value={item.order_quantity}
                                    readOnly
                                />
                                <Button
                                    variant="link"
                                    style={{ textDecoration: "none", color: "black" }}
                                    className='fs-1 headerColor user-select-none p-0 pb-3'
                                    onClick={() => incrementCart(item.id, item.order_quantity,item.product_id)}>
                                    +
                                </Button>
                            </Form>

                        </Col>
                        <Col className="d-grid align-items-center justify-content-end">
                            <div>
                                <p className='d-flex justify-content-end'>Stock: {item.products.stock} pcs</p>
                                <p className='d-flex justify-content-end'>{ConvertFormatRupiah(item.products.price)}</p>
                                <img as={Button} onClick={() => deleteCart.mutate(item.id)} className='image-fluid float-end w-25' src="/trash.png" alt="" />

                            </div>
                        </Col>
                    </Row>
                    <hr className="horizontalRule" />
                </div>
            ))}
        </>
    )
}