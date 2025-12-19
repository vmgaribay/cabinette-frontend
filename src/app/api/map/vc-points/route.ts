import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get visitor center points, format as FeatureCollection for Leaflet

export async function GET(req: NextRequest) {
  try {
    const unitcodesParam = req.nextUrl.searchParams.get("unitcodes");
    let query = `
      SELECT id, unitcode, ST_AsGeoJSON(ST_GeomFromText(geom)) as geometry
      FROM mart.site_and_vc_features
      WHERE type = 'vc'
    `;
    const params: any[] = [];

    if (unitcodesParam) {
      const unitcodes = unitcodesParam.split(",");
      query += ` AND unitcode = ANY($1)`;
      params.push(unitcodes);
    }

    const { rows } = await pool.query(query, params);

    const features = rows.map((row: any) => ({
      type: "Feature",
      geometry: JSON.parse(row.geometry),
      properties: { id: row.id, unitcode: row.unitcode }
    }));

    return NextResponse.json({
      type: "FeatureCollection",
      features
    });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}