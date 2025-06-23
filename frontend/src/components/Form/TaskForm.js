import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import UseAxiosPrivate from "../Hooks/UseAxiosPrivate";
import useAuth from "../Hooks/UseAuth";
const TaskForm = ({ mode }) => {
  const { Auth } = useAuth();
  const axiosPrivate = UseAxiosPrivate();
  const [task, setTask] = useState({
    title: "",
    description: "",
    userId: Auth?.userId,
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { id } = useParams(); // used in edit mode

  useEffect(() => {
    if (mode === "edit" && id) {
      axiosPrivate
        .get(`http://localhost:8080/api/tasks/${id}`)
        .then((res) => setTask(res.data))
        .catch((err) => {
          console.error(err);
          setError("Failed to load task.");
        });
    }
  }, [mode, id]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (mode === "edit") {
        await axiosPrivate.put(`/api/tasks/${id}`, task);
      } else {
        await axiosPrivate.post("/api/tasks", task);
      }
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">{mode === "edit" ? "Edit Task" : "Add New Task"}</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form
        onSubmit={handleSubmit}
        className="p-4 border rounded shadow-sm bg-light"
      >
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input
            type="text"
            name="title"
            value={task.title}
            onChange={handleChange}
            className="form-control"
            required
            placeholder="Enter task title"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className="form-control"
            rows="3"
            placeholder="Enter description"
          />
        </div>

        <button type="submit" className="btn btn-primary me-2">
          {mode === "edit" ? "Update Task" : "Add Task"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
