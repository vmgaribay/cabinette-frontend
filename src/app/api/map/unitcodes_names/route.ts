import { NextResponse } from "next/server";
import { Pool } from "pg";

type ParkRow = {
  unitcode: string;
  parkname: string;
};

const globalForPool = global as unknown as { pool: Pool | undefined };
const pool = globalForPool.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });
if (!globalForPool.pool) globalForPool.pool = pool;

export async function GET() {
  try {
    const { rows } = await pool.query<ParkRow>(`
      SELECT DISTINCT unitcode, parkname
      FROM core.visitation_monthly
      WHERE unitcode IN (
          SELECT SPLIT_PART(rel.vc_id, '_', 1)
      FROM mart.vc_site_rel rel
      )
    `);
    return NextResponse.json(rows);
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
