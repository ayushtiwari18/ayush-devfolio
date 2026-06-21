import { redirect } from 'next/navigation';

/**
 * /admin has no UI — redirect immediately to login.
 * Dashboard is only reachable after authentication.
 */
export default function AdminIndexPage() {
  redirect('/admin/login');
}
