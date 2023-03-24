
import { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap'
import { useQuery } from 'react-query';
import ModalRegisterProfile from '../components/modal/ModalRegisterProfile';
import ProfileTransactions from '../components/transaction/ProfileTransactions';
import { API } from '../config/api';

export default function ProfilePage() {
    const title = "Profile";
    document.title = "Waysbeans | " + title;

    const [showModalProfile, setShowModalProfile] = useState(false)

    const handleShowModalProfile = () => setShowModalProfile(true)
    const handleCloseModalProfile = () => setShowModalProfile(false)

    let { data: transactions, refetch } = useQuery("transactionListCache", async () => {
        const response = await API.get("/transactions/user");
        return response.data.data;
    })

    let { data: profile,refetch : refetchProfile } = useQuery("profileCache", async () => {
        const response = await API.get("/profile/user");
        return response.data.data;
    })

    useEffect(() => {
      refetchProfile()
    }, [])
    

    return (
        <>
            <Container className='p-5'>
                <Row>
                    <Col md="4">
                    <h4 className='headerColor fw-bold mb-4'>My Profile</h4>
                        <Container className='p-3'>
                          
                            <Row>
                                <Col md="6">
                                    <Row className='d-flex justify-content-center'>
                                        <img className='w-100 mb-2' src={`${profile?.profile_picture}`} alt="" />
                                        <Button onClick={handleShowModalProfile}  className='w-75 main-button py-2 fs-6'>Update Profile</Button>
                                    </Row>
                                </Col>
                                <Col>
                                    <div className='mb-5'>
                                        <p className="headerColor fw-bold m-0 fs-5">Full Name</p>
                                        <p className='m-0 mb-3'>{profile?.name}</p>
                                    
                                        <p className="headerColor fw-bold m-0 fs-5">Email</p>
                                        <p className='m-0 mb-3'>{profile?.user.email}</p>

                                        <p className="headerColor fw-bold m-0 fs-5">Phone</p>
                                        <p className='m-0 mb-3'>{profile?.phone}</p>

                                        <p className="headerColor fw-bold m-0 fs-5">Post Code</p>
                                        <p className='m-0 mb-3'>{profile?.post_code}</p>

                                        <p className="headerColor fw-bold m-0 fs-5">Address</p>
                                        <p className='m-0'>{profile?.address}</p>
                                    </div>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                    <Col>

                        <Container>
                            <h4 className='headerColor fw-bold mb-4'>My Transaction</h4>
                            <ProfileTransactions transactions={transactions} />
                        </Container>
                    </Col>
                </Row>
            </Container>
            <ModalRegisterProfile 
                show={showModalProfile}
                onHide={handleCloseModalProfile}
                refetchProfile={refetchProfile}
            />
        </>
    )
}