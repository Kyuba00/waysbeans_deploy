import { Col, Container, Row, Form, Image, Button } from "react-bootstrap";
import React, { useEffect, useState } from 'react';

import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';



import { API } from '../config/api';
import LoadingSpinner from "../components/LoadingSpinner";
import ModalSuccess from "../components/modal/ModalSuccess";
import ModalFailed from "../components/modal/ModalFailed";


const style = {
    textInput: {
        height: "50px",
        backgroundColor: "#D7CECA",

        border: "solid 2px #613D2B",
        fontSize: "18px"
    },
    textAreaInput: {
        height: "122px",
        backgroundColor: "#D7CECA",

        border: "solid 2px #613D2B",
        fontSize: "18px"
    },
    fileInput: {
        width: "250px",
        height: "50px",
        backgroundColor: "#D7CECA",
        color: "#9C867A",
        border: "solid 2px #613D2B",
        fontSize: "14px"
    }
}

export default function CreateProductPage() {
    const title = 'Add Product';
    document.title = 'Waysbeans | ' + title;
    let navigate = useNavigate();
    const [preview, setPreview] = useState(null);
    const [form, setForm] = useState({
        image: '',
        name: '',
        description: '',
        price: '',
        stock: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false)
    const handleShowModalSuccess = () => setShowSuccessAlert(true)
    const handleCloseModalSuccess = () => {
        setShowSuccessAlert(false)
        navigate('/list-product')
    }

    const [showFailedAlert, setShowFailedAlert] = useState(false)
    const handleShowModalFailed = () => setShowFailedAlert(true)
    const handleCloseModalFailed = () => setShowFailedAlert(false)

    const handleOnChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.type === 'file' ? e.target.files : e.target.value,
        })


        if (e.target.type === 'file') {
            let url = URL.createObjectURL(e.target.files[0]);
            setPreview(url);
        }
        console.log(form)
    }

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();
            setIsLoading(true);
            const config = {
                headers: {
                    'Content-type': 'multipart/form-data',
                },
            };

            const formData = new FormData();
            formData.set('image', form.image[0]);
            formData.set('name', form.name);
            formData.set('description', form.description);
            formData.set('price', form.price);
            formData.set('stock', form.stock);

            const response = await API.post('/product', formData, config);
            console.log("add product success : ", response);
            setIsLoading(false);
            handleShowModalSuccess();
        } catch (error) {
            console.log("add product failed: ", error)
            setIsLoading(false)
            handleShowModalFailed();
        }
    });


    return (
        <>
            <Container>
                <Row className="mt-1">
                    <Col md="6" className="me-5 d-grid">
                        <h3 className="headerColor fw-bold mb-2">
                            Add Product
                            {/* Add Product */}
                        </h3>
                        <Form onSubmit={(e) => handleSubmit.mutate(e)}>
                            <Form.Group className="mb-4 w-100 fs-1" controlId="formName">
                                <Form.Control
                                    onChange={handleOnChange}
                                    name="name"
                                    style={style.textInput}
                                    type="text"
                                    placeholder="Name"
                                />
                            </Form.Group>
                            <Form.Group className="mb-4 w-100 removeWebKit" controlId="formStock">
                                <Form.Control
                                    onChange={handleOnChange}

                                    name="stock"
                                    style={style.textInput}
                                    type="number"
                                    placeholder="Stock"
                                />
                            </Form.Group>
                            <Form.Group className="mb-4 w-100" controlId="formPrice">
                                <Form.Control
                                    onChange={handleOnChange}

                                    name="price"
                                    style={style.textInput}
                                    type="number"
                                    placeholder="Price"
                                />
                            </Form.Group>
                            <Form.Group className="mb-4 w-100" controlId="formDescription">
                                <Form.Control
                                    onChange={handleOnChange}

                                    name="description"
                                    style={style.textAreaInput}
                                    as="textarea"
                                    placeholder="Description Product"
                                />
                            </Form.Group>


                            <Form.Group controlId="formFile" className="mb-3 mt-3 ">
                                <Form.Label style={style.fileInput} className="rounded">
                                    <Row className="d-flex align-items-center  w-100 h-100 m-auto align-items-center">
                                        <Col md="8" className="m-auto align-items-center d-flex">
                                            <p className="m-0"> Photo Product</p>
                                        </Col>
                                        <Col md="4" className="d-flex justify-content-end">
                                            <Form.Control
                                                type="file"
                                                name="image"
                                                onChange={handleOnChange}
                                                hidden />
                                            <Image fluid src="/file_icon.png" style={{ width: "15px" }} alt="" />
                                        </Col>
                                    </Row>
                                </Form.Label>
                            </Form.Group>


                            <Button className="main-button w-50 m-auto justify-content-center d-flex" type="submit" disabled={isLoading}>
                                {isLoading ?
                                    (
                                        <LoadingSpinner />
                                    )
                                    :
                                    <>Add Product</>
                                }
                            </Button>
                        </Form>
                    </Col>
                    <Col md="5" className="p-4">
                        <img className="w-100 m-auto"
                            src={preview}
                            alt=""
                        />
                    </Col>
                </Row>
            </Container>
            <ModalSuccess
                show={showSuccessAlert}
                onHide={handleCloseModalSuccess}
                content={"Success add new product"}
            />

            <ModalFailed
                show={showFailedAlert}
                onHide={handleCloseModalFailed}
                content={"Failed add new product"}
            />
        </>
    )
}