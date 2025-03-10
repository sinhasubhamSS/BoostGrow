import React, { useState } from 'react'
import { addTodo, updateTodo } from '../Redux/todoSlice';
import { useDispatch } from "react-redux";
import "./Csscomponents/addtodo.css"
function AddTodo({ task, onClose }) {
    const [todo, setTodo] = useState({
        taskname: task?.taskname || "",
        taskdescription: task?.taskdescription || "",
        priority: task?.priority || "low",
        duedate: task?.duedate
            ? new Date(task.duedate).toISOString().split("T")[0]
            : "",
    });
    const dispatch = useDispatch();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTodo({ ...todo, [name]: value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (task) {
            dispatch(updateTodo({
                taskId: task._id,
                updatedTodo: todo
            }));
            onClose();
        } else {
            dispatch(addTodo(todo));
            setTodo({
                taskname: "",
                taskdescription: "",
                priority: "low",
                duedate: "",
            })
            onClose();
        }


    }
    return (
        <>
        
            <form onSubmit={handleSubmit} className='form'>
                <input type="text"
                    name='taskname'
                    placeholder='enter a todo'
                    value={todo.taskname}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="taskdescription"
                    placeholder="Enter Task Description"
                    value={todo.taskdescription}
                    onChange={handleChange}
                ></textarea>
                <select name="priority" value={todo.priority} onChange={handleChange}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
                <input
                    type="date"
                    name="duedate"
                    value={todo.duedate || ""}
                    onChange={handleChange}
                />
                <button type="submit">  {task ? 'Save Changes' : 'Add Todo'}</button>
            </form>


        </>

    )
}

export default AddTodo