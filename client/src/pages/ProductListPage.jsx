import { useEffect, useState } from "react";
import { Container, Image, Table, Col, Row, Button } from "react-bootstrap";
import { useMutation, useQuery } from "react-query";
import { useNavigate } from "react-router"
import ModalDeleteProduct from "../components/modal/ModalDeleteProduct";
import { API } from "../config/api";




export default function ProductListPage() {
    
    let navigate = useNavigate();
    const title = "Product admin";
    document.title = "Waysbeans | " + title;

    let { data: products, refetch } = useQuery("productListCache", async () => {
        const response = await API.get("/products");
        return response.data.data;
    })

    const [productID, setProductID] = useState(null)
    const [confirmDelete, setConfirmDelete] = useState(null)
    const [showModalDelete, setShowModalDelete] = useState(false)
    const handleShowModalDelete = () => setShowModalDelete(true)
    const handleCloseModalDelete = () => setShowModalDelete(false)

    const handleDelete = (id) => {
        setProductID(id)
        handleShowModalDelete();
    }

    // if confirm is true, execute delete data
    const deleteByID = useMutation(async (id) => {
        try {
            await API.delete(`/product/${id}`);
            refetch();
        } catch (error) {
            console.log(error)
        }
    });

    const addProduct = () => {
        navigate("/add-product")
    }
    const handleNavigate = (id) => {
        navigate("/update-product/" + id)
    }

    useEffect(() => {
        if (confirmDelete) {
            handleCloseModalDelete();
            deleteByID.mutate(productID);
            setConfirmDelete(null)
        }
    }, [confirmDelete]);
    return (
        <>
            <Container>
                {products?.length !== 0 ?
                    <>
                        <h1>List Product</h1>
                        <Button
                                onClick={addProduct}
                                className="btn-dark"
                                style={{ width: "100px" }}
                            >
                                Add
                        </Button>
                        <Table className='mt-5' striped bordered hover>
                            <thead>
                               
                                    <th style={{ width: "50px" }}>No</th>
                                    <th style={{ width: "180px", textAlign: "center" }}>Image</th>
                                    <th style={{ width: "280px", textAlign: "center" }}>Name</th>
                                    <th style={{ width: "100px", textAlign: "center" }}>Stock</th>
                                    <th style={{ width: "120px", textAlign: "center" }}>Price</th>
                                    <th style={{ width: "240px", textAlign: "center" }}>Description</th>
                                    <th style={{ textAlign: "center" }}>Action</th>
                               
                            </thead>
                            <tbody>
                                {products?.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td className='d-flex justify-content-center'>
                                            <Image
                                                className="w-25"
                                                src={`${item.image}`}
                                            />
                                        </td>
                                        <td>{item.name}</td>
                                        <td>{item.stock}</td>
                                        <td>{item.price}</td>
                                        <td>{item.description}</td>
                                        <td>
                                            <Row className='m-auto'>
                                                <Col md="6" className='d-flex m-auto justify-content-center'>
                                                    <Button onClick={() => handleDelete(item.id)} variant="danger" className=' px-5' >Delete</Button>
                                                </Col>
                                                <Col md="6" className='d-flex m-auto justify-content-center'>
                                                    <Button onClick={() => handleNavigate(item.id)} variant="success" className=' px-5'>Update</Button>
                                                </Col>
                                            </Row>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </>
                    :
                    <p>Barang kosong</p>
                }
            </Container>

            <ModalDeleteProduct
                show={showModalDelete}
                handleCloseModalDelete={handleCloseModalDelete}
                setConfirmDelete={setConfirmDelete}

            />
        </>
    )
}