/**
 * API Route: GET /api/details/vc_info
 *
 * Returns an array of visitor center information objects.
 * - Fetches details for visitor centers.
 * - Responds with an array of VCInfoRow objects.
 *
 * Environment:
 * - DATABASE_URL: Connection string for the PostgreSQL database.
 *
 * Response: Array of VCInfoRow objects.
 * Status: 200 on success, 500 on error.
 */
import { NextResponse } from "next/server";
import { Pool } from "pg";
import { VCInfoRow } from "@/app/types";

const globalForPool = global as unknown as { pool: Pool | undefined };
const pool =
  globalForPool.pool ??
  new Pool({ connectionString: process.env.DATABASE_URL });
if (!globalForPool.pool) globalForPool.pool = pool;

/**
 * Handles GET requests for visitor center information.
 * @returns {Promise<NextResponse>} JSON response with an array of VCInfoRow objects or an error message.
 */
export async function GET() {
  try {
    const query = `
      SELECT
        id,
        unitcode,
        visitor_center_name,
        vc_site_count
      FROM mart.site_and_vc_features
      WHERE type = 'vc'
    `;
    const { rows } = await pool.query<VCInfoRow>(query);
    return NextResponse.json(rows);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
