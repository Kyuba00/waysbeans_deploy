import { useContext, useEffect, useState } from 'react';
import { Alert, Container, Button } from 'react-bootstrap';
import { useMutation } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

import { API, setAuthToken } from '../../config/api';


export default function Login({ onHide, product, handleSuccessCart }) {
    let navigate = useNavigate();

    const [state, dispatch] = useContext(UserContext);
    const [message, setMessage] = useState(null);
    const [form, setForm] = useState({
        email: '',
        password: '',
    });

    const { email, password } = form;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };



    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();
            const response = await API.post('/login', form);
            console.log('login success : ', response);
            dispatch({
                type: 'LOGIN_SUCCESS',
                payload: response.data.data,
            });

            setAuthToken(localStorage.token);
            console.log("Login", response.data.data.role)

            const alert = (
                <Alert variant="success" className='py-1'>
                    Login Success
                </Alert>
            );
            setMessage(alert);
            onHide();
        } catch (error) {
            const alert = (
                <Alert variant='danger' className='py-1'>
                    Login failed
                </Alert>
            );
            setMessage(alert);
            console.log("login failed: ", error)
        }
    });

    const handleLogin = useMutation(async () => {
        try {
            if (state.role === 'admin') {
                navigate('/list-transaction');
            } else {
                if (product) {
                    console.log("State ?",state)
                    if (state.user.role === 'admin') {
                        navigate('/list-transaction');
                    }
                    else {
                        const data = {
                            product_id: product.id,
                            order_quantity: 1,
                        };

                        const config = {
                            headers: {
                                'Content-type': 'application/json',
                            },
                        };
                        const body = JSON.stringify(data);
                        const response = await API.post('/cart', body, config);
                        //window.dispatchEvent(new Event("badge"));
                        handleSuccessCart()
                    }
                } else {
                    navigate('/profile')
                }
                window.dispatchEvent(new Event("badge"));

            }
        } catch (error) {
            console.log(error)
        }
    }

    )
    useEffect(() => {
        if (state.isLogin) {
            handleLogin.mutate()
        }
        console.log("State", state)
    }, [state])


    return (
        <>
            <Container className='w-100'>
                <h1 className='main-title-form'>Login</h1>
                {message && message}
                <form onSubmit={(e) => handleSubmit.mutate(e)}>
                    <div className='auth-container form d-grid'>
                        <input
                            type="email"
                            placeholder='Email'
                            value={email}
                            name="email"
                            onChange={handleChange}
                            className="px-3 py-2 mt-3 main-input"
                        />
                        <input
                            type='password'
                            placeholder='Password'
                            value={password}
                            name='password'
                            onChange={handleChange}
                            className="px-3 py-2 mt-3 main-input"
                        />
                    </div>
                    <div>
                        <Button className='main-button' type='submit'>
                            Login
                        </Button>
                    </div>
                </form>
            </Container>


        </>
    )

}
