import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import Header from "../Header/Header";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import axios from "../axios";
import "./Login.css";
import { Link, useNavigate } from "react-router-dom";

function Login() {
	const [userData, setUserData] = useUser();
	const [formData, setFormData] = useState({
		userName: "",
		password: "",
	});
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const [errors, setErrors] = useState({});

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};
	const handleToggle = () => {
		setShowPassword(!showPassword);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();

		const newErrors = {};

		if (formData.userName === "") {
			newErrors.userName = "Username required";
		}

		if (formData.password === "") {
			newErrors.password = "Password required";
		}

		if (Object.keys(newErrors).length === 0) {
			try {
				const loginRes = await axios.post("/users/login", {
					userName: formData.userName,
					password: formData.password,
				});

				if (loginRes && loginRes.data) {
					console.log("Token:", loginRes.data.token);
					console.log("User:", loginRes.data.user);
					setUserData({
						token: loginRes.data.token,
						user: loginRes.data.user,
					});

					localStorage.setItem("authtoken", loginRes.data.token);
					navigate("/");
				} else {
					console.error("No data received in login response");
				}
			} catch (error) {
				console.log("Error:", error.response.data.msg);
				alert(error.response.data.msg);
			}
		}

		setErrors(newErrors);
	};

	return (
		<>
			<Header />
			<div>
				<Container className="main__wrapper">
					<Row>
						<Col>
							<div className="header">
								<h3 className="form-head">Login</h3>
							</div>

							<Form className="form_container" onSubmit={handleSubmit}>
								<Form.Group controlId="userName">
									<Form.Label>userName</Form.Label>
									<Form.Control
										type="text"
										name="userName"
										placeholder="Username"
										value={formData.userName}
										onChange={handleChange}
										isInvalid={!!errors.userName}
										className={`${
											errors.userName
												? "alert-danger"
												: errors.userName || formData.userName
												? ""
												: ""
										}`}
										// required
									/>
									<Form.Control.Feedback className="fs-6" type="invalid">
										{errors.userName}
									</Form.Control.Feedback>
								</Form.Group>

								<Form.Group controlId="password">
									<Form.Label>Password</Form.Label>
									<Form.Control
										type={showPassword ? "text" : "password"}
										placeholder="Password"
										name="password"
										value={formData.password}
										onChange={handleChange}
										isInvalid={!!errors.password}
										className={`${
											errors.password
												? "alert-danger"
												: formData.password
												? ""
												: ""
										}`}
										// required
									/>
									<span
										style={{
											position: "relative",
										}}
									>
										<i
											className="small-icon"
											onClick={handleToggle}
											style={{
												position: "absolute",
												top: "0",
												right: "10px",
												cursor: "pointer",
											}}
										>
											{showPassword ? (
												<VisibilityIcon />
											) : (
												<VisibilityOffIcon />
											)}
										</i>
									</span>
									<Form.Control.Feedback className="fs-6" type="invalid">
										{errors.password}
									</Form.Control.Feedback>
								</Form.Group>
								{/* <br /> */}
								<Link to={"/login"} className="fs-2">
									Forget Password?
								</Link>

								<Button type="submit">Login</Button>

								<div className="new-acc">
									Don't have an account?
									<Link to={"/signup"} className="fs-4">
										Create a new account
									</Link>
								</div>
							</Form>
						</Col>
					</Row>
				</Container>
			</div>
		</>
	);
}

export default Login;
