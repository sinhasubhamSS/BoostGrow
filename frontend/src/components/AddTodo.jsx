import React, { useState } from 'react';
import { addTodo, updateTodo } from '../Redux/todoSlice';
import { useDispatch } from "react-redux";
import "./Csscomponents/addtodo.css";

function AddTodo({ task, onClose }) {
    const getTomorrowDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split("T")[0]; // format: yyyy-mm-dd
    };

    const [todo, setTodo] = useState({
        taskname: task?.taskname || "",
        taskdescription: task?.taskdescription || "",
        priority: task?.priority || "low",
        duedate: task?.duedate
            ? new Date(task.duedate).toISOString().split("T")[0]
            : getTomorrowDate(),
    });

    const dispatch = useDispatch();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTodo({ ...todo, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (task) {
            dispatch(updateTodo({
                taskId: task._id,
                updatedTodo: todo
            }));
        } else {
            dispatch(addTodo(todo));
            setTodo({
                taskname: "",
                taskdescription: "",
                priority: "low",
                duedate: getTomorrowDate(),
            });
        }
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className='form'>
            <input
                type="text"
                name='taskname'
                placeholder='Enter a todo'
                value={todo.taskname}
                onChange={handleChange}
                required
            />

            <textarea
                name="taskdescription"
                placeholder="Enter Task Description"
                value={todo.taskdescription}
                onChange={handleChange}
                required
            ></textarea>

            <select
                name="priority"
                value={todo.priority}
                onChange={handleChange}
                required
            >
                <option value="">Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <input
                type="date"
                name="duedate"
                value={todo.duedate}
                onChange={handleChange}
                required
            />

            <button type="submit">
                {task ? 'Save Changes' : 'Add Todo'}
            </button>
        </form>
    );
}

export default AddTodo;
