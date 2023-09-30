import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

function EditTask() {
	const { id } = useParams();
	const inputDom = useRef(null);
	const checkBoxDom = useRef(null);

	const [task, setTask] = useState([]);

	useEffect(() => {
		fetchTask();
	}, [id]);

	// fetch all task
	async function fetchTask() {
		try {
			const { data } = await axios(`http://localhost:5000/task/${id}`);
			setTask(data.result);
			if (task.length > 0) {
				// data.result.length > 0{
				// }
				inputDom.current.value = abebe;

				checkBoxDom.current.checked = task[0].completed;
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	async function handleEdit(e) {
		e.preventDefault();
		const updatedName = inputDom.current.value;
		const updateCompleted = checkBoxDom.current.checked;

		try {
			await axios.patch(`http://localhost:5000/task/${id}`, {
				name: updatedName,
				completed: updateCompleted,
			});
			alert("Task Edited Successfully");
			window.location.reload();
		} catch (error) {
			console.log("Something went wrong");
		}
	}

	return (
		<>
			<div className="container">
				<form className="single-task-form" onSubmit={handleEdit}>
					<h4>Edit Task</h4>
					<div className="form-control">
						<label>Task ID</label>
						<p className="task-edit-id">{id}</p>
					</div>
					<div className="form-control">
						<label htmlFor="name">Name</label>
						<input
							ref={inputDom}
							type="text"
							name="name"
							className="task-edit-name"
						/>
					</div>
					<div className="form-control">
						<label htmlFor="completed">Completed</label>
						<input
							ref={checkBoxDom}
							type="checkbox"
							name="completed"
							className="task-edit-completed"
						/>
					</div>
					<button
						type="submit"
						className="block btn task-edit-btn"
						// onClick={handleClick}
					>
						Edit
					</button>
					<div className="form-alert"></div>
				</form>
				<Link to="/" className="btn back-link">
					Back to Tasks
				</Link>
			</div>
		</>
	);
}

export default EditTask;
