// ── Supabase Configuration ──────────────────────────────────────────────────
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const SUPABASE_URL = 'https://vhcruymhkviiehuijklt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoY3J1eW1oa3ZpaWVodWlqa2x0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ1NTQwMzIsImV4cCI6MjA5MDEzMDAzMn0.DtPb6jvtX1gVxskvEB9Am20eWfK1su11G0A4JsMXqeY';

// ── Supabase Client ─────────────────────────────────────────────────────────
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── App Constants ───────────────────────────────────────────────────────────
// DEPRECATED: const TRIP_DATE = new Date('2026-06-19T00:00:00'); - Now dynamic per user.

export { SUPABASE_URL, SUPABASE_KEY };
