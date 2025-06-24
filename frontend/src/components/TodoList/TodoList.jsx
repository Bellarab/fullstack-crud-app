import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import UseAuth from "../Hooks/UseAuth";
import UseAxiosPrivate from "../Hooks/UseAxiosPrivate";
export default function TodoList() {
  const [tasks, setTasks] = useState([]);
  const { userId } = useParams();
  const { auth } = UseAuth();
  const axiosPrivate = UseAxiosPrivate();
  useEffect(() => {
    const fetchTasks = async () => {
      console.log("Auth token in TodoList before fetch:", auth?.access_token);
      try {
        const res = await axiosPrivate.get(`/api/tasks/user/${auth?.userId}`);
        setTasks(res.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      }
    };
    fetchTasks();
  }, [axiosPrivate, auth]);

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete(`/api/tasks/${id}`);
      alert("Task deleted");
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task. Try again later.");
    }
  };
  const handleSortAscending = () => {
    const sortedTasks = [...tasks].sort((a, b) =>
      a.title.localeCompare(b.title)
    );
    setTasks(sortedTasks);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-10 col-lg-8">
          <div
            className="card shadow-sm"
            style={{ borderRadius: ".75rem", backgroundColor: "#eff1f2" }}
          >
            <div className="card-body px-3 px-md-4 py-4">
              <h1
                className="text-primary text-center mt-3 mb-4 pb-3"
                style={{ textDecoration: "underline" }}
              >
                <i className="bi bi-check-square me-2"></i>My Todo-s
              </h1>

              <hr className="my-3" />

              <div className="d-flex flex-wrap justify-content-end align-items-center gap-2 mb-3">
                <Link to="/add" className="text-decoration-none">
                  <button
                    type="button"
                    className="btn btn-success btn-sm btn-md rounded-pill shadow-sm px-5"
                  >
                    <span className="text-bold">Add</span>
                  </button>
                </Link>

                <button
                  type="button"
                  className="btn btn-link p-2"
                  title="Sort Ascending"
                  style={{ color: "#23af89", fontSize: "1.25rem" }}
                  onClick={handleSortAscending}
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
                      style={{ gap: "1rem" }}
                    >
                      <div className="flex-grow-1 text-truncate">
                        <h5 className="mb-1 text-truncate">{task.title}</h5>
                        <p className="mb-0 text-muted text-truncate">
                          {task.description}
                        </p>
                      </div>
                      <div className="d-flex align-items-center gap-2 flex-shrink-0">
                        <Link
                          to={`/edit/${task.id}`}
                          className="text-decoration-none"
                        >
                          <button
                            type="button"
                            className="btn btn-link btn-sm text-info p-2"
                            title="Edit task"
                          >
                            <i className="bi bi-pencil fs-5"></i>
                          </button>
                        </Link>

                        <button
                          type="button"
                          className="btn btn-link btn-sm text-danger p-2"
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
                  <i className="bi bi-info-circle me-2"></i>Tasks fetched from
                  API
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
