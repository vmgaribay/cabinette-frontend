/**
 * API Route: GET /api/details/visitation
 *
 * Returns an array of park visitation objects.
 * - Fetches visitation for parks and monuments.
 * - Responds with an array of VisitationRow objects.
 *
 * Environment:
 * - DATABASE_URL: Connection string for the PostgreSQL database.
 *
 * Response: Array of VisitationRow objects.
 * Status: 200 on success, 500 on error.
 */
import { NextResponse } from "next/server";
import { Pool } from "pg";
import { VisitationRow } from "@/app/types";

const globalForPool = global as unknown as { pool: Pool | undefined };
const pool =
  globalForPool.pool ??
  new Pool({ connectionString: process.env.DATABASE_URL });
if (!globalForPool.pool) globalForPool.pool = pool;

/**
 * Handles GET requests for visitation information.
 * @returns {Promise<NextResponse>} JSON response with an array of VisitationRow objects or an error message.
 */
export async function GET() {
  try {
    const { rows } = await pool.query<VisitationRow>(`
      SELECT
        parkname, 
        unitcode, 
        month,
        avg_recreation_visits,
        min_recreation_visits,
        max_recreation_visits
      FROM core.visitation_monthly`);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
