export default function Contact() {
  return (
    <div className="container">
      <div className="card">

        <h2>📞 Contact & About</h2>

        <p><strong>Support Email:</strong> support@pulseboard.com</p>

        <p><strong>Developer:</strong> Bhavya Yadav</p>
        <p><strong>Contact:</strong> bhavyayadav161@gmail.com</p>

        <hr />

        <h3>About PulseBoard</h3>
        <p>
          PulseBoard is a team task management system designed to help teams
          organize projects, assign tasks, and track progress efficiently in one place.
        </p>

        <p style={{ marginTop: "10px", opacity: 0.85 }}>
          This project was designed and developed as a full-stack task management system
          showcasing real-world workflow handling.
        </p>

        <hr />

        <h3>How to Use</h3>
        <ul style={{ lineHeight: "1.8" }}>
          <li>Admin can create projects and assign tasks</li>
          <li>Members can view their assigned tasks</li>
          <li>Update task status (pending → in-progress → completed)</li>
          <li>Use filters to track priority and deadlines</li>
        </ul>

        <hr />

        <p style={{ fontSize: "14px", opacity: 0.7 }}>
          Note: This system demonstrates task lifecycle management with priority-based tracking
          and role-based access control.
        </p>

      </div>
    </div>
  );
}