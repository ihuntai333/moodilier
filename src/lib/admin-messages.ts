export type DbMessage = {
  id: string;
  name?: string;
  nume?: string;
  email?: string;
  phone?: string;
  telefon?: string;
  message?: string;
  mesaj?: string;
  is_read?: boolean;
  read?: boolean;
  created_at?: string;
  data?: string;
};

export type AdminMessage = {
  id: string;
  nume: string;
  email: string;
  telefon: string;
  mesaj: string;
  data: string;
  read: boolean;
};

export function mapAdminMessage(row: DbMessage): AdminMessage {
  return {
    id: row.id,
    nume: row.nume ?? row.name ?? "",
    email: row.email ?? "",
    telefon: row.telefon ?? row.phone ?? "",
    mesaj: row.mesaj ?? row.message ?? "",
    data: row.data ?? row.created_at ?? new Date().toISOString(),
    read: Boolean(row.read ?? row.is_read),
  };
}
