import React, { useEffect, useState, useRef } from "react";
import axios from "../axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../Header/Header";
import { useUser } from "../../context/UserContext";
import "./Edit.css";

function EditTask() {
	const { id } = useParams();
	const inputDom = useRef(null);
	const checkBoxDom = useRef(null);
	const dueDateDom = useRef(null);
	const [userData] = useUser();
	const navigate = useNavigate();
	const [success, setSuccess] = useState("");
	const [errMsg, setErrMsg] = useState("");
	const [task, setTask] = useState([]);

	useEffect(() => {
		fetchTask();
	}, [id]);

	// timer to clear the message after 5 seconds
	const showMessageFor = (message, setMessage) => {
		setMessage(message);
		setTimeout(() => {
			setMessage("");
		}, 5000);
	};

	useEffect(() => {
		if (errMsg) {
			showMessageFor(errMsg, setErrMsg);
		}
		if (success) {
			showMessageFor(success, setSuccess);
		}
	}, [errMsg, success]);

	// fetch all task
	// async function fetchTask() {
	// 	try {
	// 		const userID = userData?.user?.id;
	// 		console.log(userID, "userid");
	// 		console.log(id, "this is id ");

	// 		const { data } = await axios(`/tasks/task/${id}?user_id=${userID}`);
	// 		const taskData = data[0].task_name;
	// 		// console.log(taskData);
	// 		setTask(taskData);
	// 		// console.log(task);

	// 		if (taskData.length > 0) {
	// 			inputDom.current.value = taskData;
	// 			checkBoxDom.current.checked = data[0].completed;
	// 		}
	// 	} catch (error) {
	// 		console.log(error.message);
	// 	}
	// }
	async function fetchTask() {
		try {
			const userID = userData?.user?.id;
			console.log(userID, "userid");
			console.log(id, "this is id ");

			const { data } = await axios(`/tasks/task/${id}?user_id=${userID}`);
			const taskData = data[0];

			setTask(taskData);
			console.log(taskData);
			if (taskData) {
				inputDom.current.value = taskData.task_name;
				checkBoxDom.current.checked = taskData.completed;

				if (taskData.due_date && dueDateDom.current) {
					dueDateDom.current.value = taskData.due_date;
				}
			}
		} catch (error) {
			console.log(error.message);
		}
	}

	async function handleEdit(e) {
		e.preventDefault();
		const userID = userData?.user?.id;
		const updatedName = inputDom.current.value;
		const updateCompleted = checkBoxDom.current.checked ? 1 : 0;
		const dueDATE = dueDateDom.current.value;

		if (!updatedName) {
			setSuccess("");
			return setErrMsg("Please enter a name for the task");
		}

		try {
			const response = await axios.patch(
				`/tasks/task/${id}?user_id=${userID}`,
				{
					taskName: updatedName,
					completed: updateCompleted,
					dueDate: dueDATE,
				}
			);
			const responseData = response.data;
			if (responseData.message) {
				setErrMsg(responseData.message);
				setSuccess("");
			} else {
				setSuccess("Task Edited Successfully");
				setErrMsg("");
			}
			fetchTask();
		} catch (error) {
			console.log("Something went wrong");
		}
	}

	const handleDeleteDueDate = () => {
		const userID = userData?.user?.id;
		try {
			axios.put(`/tasks/task/${id}?user_id=${userID}`);

			setTask({ ...task, dueDate: null });
			fetchTask();
		} catch (error) {
			console.log("Something went wrong");
		}
	};

	function formatDate(isoDate) {
		const options = {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "numeric",
			minute: "numeric",
		};
		return new Date(isoDate).toLocaleString(undefined, options);
	}

	useEffect(() => {
		if (!userData.user) navigate("/login");
	}, [userData.user, navigate]);

	return (
		<>
			<Header />
			<div className="container">
				<form
					style={{ position: "relative" }}
					className="single-task-form"
					onSubmit={handleEdit}
				>
					<h4>Edit Task</h4>
					<div
						style={{
							color: "#2c7d2a",
							textAlign: "center",
							backgroundColor: "#d1f5d0",
							borderRadius: "2px",
						}}
					>
						{success}
					</div>
					<div
						style={{
							color: "#d93d3d",
							backgroundColor: "pink",
							borderRadius: "2px",
							textAlign: "center",
						}}
					>
						{errMsg}
					</div>

					{/* <div className="form-control">
						<label>Task ID</label>
						<p className="task-edit-id">{id}</p>
					</div> */}
					<div className="form-control">
						<label>Created On :</label>
						<p className="task-edit-id">{formatDate(task.created_at)}</p>
					</div>
					<div className="form-control name-row">
						<label htmlFor="taskName">Name :</label>
						<input
							ref={inputDom}
							type="text"
							name="taskName"
							className="task-edit-name"
						/>
					</div>
					<div className="form-control">
						<label htmlFor="completed">Completed :</label>
						<input
							ref={checkBoxDom}
							type="checkbox"
							name="completed"
							className="task-edit-completed"
						/>
					</div>

					{/* <div class="divider">
						<h5>Set a due date</h5>
					</div> */}
					<div className="line-container">
						<hr className="line" />
						<h5 className="line-text">Set a due date?</h5>
						<hr className="line" />
					</div>

					{/* <hr /> */}

					<div className="form-control">
						<label htmlFor="dueDate">
							Select Due Date & <span className="time">Time</span>{" "}
							<small>(both)</small> :
						</label>
						<input
							ref={dueDateDom}
							type="datetime-local" // Use an appropriate input type for date and time
							name="dueDate"
							className="task-edit-due-date"
							placeholder="Select Due Date and Time"
						/>
					</div>
					<div className="form-control">
						<label htmlFor="dueDate">Due Date :</label>
						{task.due_date ? (
							<p>
								{formatDate(task.due_date)}
								{"  "}
								<button onClick={handleDeleteDueDate} className="delete-btn">
									<i className="fas fa-trash"></i>
								</button>
							</p>
						) : null}
					</div>
					<button
						type="submit"
						className="block btn task-edit-btn"
						onClick={handleEdit}
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
