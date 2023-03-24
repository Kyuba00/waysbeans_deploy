import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { API } from "../../config/api";

const style = {
  textInput: {
    height: "50px",
    backgroundColor: "#D7CECA",

    border: "solid 2px #613D2B",
    fontSize: "18px",
  },
};

export default function Shipping(props) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    post_code: "",
    address: "",
  });

  async function getDataUpdate() {
    const response = await API.get("/profile/user");
    setForm({
      ...form,
      name: response.data.data.name,
      email: response.data.data.user.email,
      phone: response.data.data.phone,
      post_code: response.data.data.post_code,
      address: response.data.data.address,
    });
    // setIsLoading(false)
  }

  useEffect(() => {
    getDataUpdate();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const config = {
        headers: {
          "Content-type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.set("name", form.name);
      formData.set("email", form.email);
      formData.set("phone", form.phone);
      formData.set("post_code", form.post_code);
      formData.set("address", form.address);

      const response = await API.patch("/transaction", formData, config);
      console.log("success shipping: ", response.data.data.token);
      const token = response.data.data.token;
      window.snap.pay(token, {
        onSuccess: function (result) {
          console.log(result);
          window.dispatchEvent(new Event("badge"));
          props.handleSuccess();
          navigate("/profile");
        },
        onPending: function (result) {
          console.log(result);
          window.dispatchEvent(new Event("badge"));
          props.handleSuccess();
          navigate("/profile");
        },
        onError: function (result) {
          console.log(result);
          window.dispatchEvent(new Event("badge"));
          props.handleSuccess();
          navigate("/profile");
        },
        onClose: function () {
          alert("you closed the popup without finishing the payment");
        },
      });
    } catch (error) {
      console.log("transaction failed: ", error);
    }
  });

  useEffect(() => {
    const midtransScriptUrl = "https://app.sandbox.midtrans.com/snap/snap.js";

    const myMidtransClientKey = process.env.REACT_APP_MIDTRANS_CLIENT_KEY;

    let scriptTag = document.createElement("script");
    scriptTag.src = midtransScriptUrl;
    scriptTag.setAttribute("data-client-key", myMidtransClientKey);

    document.body.appendChild(scriptTag);
    return () => {
      document.body.removeChild(scriptTag);
    };
  }, []);

  return (
    <>
      <Container>
        <h2 className="mb-2">Confirm Order</h2>
        <hr />
        <Form onSubmit={(e) => handleSubmit.mutate(e)}>
          <Form.Label className="mb-3 w-100 fs-5">
            <h4>Name:</h4>
            <Form.Control
              onChange={handleChange}
              name="name"
              type="text"
              style={style.textInput}
              value={form?.name}
              placeholder="Name"
            />
          </Form.Label>
          <Form.Label className="mb-3 w-100 fs-5">
            <h4>Email:</h4>
            <Form.Control
              onChange={handleChange}
              name="email"
              type="email"
              style={style.textInput}
              value={form?.email}
              placeholder="Email"
            />
          </Form.Label>
          <Form.Label className="mb-3 w-100 fs-5">
            <h4>Phone:</h4>
            <Form.Control
              onChange={handleChange}
              name="phone"
              type="text"
              style={style.textInput}
              value={form?.phone}
              placeholder="Phone"
            />
          </Form.Label>
          <Form.Label className="mb-3 w-100 fs-5">
            <h4>Post Code:</h4>
            <Form.Control
              onChange={handleChange}
              name="post_code"
              type="text"
              style={style.textInput}
              value={form?.post_code}
              placeholder="Post Code"
            />
          </Form.Label>
          <Form.Label className="mb-3 w-100 fs-5">
            <h4>Address:</h4>
            <Form.Control
              onChange={handleChange}
              name="address"
              type="text"
              style={style.textInput}
              value={form?.address}
              placeholder="Address"
            />
          </Form.Label>
          <Button
            onclick={() => handleSubmit.mutate()}
            className="main-button w-100 m-auto justify-content-center d-flex"
            type="submit"
          >
            Confirm
          </Button>
        </Form>
      </Container>
    </>
  );
}
