import Register from '../auth/Register'

import { Button, Modal } from 'react-bootstrap'
export default function ModalRegister(props) {

    return (
        <>
            <Modal show={props.show} onHide={props.onHide} centered>
                <Modal.Body>
                    <Register handleLogin={props.handleLogin}/>
                    <p className="text-center mt-3">Already have an account ?
                        Click <span role={Button} onClick={props.handleLogin}> Here</span>
                    </p>
                </Modal.Body>
            </Modal>
        </>
    )
}