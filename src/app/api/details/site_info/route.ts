/**
 * API Route: GET /api/details/site_info
 *
 * Returns an array of site information objects.
 * - Fetches details and statistics.
 * - Responds with an array of SiteInfoRow objects.
 *
 * Environment:
 * - DATABASE_URL: Connection string for the PostgreSQL database.
 *
 * Response: Array of SiteInfoRow objects.
 * Status: 200 on success, 500 on error.
 */
import { NextResponse } from "next/server";
import { Pool } from "pg";
import { SiteInfoRow } from "@/app/types";

const globalForPool = global as unknown as { pool: Pool | undefined };
const pool =
  globalForPool.pool ??
  new Pool({ connectionString: process.env.DATABASE_URL });
if (!globalForPool.pool) globalForPool.pool = pool;

/**
 * Handles GET requests for site information.
 * @returns {Promise<NextResponse>} JSON response with an array of SiteInfoRow objects or an error message.
 */
export async function GET() {
  try {
    const query = `
      SELECT
        id,
        combined_min_monthly_visitation_norm,
        combined_max_monthly_visitation_norm,
        combined_overall_avg_monthly_visitation_norm,
        nearest_park_min_monthly_visitation_norm,
        nearest_park_max_monthly_visitation_norm,
        nearest_park_overall_avg_monthly_visitation_norm,
        lodging_for_site_norm,
        combined_lodging_norm,
        combined_vc_distance_norm,
        nearest_vc_distance_norm,
        nearest_road_distance_norm,
        parks_within_30_mi_unitcodes,
        parks_within_30_mi_names,
        nearest_road_distance_mi,
        nearest_road_distance_km,
        nearest_road_type,
        lodging_for_site,
        combined_lodging,
        combined_vc_distance_mi,
        combined_vc_distance_km,
        nearest_vc_distance_mi,
        nearest_vc_distance_km,
        combined_min_monthly_visitation,
        combined_max_monthly_visitation,
        combined_overall_avg_monthly_visitation,
        nearest_park_min_monthly_visitation,
        nearest_park_max_monthly_visitation,
        nearest_park_overall_avg_monthly_visitation
      FROM mart.site_and_vc_features
      WHERE type = 'site'
    `;
    const { rows } = await pool.query(query);
    return NextResponse.json(rows as SiteInfoRow[]);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
