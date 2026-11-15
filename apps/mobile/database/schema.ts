// Offline-first local database (Expo SQLite).
// P1 scope: local products/stock cache, offline POS queue, pending
// transaction queue with automatic sync + conflict detection.
// Schema mirrors the Supabase tables (see supabase/migrations/).
export const LOCAL_DB_NAME = "dukaan360.db";
