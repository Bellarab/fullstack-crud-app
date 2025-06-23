import AddTask from "../Form/AddTask";
import EditTask from "../Form/EditTask ";
import Navbar from "../Navbar/Navbar";
import Login from "../Authentication/Login";
import Register from "../Authentication/Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TodoApp from "../TodoList/TodoList";
import PersistLogin from "../Authentication/persistLogin";
import Layout from "./Layout";
import Missing from "../Errors/Missing";
function App() {
  return (
    <div className="App">
      <Navbar></Navbar>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          <Route index element={<TodoApp />} />
          <Route path="/add" element={<AddTask />} />
          <Route path="/edit/:id" element={<EditTask />} />
          {/* Catch-all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
