import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddTodo from '../components/AddTodo';
import { deleteTodo, fetchTodos, updateTodo } from '../Redux/todoSlice';
import "./pagescss/todopage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

// 🕐 Format date to Indian format (IST)
const formatDueDateToIST = (dateString) => {
  if (!dateString) return "No due date";
  const date = new Date(dateString);
  const options = { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' };
  return new Intl.DateTimeFormat('en-IN', options).format(date);
};

function Todopage() {
  const { todo, loading, error, marked } = useSelector((state) => state.todo);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    dispatch(fetchTodos());
  }, []);

  const handleDelete = (id) => {
    dispatch(deleteTodo(id));
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTask(null);
  };

  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;

    const draggedTask =
      source.droppableId === "tasks"
        ? todo.find((task) => task._id === draggableId)
        : marked.find((task) => task._id === draggableId);

    if (!draggedTask) return;

    const updatedStatus = destination.droppableId === "tasks" ? false : true;
    dispatch(updateTodo({ taskId: draggedTask._id, updatedTodo: { taskstatus: updatedStatus } }));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="todo__page">
        <div className='left__section'>
          <nav className='navbar'>
            <header className='header__section'>
              <h3>TODO LIST</h3>
              <div className="avatar">
                <div className="avatar__img" />
              </div>
            </header>
          </nav>

          {loading && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}

          <Droppable droppableId="tasks">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="todo__container"
              >
                {todo &&
                  todo.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="task__container"
                        >
                          <div className="task__card">
                            <h3 className="heading">{task.taskname}</h3>
                            <p>{task.taskdescription}</p>
                            <p>Priority: {task.priority}</p>
                            <p>Due Date: {formatDueDateToIST(task.duedate)}</p>
                            <button
                              className="edit__btn"
                              onClick={() => handleEditClick(task)}
                            >
                              Edit
                            </button>
                            <button
                              className="dlt__btn"
                              onClick={() => handleDelete(task._id)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="add__btn_place">
            <button
              className='add__btn'
              onClick={() => {
                setSelectedTask(null);
                setShowForm(!showForm);
              }}
            >
              {showForm ? (
                <FontAwesomeIcon icon={faXmark} />
              ) : (
                <FontAwesomeIcon icon={faFileCirclePlus} />
              )}
            </button>
          </div>

          {showForm && (
            <div className="form__wrapper">
              <div className="add__todo__form">
                <AddTodo task={selectedTask} onClose={handleCloseForm} />
              </div>
            </div>
          )}
        </div>

        <div className="right__section">
          <Droppable droppableId="sectionOne">
            {(provided) => (
              <div
                className="section__one"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <p>Drop tasks here to mark as read</p>
                {marked.length === 0 ? (
                  <p className="empty__state">No tasks marked as read.</p>
                ) : (
                  marked.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`task__container__marked ${task.priority === "High" ? "high-priority" : ""
                            }`}
                        >
                          <div className="task__card__marked">
                            <h3 className="heading">{task.taskname}</h3>
                            <p>{task.taskdescription}</p>
                            <p>Priority: {task.priority}</p>
                            <p>Due Date: {formatDueDateToIST(task.duedate)}</p>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </div>
    </DragDropContext>
  );
}

export default Todopage;
