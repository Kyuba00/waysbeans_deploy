import CartProductList from "../components/cart/CartProductList";
import { useEffect, useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { API } from '../config/api';
import { Row, Col, Container, Button, Alert } from 'react-bootstrap'
import CartSubTotal from "../components/cart/CartSubTotal";
import { useNavigate } from "react-router";


export default function CartPage() {
    const title = "Cart";
    document.title = "Waysbeans | " + title;
    const [cart, setCart] = useState(false)

    let navigate = useNavigate();
    let { data: carts, refetch: refetchCarts } = useQuery("cartsListCache", async () => {
        const response = await API.get("carts/not-checkout");
        response.data.data.forEach(element => {
            element.message = null;
        });
        return response.data.data;
    })

    let { data: transaction, refetch: refetchTransaction } = useQuery("transactionsListCache", async () => {
        const response = await API.get("transactions/unfinished");
        return response.data.data;
    })
    const incrementCart = (id, orderQuantity, product_id) => {
        setCart({
            id: id,
            product_id: product_id,
            order_quantity: orderQuantity + 1,
        })
    }

    const decrementCart = (id, orderQuantity, product_id) => {
        setCart({
            id: id,
            product_id: product_id,
            order_quantity: orderQuantity - 1,
        })
    }

    const updateCart = useMutation(async (id) => {
        try {
            //Configuration API 
            const config = {
                headers: {
                    'Content-type': 'application/json',
                },
            };
            const data = {
                product_id: cart.product_id,
                order_quantity: cart.order_quantity
            }
            const body = JSON.stringify(data)
            await API.patch('/cart/' + id, body, config);
            window.dispatchEvent(new Event("badge"))
            
            setMessageCarts(null)
            refetchCarts()
            refetchTransaction()
        } catch (error) {
            const newAlert = (
                <Alert variant="danger" className="py-1">
                    {error.response.data.message}
                </Alert>
            )
            
            setMessageCarts(newAlert)
        }
    })

    const deleteCart = useMutation(async (id) => {
        try {
            await API.delete(`/cart/${id}`);
            window.dispatchEvent(new Event("badge"))
            refetchCarts();
        } catch (error) {
            console.log(error)
        }
    });

    useEffect(() => {
        if (cart) {
            updateCart.mutate(cart.id)
        }
    }, [cart])


    function setMessageCarts(message) {
        var index = carts.findIndex(x => x.id === cart.id)
        carts[index].message = message
    }
    
    return (
        <>

            <Container className='mt-5 m-auto'>
                {carts?.length >= 1 ?
                    <Row className="d-flex">
                        <p className="headerColor fs-4 fw-bolder">My Cart</p>
                        <p className="fs-5">Review Your Order</p>

                        <Col md="8" className='mt-0'>
                            <Container>
                                <CartProductList
                                    incrementCart={incrementCart}
                                    decrementCart={decrementCart}
                                    deleteCart={deleteCart}
                                    carts={carts}
                                />
                            </Container>
                        </Col>
                        <Col>
                            <CartSubTotal transaction={transaction} />
                        </Col>
                    </Row>
                    :
                    <>
                        <h3 className="mb-4">There is no items in your Cart </h3>
                        <Button
                            className="w-25 main-button"
                            onClick={() => navigate("/")}>Shop Now ?</Button>
                    </>
                }
            </Container>


        </>
    )
}