import { Trash2, Users } from 'lucide-react';
import { useState } from 'react';
import { usersApi } from '../../api/endpoints';
import { Alert } from '../../components/ui/Alert';
import { Button } from '../../components/ui/Button';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EmptyState } from '../../components/ui/EmptyState';
import { Pagination } from '../../components/ui/Pagination';
import { Spinner } from '../../components/ui/Spinner';
import { useApiQuery } from '../../hooks/useApiQuery';
import { useAuth } from '../../hooks/useAuth';
import { getErrorMessage } from '../../lib/errors';
import { formatCents, formatDate, formatNumber } from '../../lib/format';

const PAGE_SIZE = 10;

const headerCell =
  'px-4 py-3 text-left text-xs font-semibold tracking-wide text-slate-500 uppercase sm:px-6';
const cell = 'whitespace-nowrap px-4 py-3.5 sm:px-6';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [page, setPage] = useState(1);
  const { data, error, refetch, isLoading } = useApiQuery('/api/users', {
    params: { page, limit: PAGE_SIZE },
  });

  const [userToDelete, setUserToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [notice, setNotice] = useState(null);

  async function handleDelete() {
    setIsDeleting(true);
    try {
      await usersApi.remove(userToDelete._id);
      setNotice({ variant: 'success', message: `${userToDelete.name}'s account was deleted.` });
      // Step back a page if we just removed the only row on this one
      if (data.users.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        refetch();
      }
    } catch (err) {
      setNotice({ variant: 'error', message: getErrorMessage(err) });
    } finally {
      setIsDeleting(false);
      setUserToDelete(null);
    }
  }

  return (
    <>
      <title>Users | Gift of Change</title>
      <h1 className="text-3xl font-semibold tracking-tight">Users</h1>
      <p className="mt-2 text-slate-600">
        Everyone with an account. Deleting a donor keeps their donation records.
      </p>

      {notice && (
        <Alert variant={notice.variant} className="mt-6">
          {notice.message}
        </Alert>
      )}

      <section className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
        {error ? (
          <div className="p-6">
            <Alert variant="error">{error}</Alert>
          </div>
        ) : !data ? (
          <Spinner className="py-14" label="Loading users" />
        ) : data.users.length === 0 ? (
          <EmptyState icon={Users} title="No users yet" />
        ) : (
          <div className={isLoading ? 'opacity-60 transition-opacity' : ''}>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200 text-sm">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className={headerCell}>
                      User
                    </th>
                    <th scope="col" className={headerCell}>
                      Role
                    </th>
                    <th scope="col" className={headerCell}>
                      Joined
                    </th>
                    <th scope="col" className={`${headerCell} text-right`}>
                      Donations
                    </th>
                    <th scope="col" className={`${headerCell} text-right`}>
                      Total given
                    </th>
                    <th scope="col" className={headerCell}>
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {data.users.map((user) => (
                    <tr key={user._id} className="hover:bg-slate-50/60">
                      <td className={cell}>
                        <p className="font-medium text-slate-900">
                          {user.name}
                          {user._id === currentUser._id && (
                            <span className="ml-2 text-xs font-normal text-slate-500">(you)</span>
                          )}
                        </p>
                        <p className="text-slate-500">{user.email}</p>
                      </td>
                      <td className={cell}>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.role === 'admin'
                              ? 'bg-violet-50 text-violet-700 ring-1 ring-violet-600/20 ring-inset'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {user.role === 'admin' ? 'Admin' : 'Donor'}
                        </span>
                      </td>
                      <td className={`${cell} text-slate-600`}>{formatDate(user.createdAt)}</td>
                      <td className={`${cell} text-right tabular-nums`}>
                        {formatNumber(user.donationCount)}
                      </td>
                      <td className={`${cell} text-right font-medium text-slate-900 tabular-nums`}>
                        {formatCents(user.totalDonated)}
                      </td>
                      <td className={`${cell} text-right`}>
                        {user.role !== 'admin' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:bg-red-50"
                            onClick={() => setUserToDelete(user)}
                            aria-label={`Delete ${user.name}`}
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination pagination={data.pagination} onPageChange={setPage} itemLabel="users" />
          </div>
        )}
      </section>

      <ConfirmDialog
        isOpen={Boolean(userToDelete)}
        title="Delete this account?"
        description={
          userToDelete
            ? `${userToDelete.name} (${userToDelete.email}) will no longer be able to log in. Their past donations stay on record.`
            : ''
        }
        confirmLabel="Delete account"
        isConfirming={isDeleting}
        onConfirm={handleDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </>
  );
}
