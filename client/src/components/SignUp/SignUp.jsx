import React, { useState } from "react";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";
import Header from "../Header/Header";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import "./SignUp.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

function SignUp() {
	const [form, setform] = useState({
		userName: "",
		password: "",
		password2: "",
	});
	const [errors, setErrors] = useState({});
	const [showPassword, setShowPassword] = useState(false);
	const [successMsg, setSuccessMsg] = useState("");
	const navigate = useNavigate();

	const handleChange = (e) => {
		const fieldName = e.target.name;
		const fieldValue = e.target.value;
		setform({ ...form, [fieldName]: fieldValue });
	};
	const handleToggle = () => {
		setShowPassword(!showPassword);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		const newErrors = {};

		if (form.userName === "") {
			newErrors.userName = "Username required";
		} else if (/\s/.test(form.userName)) {
			newErrors.userName = "Username should not contain spaces";
		}

		if (form.password === "") {
			newErrors.password = "Password required";
		} else if (form.password.length < 5) {
			newErrors.password = "5 or more characters required";
		}

		if (form.password2 === "") {
			newErrors.password2 = "Password required";
		} else if (form.password !== form.password2) {
			newErrors.password2 = "Passwords do not match";
		}

		if (Object.keys(newErrors).length === 0) {
			try {
				await axios.post("/users", form);
				setSuccessMsg(
					"Successfully signed up! Please log in with your new account."
				);
				setErrors({});
				setTimeout(() => {
					navigate("/login");
				}, 6000);
			} catch (error) {
				console.log("Registration error:", error.response.data.msg);
				alert(error.response.data.msg);
			}
		}

		setErrors(newErrors);
	};

	return (
		<>
			<Header />
			<Container className="main__wrapper">
				<Row>
					<Col>
						<div className="header">
							<h3 className="">Create An Account</h3>
						</div>

						<Form className="form_container" onSubmit={handleSubmit}>
							<div className="success-message">{successMsg}</div>
							<Form.Group controlId="userName">
								<Form.Label>Username</Form.Label>
								<Form.Control
									type="text"
									name="userName"
									placeholder="Username"
									value={form.userName}
									onChange={handleChange}
									autoComplete="off"
									className={`${
										errors.userName ? "alert-danger" : form.userName ? "" : ""
									}`}
									// required
								/>
								<Form.Control.Feedback className="fs-6 " type="invalid">
									{errors.userName}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group controlId="password">
								<Form.Label>Password</Form.Label>
								<Form.Control
									type={showPassword ? "text" : "password"}
									placeholder="Password"
									name="password"
									value={form.password}
									onChange={handleChange}
									// required

									className={`${
										errors.password ? "alert-danger" : form.password ? "" : ""
									}`}
								/>
								<span
									style={{
										position: "relative",
									}}
								>
									<i
										onClick={handleToggle}
										style={{
											position: "absolute",
											top: "0",
											right: "10px",
											cursor: "pointer",
										}}
									>
										{showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
									</i>
								</span>

								<Form.Control.Feedback className="fs-6" type="invalid">
									{errors.password}
								</Form.Control.Feedback>
							</Form.Group>

							<Form.Group controlId="password2">
								<Form.Label className="">Password Check</Form.Label>
								<Form.Control
									type="password"
									name="password2"
									placeholder="Password"
									value={form.password2}
									onChange={handleChange}
									className={`${
										errors.password2 ? "alert-danger" : form.password2 ? "" : ""
									}`}
									// required
								/>
								<Form.Control.Feedback className="fs-6" type="invalid">
									{errors.password2}
								</Form.Control.Feedback>
							</Form.Group>
							<p></p>
							<Button type="submit">Submit</Button>

							<div className="new-acc">
								Already have an account?
								<Link to={"/login"} className="fs-4">
									Login
								</Link>
							</div>
						</Form>
					</Col>
				</Row>
			</Container>
		</>
	);
}

export default SignUp;
