import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function GET(_req: NextRequest) {
  try {
    const { rows } = await pool.query(`
      SELECT DISTINCT unitcode
      FROM mart.site_and_vc_features
      WHERE type = 'vc'
    `);
    const values = rows.map((r: any) => r.unitcode);
    return NextResponse.json(values);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
