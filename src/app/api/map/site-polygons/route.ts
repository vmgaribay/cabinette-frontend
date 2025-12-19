import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get site polygons and info, format as FeatureCollection for Leaflet
export async function GET(req: NextRequest) {
  try {
    const { rows } = await pool.query(`
      SELECT id, ST_AsGeoJSON(ST_GeomFromText(polygon_geom)) as geometry
      FROM mart.site_and_vc_features
      WHERE type = 'site'
    `);

    const unitcode = req.nextUrl.searchParams.get("unitcode");
    const params: any[] = [];
    let where = "WHERE type = 'site'";

    if (unitcode) {
      params.push(unitcode);
      where += ` AND parks_within_30_mi_unitcode = $${params.length}`;
    }
    const features = rows.map((row: any) => ({
      type: "Feature",
      geometry: JSON.parse(row.geometry),
      properties: { id: row.id }
    }));

    return NextResponse.json({
      type: "FeatureCollection",
      features
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}