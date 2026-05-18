import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>

      {/* HERO SECTION */}
      <section style={{ textAlign: "center", padding: "80px 20px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: "600" }}>
          Organize Projects, Assign Tasks, and Track Progress — All in One Place
        </h1>

        <p style={{ marginTop: "15px", opacity: 0.8, maxWidth: "600px", marginInline: "auto" }}>
          PulseBoard helps teams streamline their workflow by managing projects,
          assigning responsibilities, and monitoring task progress efficiently.
        </p>

        <br />

        <Link to="/auth">
          <button style={{ fontSize: "16px", padding: "10px 18px" }}>
            Get Started
          </button>
        </Link>

        {/* GUIDE HINT */}
        <p style={{ marginTop: "20px", fontSize: "14px", opacity: 0.6 }}>
          For detailed usage and guidance, refer to the Contact section.
        </p>
      </section>

      {/* FEATURES */}
      <section
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          padding: "40px",
          flexWrap: "wrap"
        }}
      >
        {[
          {
            title: "📁 Project Management",
            desc: "Create and organize multiple projects efficiently"
          },
          {
            title: "📝 Task Assignment",
            desc: "Assign tasks with priorities and deadlines"
          },
          {
            title: "📊 Progress Tracking",
            desc: "Track task status and overdue work easily"
          }
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              width: "260px",
              textAlign: "center",
              boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
            }}
          >
            <h3>{item.title}</h3>
            <p style={{ opacity: 0.8 }}>{item.desc}</p>
          </div>
        ))}
      </section>

    </div>
  );
}