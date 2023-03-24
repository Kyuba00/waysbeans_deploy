import { Modal, Alert } from "react-bootstrap";

export default function ModalFailed(props) {

    return (
        <>
            <Modal show={props.show} onHide={props.onHide} centered>
                <Modal.Body className=" m-auto p-0 w-100">
                    <div >
                        <Alert className="w-100 m-auto fs-2" style={{ textAlign: "center" }} variant="danger">
                            {props.content}
                        </Alert>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}