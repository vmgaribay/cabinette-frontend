import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get visitor center points, format as FeatureCollection for Leaflet
export async function GET(req: NextRequest) {
  try {
    const { rows } = await pool.query(`
      SELECT id, ST_AsGeoJSON(ST_GeomFromText(geom)) as geometry
      FROM mart.site_and_vc_features
      WHERE type = 'vc'
    `);


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