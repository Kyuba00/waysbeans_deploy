import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useMutation } from "react-query";
import { API } from "../../config/api";

export default function ProfileRegister(props) {
  const [preview, setPreview] = useState("profile.png");
  const [profileId, setProfileId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    post_code: "",
    profile_picture: "",
  });

  async function getDataupdate() {
    const response = await API.get("/profile/user");
    setPreview(`${response.data.data.profile_picture}`);
    setProfileId(response.data.data.id);
    setForm({
      ...form,
      name: response.data.data.name,
      phone: response.data.data.phone,
      address: response.data.data.address,
      post_code: response.data.data.post_code,
      profile_picture: response.data.data.profile_picture,
    });
  }
  useEffect(() => {
    getDataupdate();
  }, []);

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();
      console.log(profileId);
      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      if (form.profile_picture) {
        formData.set("profile_picture", form?.profile_picture[0]);
      }
      formData.set("name", form.name);
      formData.set("phone", form.phone);
      formData.set("address", form.address);
      formData.set("post_code", form.post_code);

      const response = await API.patch(
        "/profile/" + profileId,
        formData,
        config
      );
      props.refetchProfile();
      props.onHide();
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  });
  return (
    <>
      <Container style={{ width: "500px" }}>
        <Form onSubmit={(e) => handleSubmit.mutate(e)}>
          <Row className="m-auto p-3">
            <Col className="m-auto d-grid justify-content-center align-items-center">
              <h3>Update Profile</h3>
              <img
                style={{ width: "300px", height: "300px" }}
                className="m-auto"
                src={`${preview}`}
                alt=""
              />
              <Form.Group controlId="formFile">
                <Form.Label className="d-flex main-button rounded justify-content-center w-75 m-auto mb-3 mt-2">
                  Choose Picture
                  <Form.Control
                    type="file"
                    name="profile_picture"
                    onChange={handleOnChange}
                    hidden
                  />
                </Form.Label>
              </Form.Group>

              <Form.Group controlId="formName">
                <Form.Control
                  type="text"
                  name="name"
                  value={form?.name}
                  onChange={handleOnChange}
                  placeholder="Name"
                  className="w-100 mb-3"
                />
              </Form.Group>
              <Form.Group controlId="formPhone">
                <Form.Control
                  type="text"
                  name="phone"
                  value={form?.phone}
                  onChange={handleOnChange}
                  placeholder="Phone"
                  className="w-100 mb-3"
                />
              </Form.Group>
              <Form.Group controlId="formAddress">
                <Form.Control
                  type="text"
                  name="address"
                  value={form?.address}
                  onChange={handleOnChange}
                  placeholder="Address"
                  className="w-100 mb-3"
                />
              </Form.Group>
              <Form.Group controlId="formPostCode">
                <Form.Control
                  type="text"
                  name="post_code"
                  value={form?.post_code}
                  onChange={handleOnChange}
                  placeholder="Post Code"
                  className="w-100"
                />
              </Form.Group>
              <Button type="submit" className="main-button py-2">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}
