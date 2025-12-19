import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Get site polygons and info, format as FeatureCollection for Leaflet
export async function GET(req: NextRequest) {
  try {
    const unitcodesParam = req.nextUrl.searchParams.get("unitcodes");
  let query = `
    SELECT s.id, ST_AsGeoJSON(ST_GeomFromText(s.polygon_geom)) as geometry, s.parks_within_30_mi_unitcodes
    FROM mart.site_and_vc_features s
    WHERE s.type = 'site'
  `;
    const params: any[] = [];
    console.log(query, params)

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

    const { rows } = await pool.query(query, params);
    const features = rows.map((row: any) => ({
      type: "Feature",
      geometry: JSON.parse(row.geometry),
      properties: { id: row.id }
    }));


    return NextResponse.json({ type: "FeatureCollection", features });
  } catch (error) {
    console.error("Error fetching site polygons:", error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}