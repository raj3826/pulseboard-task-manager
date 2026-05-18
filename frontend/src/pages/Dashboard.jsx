import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard({ user, setUser }) {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [title, setTitle] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [assignedUser, setAssignedUser] = useState("");

  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const [activeTab, setActiveTab] = useState("overview");
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);

  const [loading, setLoading] = useState(true);

  // 🔥 FILTERS
  const [filterPriority, setFilterPriority] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showOverdue, setShowOverdue] = useState(false);
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    const load = async () => {
      const p = await API.get("/projects");
      const t = await API.get("/tasks");
      const u = await API.get("/users");

      setProjects(p.data);
      setTasks(t.data);
      setUsers(u.data);
      setLoading(false);
    };

    load();
  }, []);

  const createProject = async () => {
    await API.post("/projects", {
      title,
      createdBy: user.id,
      role: user.role
    });
    setTitle("");
    const res = await API.get("/projects");
    setProjects(res.data);
  };

  const createTask = async () => {
    if (!taskTitle || !selectedProject || !assignedUser) {
      alert("Fill all fields");
      return;
    }

    await API.post("/tasks", {
      title: taskTitle,
      projectId: Number(selectedProject),
      assignedTo: Number(assignedUser),
      priority,
      dueDate,
      role: user.role
    });

    setTaskTitle("");
    setSelectedProject("");
    setAssignedUser("");
    setPriority("MEDIUM");
    setDueDate("");

    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const updateStatus = async (id, newStatus) => {
    await API.put(`/tasks/${id}/status`, { status: newStatus });
    const res = await API.get("/tasks");
    setTasks(res.data);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  // 🔥 FILTER + SORT
  const filteredTasks = tasks
    .filter((t) => user.role === "ADMIN" || t.assignedTo === user.id)
    .filter((t) => filterPriority === "ALL" || t.priority === filterPriority)
    .filter((t) => filterStatus === "ALL" || t.status === filterStatus)
    .filter((t) => {
      if (!showOverdue) return true;
      return t.dueDate && new Date(t.dueDate) < new Date() && t.status !== "completed";
    })
    .sort((a, b) => {
      if (sortBy === "deadline") {
        return new Date(a.dueDate || 0) - new Date(b.dueDate || 0);
      }
      return b.id - a.id;
    });

  return (
    <div className="container">

      <h1>🚀 PulseBoard</h1>

      {/* USER */}
      <div className="card">
        <h2>Welcome {user.name}</h2>
        <p>Role: {user.role}</p>
        <button onClick={logout}>Logout</button>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button onClick={()=>setActiveTab("overview")}>Overview</button>
        <button onClick={()=>setActiveTab("tasks")}>Tasks</button>
        <button onClick={()=>setActiveTab("projects")}>Projects</button>
        {user.role==="ADMIN" && (
          <button onClick={()=>setActiveTab("admin")}>Admin</button>
        )}
      </div>

      {/* OVERVIEW */}
      {activeTab==="overview" && (
        <div className="card">
          {loading ? <p>Loading...</p> : (
            <>
              <p>Total Projects: {projects.length}</p>
              <p>Total Tasks: {tasks.length}</p>
              <p>Completed: {tasks.filter(t=>t.status==="completed").length}</p>
            </>
          )}
        </div>
      )}

      {/* TASKS */}
      {activeTab==="tasks" && (
        <div className="card">
          <h3>📝 Tasks</h3>

          {/* FILTER UI */}
          <div>
            <select onChange={(e)=>setFilterPriority(e.target.value)}>
              <option value="ALL">All Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
            </select>

            <select onChange={(e)=>setFilterStatus(e.target.value)}>
              <option value="ALL">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>

            <button onClick={()=>setShowOverdue(!showOverdue)}>
              {showOverdue ? "All" : "Overdue"}
            </button>
          </div>

          {filteredTasks.map(t=>(
            <div key={t.id} className="card">
              <strong>{t.title}</strong>
              <div>Priority: {t.priority}</div>
              <div>
                Deadline: {t.dueDate ? new Date(t.dueDate).toLocaleDateString("en-GB") : "Not set"}
              </div>
              <div>Status: {t.status}</div>

              {user.role !== "ADMIN" && (
                <>
                  {t.status==="pending" && (
                    <button onClick={()=>updateStatus(t.id,"in-progress")}>Start</button>
                  )}
                  {t.status==="in-progress" && (
                    <button onClick={()=>updateStatus(t.id,"completed")}>Complete</button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {/* PROJECTS (OLD STYLE RESTORED) */}
      {activeTab==="projects" && (
        <div className="card">
          <h3>📁 Projects</h3>

          {projects.map(p=>(
            <div key={p.id} onClick={()=>setSelectedProjectDetails(p)}>
              📁 {p.title}
            </div>
          ))}

          {selectedProjectDetails && (
            <div style={{marginTop:"20px"}}>
              <h4>Project: {selectedProjectDetails.title}</h4>

              {tasks
                .filter(t=>t.projectId===selectedProjectDetails.id)
                .map(t=>(
                  <div key={t.id}>
                    📝 {t.title} - {t.status}
                    <div style={{fontSize:"12px"}}>
                      Assigned to: {t.assignedUser}
                    </div>
                  </div>
                ))
              }
            </div>
          )}
        </div>
      )}

      {/* ADMIN PANEL (OLD UI RESTORED) */}
      {activeTab==="admin" && user.role==="ADMIN" && (
        <div className="card">
          <h3>Create Project</h3>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Project Title" />
          <button onClick={createProject}>Create</button>

          <hr />

          <h3>Create Task</h3>

          <input value={taskTitle} onChange={(e)=>setTaskTitle(e.target.value)} placeholder="Task Title" />

          <select onChange={(e)=>setSelectedProject(e.target.value)}>
            <option>Select Project</option>
            {projects.map(p=>(
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>

          <select onChange={(e)=>setAssignedUser(e.target.value)}>
            <option>Assign User</option>
            {users.map(u=>(
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <select value={priority} onChange={(e)=>setPriority(e.target.value)}>
  <option value="LOW">Low</option>
  <option value="MEDIUM">Medium</option>
  <option value="HIGH">High</option>
</select>

          <input type="date" onChange={(e)=>setDueDate(e.target.value)} />

          <button onClick={createTask}>Add Task</button>
        </div>
      )}

    </div>
  );
}