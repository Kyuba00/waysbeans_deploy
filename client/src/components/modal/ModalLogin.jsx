import Login from '../auth/Login'
import { Button, Modal } from 'react-bootstrap'

export default function ModalLogin(props) {
    return (
        <>
            <Modal show={props.show} onHide={props.onHide} centered>
                <Modal.Body>
                    <Login onHide={props.onHide} product={props.product} handleSuccessCart={props.handleSuccessCart} />
                    <p className="text-center mt-3">Don't have an account ? Click
                        <span role={Button} onClick={props.handleRegister}> Here</span>
                    </p>
                </Modal.Body>
            </Modal>
        </>
    )
}