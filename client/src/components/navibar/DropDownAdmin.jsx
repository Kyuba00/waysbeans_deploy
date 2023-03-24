
import { useContext } from 'react'
import { Row, Col, NavDropdown, Image,Dropdown, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/userContext'

const style = {
    avatarImage: {
      width: "60px",
      heigth: "60px",
    },
    dropDownIcon: {
      width: "25px",
      heigth: "25px",
    },
    dropDownList: {
      outline: "none",
      textDecoration: "none"
    },
    roundedImage: {
      borderRadius: "100%",
      width: "60px",
      heigth: "60px",
    }
}
export default function DropDownAdmin() {
    const [state, dispatch] = useContext(UserContext)
    let navigate = useNavigate();
    const logout = () => {
        console.log(state)
        dispatch({
            type: "LOGOUT"
        })
        navigate("/")
    }

    return (
        <>
            <Row md="2" className="align-items-center d-flex justify-content-end">
                <Col>
                    <NavDropdown
                        title={<Image style={style.roundedImage} className="m-auto me-4" src={`/${"profile.png"}`} alt="user pic" />} id="basic-nav-dropdown">
                        <div style={style.dropDownContainer}>
                            <NavDropdown.Item
                                as={Link}
                                to="/add-product"
                                style={style.dropDownContainer} className="py-2 me-5">
                                <img src="/beans.png" style={style.dropDownIcon} className="m-auto me-3" />Add Product
                            </NavDropdown.Item >
                            <Dropdown.Divider style={style.dropDownContainer} />
                            <NavDropdown.Item
                                as={Link}
                                to="/list-product"
                                style={style.dropDownContainer} className="py-2 me-5">
                                <img src="/beans.png" style={style.dropDownIcon} className="m-auto me-3" />List Product
                            </NavDropdown.Item >
                            <Dropdown.Divider style={style.dropDownContainer} />
                            <NavDropdown.Item
                                as={Link}
                                to="/list-transaction"
                                style={style.dropDownContainer} className="py-2 me-5">
                                <img src="/beans.png" style={style.dropDownIcon} className="m-auto me-3" />List Transaction
                            </NavDropdown.Item >
                            <Dropdown.Divider style={style.dropDownContainer} />
                            <NavDropdown.Item
                                as={Button}
                                onClick={logout}
                                style={style.dropDownContainer} className="py-2 me-5">
                                <img src="/logout.png" style={style.dropDownIcon} className="m-auto me-3" />Logout
                            </NavDropdown.Item>
                        </div>
                    </NavDropdown>
                </Col>

            </Row>
        </>
    )
}