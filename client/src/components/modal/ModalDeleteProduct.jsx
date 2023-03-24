import { Button, Modal } from "react-bootstrap";

export default function ModalDeleteProduct(props) {
    const handleDelete = () => {
        props.setConfirmDelete(true)
    }
    return (
        <>
            <Modal show={props.show} onHide={props.onHide} centered
                className="">
                <Modal.Body>
                    <p>Delete this product ?</p>
                    <div className="justify-content-center d-flex gap-4">
                        <Button onClick={handleDelete} variant="danger" className="px-5">Yes</Button>
                        <Button onClick={props.handleCloseModalDelete} variant="success" className="px-5">No</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}