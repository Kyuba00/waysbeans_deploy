import { useContext } from 'react';
import { Row, Col, NavDropdown, Image, Dropdown, NavLink } from 'react-bootstrap'
import { useQuery } from 'react-query';
import { Link, useNavigate } from 'react-router-dom'
import { API } from '../../config/api';
import { UserContext } from '../../context/userContext';

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

export default function DropDownUser(props) {
    let { data: profile,refetch : refetchProfile } = useQuery("profileCache", async () => {
        const response = await API.get("/profile/user");
        return response.data.data;
    })

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
            <Col>
                <Row className="align-items-center d-flex justify-content-center m-auto">
                    <Col md="4" className="p-0 m-auto me-3">
                        <div className="col-sm-4">
                            <div className="item">
                                <NavLink as={Link} to="/cart">
                                    {props.badgeQty ? <span className="notify-badge" >{props.badgeQty}</span> : <></>}
                                    <Image role="button" style={style.avatarImage} className="m-auto me-4" src={`/${"cart.png"}`} />
                                </NavLink>
                            </div>
                        </div>
                        {/* </Link>  */}
                    </Col>

                    <Col md="6" className="p-0 m-auto">
                        <NavDropdown
                            title={<Image style={style.roundedImage} className="m-auto " src={`${profile?.profile_picture}`} alt="user pic" />} id="basic-nav-dropdown">
                            <div style={style.dropDownContainer}>
                                <NavDropdown.Item
                                    as={Link}
                                    to="/profile"
                                    style={style.dropDownContainer} className="py-2 me-5">
                                    <img src="/user-icon.png" style={style.dropDownIcon} className="m-auto me-3" alt="icon"/>Profile
                                </NavDropdown.Item >
                                <Dropdown.Divider style={style.dropDownContainer} />
                                <NavDropdown.Item

                                    onClick={logout}
                                    style={style.dropDownContainer} className="py-2 me-5">
                                    <img src="/logout.png" style={style.dropDownIcon} className="m-auto me-3" alt="icon"/>Logout
                                </NavDropdown.Item>
                            </div>
                        </NavDropdown>
                    </Col>
                </Row>
            </Col>
        </>
    )
}