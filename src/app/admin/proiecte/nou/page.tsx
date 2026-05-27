import ProjectForm from "@/components/admin/ProjectForm";

export const metadata = {
  title: "Proiect Nou | Admin Moodilier",
};

export default function NewProjectPage() {
  return (
    <div style={{ padding: "2.5rem 2rem", maxWidth: "860px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "1.5rem",
            fontWeight: 500,
            color: "#e8e0d5",
            marginBottom: "0.25rem",
          }}
        >
          Proiect Nou
        </h1>
        <p style={{ fontSize: "0.85rem", color: "#6a6460", maxWidth: "none" }}>
          Completați detaliile și încărcați imaginile pentru noul proiect.
        </p>
      </div>

      <div
        style={{
          background: "#1a1917",
          border: "1px solid #2a2724",
          borderRadius: "8px",
          padding: "2rem",
        }}
      >
        <ProjectForm mode="create" />
      </div>
    </div>
  );
}
