import { VCPointRow } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const globalForPool = global as unknown as { pool: Pool | undefined };
const pool =
  globalForPool.pool ??
  new Pool({ connectionString: process.env.DATABASE_URL });
if (!globalForPool.pool) globalForPool.pool = pool;

// Get visitor center points, format as FeatureCollection for Leaflet

export async function GET(req: NextRequest) {
  try {
    const unitcodesParam = req.nextUrl.searchParams.get("unitcodes");
    let query = `
      SELECT id, unitcode, ST_AsGeoJSON(ST_GeomFromText(geom)) as geometry
      FROM mart.site_and_vc_features
      WHERE type = 'vc'
    `;
    const params: (string | string[])[] = [];

    if (unitcodesParam) {
      const unitcodes = unitcodesParam.split(",");
      query += ` AND unitcode = ANY($1)`;
      params.push(unitcodes);
    }

    const { rows } = await pool.query(query, params);

    const features = rows.map((row: VCPointRow) => ({
      type: "Feature",
      geometry: JSON.parse(row.geometry),
      properties: { id: row.id, unitcode: row.unitcode },
    }));

    return NextResponse.json({
      type: "FeatureCollection",
      features,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
