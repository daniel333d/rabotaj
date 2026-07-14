import { getAdminUsers } from "@/lib/data/db-admin";
import { AdminUserActions } from "@/components/admin/AdminUserActions";

const ROLE_LABEL: Record<string, string> = { candidate: "Kandydat", employer: "Pracodawca", admin: "Admin" };

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  if (!users) return <p className="text-sm text-muted">Brak dostępu.</p>;

  return (
    <div>
      <h1 className="font-heading text-2xl font-extrabold text-ink sm:text-3xl">Użytkownicy</h1>
      {users.length === 0 ? (
        <p className="mt-8 text-sm text-muted">Brak użytkowników w systemie.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {users.map((user) => (
            <div key={user.id} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-bold text-ink">{[user.first_name, user.last_name].filter(Boolean).join(" ") || user.email}</p>
                <p className="text-xs text-muted">
                  {user.email} · {ROLE_LABEL[user.role] ?? user.role}
                </p>
              </div>
              {user.role !== "admin" && <AdminUserActions userId={user.id} blocked={user.is_blocked} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
