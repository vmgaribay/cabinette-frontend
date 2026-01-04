/**
 * API Route: GET /api/map/site-polygons
 *
 * Returns a GeoJSON FeatureCollection of site polygons.
 * - Accepts optional query parameter: unitcodes.
 * - Fetches site polygons from the database.
 * - Filters sites by associated unitcodes if provided.
 * - Responds with GeoJSON FeatureCollection for use in Leaflet.
 *
 * Environment:
 * - DATABASE_URL: Connection string for the PostgreSQL database.
 *
 * Response: GeoJSON FeatureCollection.
 * Status: 200 on success, 500 on error.
 */
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { SitePolyRow } from "@/app/types";
import type { Feature } from "geojson";

const globalForPool = global as unknown as { pool: Pool | undefined };
const pool =
  globalForPool.pool ??
  new Pool({ connectionString: process.env.DATABASE_URL });
if (!globalForPool.pool) globalForPool.pool = pool;

/**
 * Handles GET requests for site polygons.
 * @param {NextRequest} req - Incoming request object.
 * @returns {Promise<NextResponse>} JSON response with GeoJSON FeatureCollection or error.
 */
export async function GET(req: NextRequest) {
  try {
    const unitcodesParam = req.nextUrl.searchParams.get("unitcodes");
    let query = `
    SELECT s.id, ST_AsGeoJSON(ST_GeomFromText(s.polygon_geom)) as geometry, s.parks_within_30_mi_unitcodes
    FROM mart.site_and_vc_features s
    WHERE s.type = 'site'
  `;
    const params: (string | string[])[] = [];
    console.log(query, params);

    if (unitcodesParam) {
      const unitcodes = unitcodesParam.split(",");
      query += `
    AND s.id IN (
      SELECT rel.site_id::text
      FROM mart.vc_site_rel rel
      WHERE SPLIT_PART(rel.vc_id, '_', 1) = ANY($1::text[])
    )
  `;
      params.push(unitcodes);
    }

    const { rows } = await pool.query<SitePolyRow>(query, params);
    const features: Feature[] = rows.map((row) => ({
      type: "Feature",
      geometry: JSON.parse(row.geometry),
      properties: { id: row.id },
    }));

    return NextResponse.json({ type: "FeatureCollection", features });
  } catch (error) {
    console.error("Error fetching site polygons:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
