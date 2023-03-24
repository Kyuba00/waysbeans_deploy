import { useState } from 'react';
import { Col, Container, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router';
import { ConvertFormatRupiah } from "../../utils";
import ModalShipping from '../modal/ModalShipping';
import ModalSuccessShipping from "../modal/ModalSuccessShipping";


export default function CartSubTotal({ transaction }) {
    let navigate = useNavigate();
    const [showShipping, setShowShipping] = useState(null)
    const [showSuccess, setShowsuccess] = useState(null)
    const handleShowShipping = () => setShowShipping(true)
    const handleCloseShipping = () => setShowShipping(false)

    const handleCloseSuccess = () => {
        setShowsuccess(false)
        window.dispatchEvent(new Event("badge"));
        navigate('/profile');
    }

    const popSuccess = () => {
        setShowsuccess(true)
        setShowShipping(false)
    }


    return (
        <>
            <hr />
            <Container className='d-flex' >
                <Col md="3" className='d-flex' >
                    <div>
                        <p className='m-0 w-100'>Subtotal</p>
                        <p className='m-0 w-100'>Qty</p>
                    </div>
                </Col>
                <Col className='d-flex justify-content-end w-100'>
                    <div>
                        <p className=' m-0 w-100'>{ConvertFormatRupiah(transaction?.sub_total)}</p>
                        <p style={{ textAlign: "end" }} className=' m-0 w-100'>{transaction?.total_qty}</p>
                    </div>
                </Col>
            </Container>
            <hr />
            <Container className='d-flex'>
                <Col md="3">
                    <p className='headerColor fw-bold w-100'>Total</p>
                </Col>
                <Col className='d-flex justify-content-end w-100'>
                    <p className='m-0  headerColor fw-bold  '>{ConvertFormatRupiah(transaction?.sub_total)}</p>
                </Col>
            </Container>
            <Col></Col>

            <Col className=" p-0 d-flex justify-content-end">
                <Button
                    onClick={handleShowShipping}
                    className="w-100 fs-4 main-button">Pay</Button>
            </Col>
            <ModalShipping
                show={showShipping}
                onHide={handleCloseShipping}
                handleSuccess={popSuccess}
            />
            <ModalSuccessShipping
                show={showSuccess}
                onHide={handleCloseSuccess}
            />
        </>
    )
}