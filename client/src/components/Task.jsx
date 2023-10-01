import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";
function Task() {
	const inputDom = useRef(null);
	const [tasks, setTasks] = useState([]);
	const [loading, setloading] = useState(false);
	useEffect(() => {
		fetchTask();
	}, []);

	// fetch all task
	async function fetchTask() {
		try {
			setloading(true);
			const { data } = await axios("/all-tasks");
			setTasks(data.result);
			// console.log(tasks);
			setloading(false);
		} catch (error) {
			console.log(error.message);
			setloading(false);
		}
	}
	// create task
	async function handleSubmit(e) {
		e.preventDefault();
		try {
			setloading(true);
			const value = inputDom.current.value;
			if (value) {
				await axios.post("/create", {
					name: value,
				});
			}
			fetchTask();
			inputDom.current.value = "";
		} catch (error) {
			console.log(error.message);
			setloading(false);
		}
	}
	// delete task ??
	async function handleDelete(id) {
		try {
			setloading(true);
			// please call delete api request here
			await axios.delete(`/task/${id}`);
			fetchTask();
			setloading(false);
		} catch (error) {
			setloading(false);
		}
	}
	return (
		<>
			<form onSubmit={handleSubmit} className="task-form">
				<h4>task manager</h4>
				<div className="form-control">
					<input
						ref={inputDom}
						type="text"
						name="name"
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
						{tasks.map((sTask) => {
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
