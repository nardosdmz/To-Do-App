import React from "react";
import "./Four04.css";
import { Link } from "react-router-dom";
import errbg from "../../assets/image/output.jpg";

const NotFound = () => {
	return (
		<section
			style={{
				backgroundImage: `url(${errbg})`,
				backgroundSize: "cover",
				backgroundPosition: "center",
				backgroundRepeat: "no-repeat",
				height: "100vh",
			}}
		>
			<div className="not-found-container">
				<h2 className="not-found-title">404 - Not Found</h2>{" "}
				<p className="not-found-message">
					The page you are looking for does not exist.
				</p>
				<Link className="back-to-home" to="/">
					Back to home
				</Link>
			</div>
		</section>
	);
};

export default NotFound;
