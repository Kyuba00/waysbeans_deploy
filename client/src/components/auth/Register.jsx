import React, { useState } from 'react';
import { Alert, Container, Button } from 'react-bootstrap';
import { useMutation } from 'react-query';

import { API } from '../../config/api';

export default function Register({ handleLogin }) {


    const [message, setMessage] = useState(null);

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
    })
    const { name, email, password } = form;

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
        console.log(form)
    };

    const handleSubmit = useMutation(async (e) => {
        try {
            e.preventDefault();

            const response = await API.post('/register', form);

            console.log("Register success : " + response)

            const alert = (
                <Alert variant="success" className="py-1">
                    Register success !
                </Alert>
            );
            setMessage(alert);
            setForm({
                name: '',
                email: '',
                password: '',
            });
            handleLogin()
        } catch (error) {
            const alert = (
                <Alert variant='danger' className='py-1'>
                    Failed to register!
                </Alert>
            );
            setMessage(alert);
            console.log("register failed : ", error);
        }
    });

    return (
        <>
            <Container className=' w-100'>
                <h1 className='main-title-form'>Register</h1>
                {message && message}
                <form onSubmit={(e) => handleSubmit.mutate(e)}>
                    <div className='auth-container form d-grid'>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            name="email"
                            onChange={handleChange}
                            className="px-3 py-2 mt-3 main-input"
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            name="password"
                            onChange={handleChange}
                            className="px-3 py-2 mt-3 main-input"
                        />
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={name}
                            name="name"
                            onChange={handleChange}
                            className="px-3 py-2  mt-3 main-input"
                        />
                    </div>
                    <div>
                        <Button className='main-button' type="submit">
                            Register
                        </Button>
                    </div>
                </form>
            </Container>
        </>
    )
};