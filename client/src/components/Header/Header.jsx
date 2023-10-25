import React, { useState } from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import "./Header.css";
import { Link } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import DarkMode from "../DarkMode/DarkMode";

function Header() {
	const { userData, setUserData } = useUser();

	const logout = () => {
		setUserData({
			token: null,
			user: null,
		});
		localStorage.setItem("authtoken", "");
	};

	return (
		<>
			<Navbar className="nav-wrapper">
				<Container>
					<Navbar.Text>
						<h5 className="hello">
							Welcome{userData.user ? ":" : ""}
							{userData.user ? (
								<>
									<span className="userName-style">
										{userData.user.display_name}
									</span>
								</>
							) : (
								" "
							)}
						</h5>
						<Link to="/login">
							<Button onClick={logout} className="btn-logout">
								{userData.user ? "Log out" : "LogIn"}
							</Button>
						</Link>
						<DarkMode />
					</Navbar.Text>
				</Container>
			</Navbar>
		</>
	);
}

export default Header;
