import { Card, Col, Row } from "react-bootstrap";
import { ConvertFormatDate, ConvertFormatRupiah } from "../../utils";
import Brand from "../brand/Brand";

export default function TransactionDetail({ index, transaction }) {
  return (
    <>
      {transaction.carts.length > 0 && (
        <Card key={index}>
          <Card.Body className="cardTransaction">
            <h3>Order Number: {transaction.id}</h3>
            <p className="m-0">{ConvertFormatDate(transaction.updated_at)}</p>
            <hr />
            <Row className="d-flex align-items-start   ">
              <Col>
                {transaction.carts?.map((cart, index) => (
                  <Row
                    key={index}
                    className="px-3 mb-2 align-items-start d-flex"
                  >
                    <Col md="2">
                      <img
                        className="w-100"
                        src={`${cart.products.image}`}
                        alt=""
                      />
                    </Col>
                    <Col md="10">
                      <div className="mb-3">
                        <h5 className="fw-bold headerColor">
                          {cart.products.name}
                        </h5>
                      </div>
                      <div>
                        <p className="m-0">
                          Price: {ConvertFormatRupiah(cart.products.price)}
                        </p>
                        <p className="m-0">Qty: {cart.order_quantity}</p>
                        <h5 className="m-0 d-flex justify-content-end">
                          {" "}
                          {ConvertFormatRupiah(
                            cart.order_quantity * cart.products.price
                          )}
                        </h5>
                      </div>
                      <hr />
                    </Col>
                  </Row>
                ))}
              </Col>
              <Col className="d-flex justify-content-center" md="3">
                <div className="d-grid ">
                  <div className="m-auto mb-3">
                    <Brand imgSize="15px" />
                  </div>
                  <img className="w-50 m-auto" src="qr_code.png" alt="" />

                  {transaction.status == "Success" ? (
                    <div className="success-trans mt-3 d-flex  justify-content-center w-100 p-1">
                      <p className="m-0">{transaction.status}</p>
                    </div>
                  ) : (
                    <div className="waiting-trans mt-3 d-flex  justify-content-center w-100 p-1">
                      <p className="m-0">{transaction.status}</p>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <hr />
            <h3 className="m-0 headerColor fw-bold mt-3">
              Total : {ConvertFormatRupiah(transaction.sub_total)}
            </h3>
          </Card.Body>
        </Card>
      )}
    </>
  );
}
