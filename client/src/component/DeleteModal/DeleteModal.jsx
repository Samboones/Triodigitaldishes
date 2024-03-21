import React from "react";
import { Modal, Button } from "react-bootstrap";

const DeleteModal = ({ show, handleClose, handleDelete }) => {
    return (
        <Modal show={show}>
            <Modal.Header closeButton>
                <Modal.Title>Delete Recipe??</Modal.Title>
            </Modal.Header>
            <Modal.Body>Are you sure you wish to delete this recipe?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;