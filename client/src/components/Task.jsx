import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "./axios";
import Header from "./Header/Header";
import { useUser } from "../context/UserContext";

function Task() {
	const inputDom = useRef(null);
	const [tasks, setTasks] = useState([]);
	const [loading, setloading] = useState(false);
	const { userData } = useUser();
	const navigate = useNavigate();
	useEffect(() => {
		fetchTask();
	}, []);

	// fetch all task
	async function fetchTask() {
		try {
			setloading(true);
			const userID = userData?.user?.id;
		
			if (userID) {
				const response = await axios(`/tasks/all-tasks?user_id=${userID}`);
				
				setTasks(response.data.data);
			} else {
				console.log("User ID is not available.");
			}

			setloading(false);
		} catch (error) {
			console.log("Error message:", error.message);
			setloading(false);
		}
	}

	// create task
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setloading(true);
			const value = inputDom.current.value;
			const IdUser = userData?.user?.id;

			if (value && IdUser) {
				const response = await axios.post("/tasks", {
					userId: IdUser,
					taskName: value,
				});
				const message = response.data.message;
				console.log(message);
			}
			fetchTask();
			inputDom.current.value = "";
		} catch (error) {
			console.log(error.message);
			setloading(false);
		}
	}
	// delete task
	async function handleDelete(id) {
		try {
			setloading(true);

			await axios.delete(`/tasks/task/${id}`);
			fetchTask();
			setloading(false);
		} catch (error) {
			setloading(false);
		}
	}

	useEffect(() => {
		if (!userData.user) navigate("/login");
	}, [userData.user, navigate]);

	return (
		<>
			<Header />
			<form onSubmit={handleSubmit} className="task-form">
				<h4>Task manager</h4>
				<div className="form_control">
					<input
						ref={inputDom}
						type="text"
						name="taskName"
						className="task-input"
						placeholder="e.g. learn reactJs"
					/>
					<button type="submit" className="btn submit-btn">
						Add
					</button>
				</div>

				<div className="form-alert"></div>
			</form>
			<section className="tasks-container">
				{/* all tasks */}
				{loading ? (
					<p className=" loading"></p>
				) : (
					<div className="tasks">
						{tasks.reverse().map((sTask) => {
							return (
								<div
									key={sTask.id}
									className={`single-task ${
										sTask.completed && "task-completed"
									}`}
								>
									<h5>
										<span>
											<i className="far fa-check-circle"></i>
										</span>
										{sTask.task_name}
									</h5>
									<div className="task-links">
										{/* <!-- edit link --> */}
										<Link to={"/task/" + sTask.id} className="edit-link">
											<i className="fas fa-edit"></i>
										</Link>
										{/* <!-- delete btn --> */}
										<button
											onClick={() => {
												handleDelete(sTask.id);
											}}
											type="button"
											className="delete-btn"
										>
											<i className="fas fa-trash"></i>
										</button>
									</div>
								</div>
							);
						})}
					</div>
				)}
			</section>
		</>
	);
}

export default Task;
