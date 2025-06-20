import { useEffect, useState } from "react";
import axios from "../Apis/axios";
import { useParams } from "react-router-dom";
export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const { userId } = useParams();
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get("/api/tasks");
        setTasks(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };

    fetchTasks();
  }, []);
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`);
      alert("byby task ");
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task. Try again later.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center mt-5">
      <div className="col-md-8">
        <div
          className="card shadow-sm"
          style={{ borderRadius: ".75rem", backgroundColor: "#eff1f2" }}
        >
          <div className="card-body px-4 px-md-5 py-4">
            <h1
              className="text-primary text-center mt-3 mb-4 pb-3"
              style={{ textDecoration: "underline" }}
            >
              <i className="bi bi-check-square me-2"></i>My Todo-s
            </h1>

            <hr className="my-4" />

            <div className="d-flex justify-content-end align-items-center mb-4 pt-2 pb-3 gap-2">
              <button
                type="button"
                className="btn btn-danger btn-md rounded-pill shadow-sm"
                onClick={() => handleDelete(userId)}
              >
                Delete
              </button>

              <a href="/add">
                <button
                  type="button"
                  className="btn btn-success btn-md rounded-pill shadow-sm"
                >
                  Add
                </button>
              </a>

              <button
                type="button"
                className="btn btn-link p-2"
                title="Ascending"
                style={{ color: "#23af89", fontSize: "1.25rem" }}
              >
                <i className="bi bi-sort-alpha-down"></i>
              </button>
            </div>

            {/* Task List */}
            <ul className="list-group list-group-flush">
              {tasks.length > 0 ? (
                tasks.map((task) => (
                  <li
                    key={task.id}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h5 className="mb-1">{task.title}</h5>
                      <p className="mb-0 text-muted">{task.description}</p>
                    </div>
                    <div className="d-flex align-items-center">
                      <a href={`/edit/${task.id}`}>
                        <button
                          type="button"
                          className="btn btn-link text-info p-2 me-3"
                          title="Edit task"
                        >
                          <i className="bi bi-pencil fs-5"></i>
                        </button>
                      </a>
                      <button
                        type="button"
                        className="btn btn-link text-danger p-2"
                        title="Delete task"
                        onClick={() => handleDelete(task.id)}
                      >
                        <i className="bi bi-trash fs-5"></i>
                      </button>
                    </div>
                  </li>
                ))
              ) : (
                <li className="list-group-item text-center text-muted">
                  No tasks found.
                </li>
              )}
            </ul>

            <div className="text-end text-muted mt-3">
              <small title="Created date">
                <i className="bi bi-info-circle me-2"></i>Tasks fetched from API
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
