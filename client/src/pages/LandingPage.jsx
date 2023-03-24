import { Container, Col, Row } from 'react-bootstrap'
import { useQuery } from 'react-query';
import Brand from '../components/brand/Brand'
import CardProduct from '../components/product/CardProduct'
import { API } from '../config/api';


export default function LandingPage() {
    const title = "Home";
    document.title = "Waysbeans | " + title;
    
    const style = {
        jumbotron: {
            height: "450px"
        },
        title: {
            fontSize: "100px",
            marginBottom: "50px",
        }, rectangle3: {
            position: "absolute",
            top: "250px",
            right: "290px",
            width: "450px"
        }
    };

    
    let { data: products } = useQuery("productsCache", async () => {
        const response = await API.get("/products");
        return response.data.data;
    })

    return (
        <>
            <Container className="p-5" >
                <Container style={style.jumbotron} className=" m-auto ">

                    <Row style={{ backgroundColor: "#DBB699", width: "90%", height: "100%" }} className="">
                        <Col md="7" className="p-5 d-grid align-items-center">
                            <h1 className="charlesSebastian" style={style.title}>
                                <Brand imgSize="50px" />
                            </h1>
                            <p className="fs-2 m-0 mb-3">BEST QUALITY COFFEE BEANS</p>
                            <p className="fs-3 m-0">Quality freshly roasted coffee made just for you. Pour, brew and enjoy</p>
                        </Col>
                        <Col md="5" className="d-flex align-items-end">
                            <div className="d-grid p-0 pb-4">
                                <img className='w-100 mb-3' src="vector.png" alt="" />
                                <img className='w-100 mb-3' src="vector.png" alt="" />
                                <img className='w-100' src="vector.png" alt="" />
                            </div>
                        </Col>
                    </Row>
                    <img style={style.rectangle3} src="Rectangle 3.png" alt="" />

                </Container>
                <Container className="mt-3 p-0 w-100">
                    <Row md="4">
                        {products?.map((item, index) => (
                            <CardProduct product={item} key={index} />
                        ))}
                    </Row>
                </Container>
            </Container>


        </>
    )
}