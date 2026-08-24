import ProjectForm from "@/components/admin/ProjectForm";

export const metadata = {
  title: "Proiect Nou | Admin Moodilier",
};

export default function NewProjectPage() {
  return (
    <div className="adm-page adm-page--narrow">
      <div style={{ marginBottom: "2rem" }}>
        <h1 className="adm-title">Proiect Nou</h1>
        <p className="adm-subtitle">
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
