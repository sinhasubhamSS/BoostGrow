
import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AddTodo from '../components/AddTodo';
import { deleteTodo, fetchTodos, updateTodo } from '../Redux/todoSlice';
import "./pagescss/todopage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCirclePlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
function Todopage() {
  const { todo, loading, error, marked } = useSelector((state) => state.todo);
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false)
  const [formPosition, setFormPosition] = useState({ top: '50%' })
  const containerRef = useRef(null)
  const [selectedTask, setSelectedTask] = useState(null);

  const handleDelete = (id) => {
    dispatch(deleteTodo(id))
  }
  useEffect(() => {
    dispatch(fetchTodos())

  }, [dispatch])
  useEffect(() => {
    if (showForm) {
      const container = containerRef.current;
      if (container) {
        const scrollTop = container.scrollTop;
        const containerHeight = container.clientHeight;
        const topPosition = (scrollTop + containerHeight) / 2;
        setFormPosition({ top: `${topPosition}px` });
      }

      // Disable scroll of todo container when AddTodo form is shown
      if (containerRef.current) {
        containerRef.current.style.overflow = 'hidden';
      }
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.style.overflow = 'auto'; // Cleanup to ensure scroll is enabled on unmount
      }
    };
  }, [showForm]);
  const handleEditClick = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setSelectedTask(null);
  }
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    // If no destination or same source and destination, return early
    if (!destination || source.droppableId === destination.droppableId) return;

    // Find the dragged task from the appropriate list
    const draggedTask =
      source.droppableId === "tasks"
        ? todo.find((task) => task._id === draggableId)
        : marked.find((task) => task._id === draggableId);

    if (!draggedTask) return;

    // Dispatch action based on destination
    if (destination.droppableId === "tasks") {
      // Moving task back to "tasks"
      dispatch(updateTodo({ taskId: draggedTask._id, updatedTodo: { taskstatus: false } }));
    } else if (destination.droppableId === "sectionOne") {
      // Moving task to "sectionOne"
      dispatch(updateTodo({ taskId: draggedTask._id, updatedTodo: { taskstatus: true } }));
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="todo__page">
          <div className='left__section'>
            <nav className='navbar'>
              <header className='header__section'>
                <h3>TODO LIST</h3>

                <div className="avatar">
                  <img className="avatar__img" src="" alt="alt" />
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
                    todo.map((todo, index) => (
                      <Draggable
                        key={todo._id}
                        draggableId={todo._id}
                        index={index} // Required for drag-and-drop order
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="task__container"
                          >
                            <div className="task__card">
                              <h3 className="heading">{todo.taskname}</h3>
                              <p>{todo.taskdescription}</p>
                              <p>Priority: {todo.priority}</p>
                              <p>Due Date: {todo.duedate || "No due date"}</p>
                              <p>Task Status: {String(todo.taskstatus)}</p>
                              <button
                                className="edit__btn"
                                onClick={() => handleEditClick(todo)}
                              >
                                Edit
                              </button>
                              <button
                                className="dlt__btn"
                                onClick={() => handleDelete(todo._id)}
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
              <button className='add__btn' onClick={() => { setSelectedTask(null); setShowForm(!showForm) }} >
                {showForm ? <FontAwesomeIcon icon={faXmark} /> : <FontAwesomeIcon icon={faFileCirclePlus} />}
              </button>
            </div>
            {showForm && (
              <div className="form__wrapper" style={formPosition}>
                <div className="add__todo__form">
                  <AddTodo
                    task={selectedTask} // Pass task data for editing
                    onClose={handleCloseForm} // Handle form close
                  />
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
                        draggableId={task._id} // Unique ID for each task
                        index={index} // Position in the list
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
                              <p>Due Date: {task.duedate || "No due date"}</p>
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


            <div className="section__two"></div>

          </div>
        </div>
      </DragDropContext>
    </>
  );
}

export default Todopage;

