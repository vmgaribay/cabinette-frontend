import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { VCInfoRow } from '@/app/types';

const globalForPool = global as unknown as { pool: Pool | undefined };
const pool = globalForPool.pool ?? new Pool({ connectionString: process.env.DATABASE_URL });
if (!globalForPool.pool) globalForPool.pool = pool;

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
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}