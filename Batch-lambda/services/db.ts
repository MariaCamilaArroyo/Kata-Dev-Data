import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: parseInt(process.env.PGPORT || '5432'),
});

export async function insertCampaigns(data: any[]) {
    console.log('---->>> entra a db antes de connect')
    const client = await pool.connect();
    try {
        console.log('---->>> entra a db')
        await client.query('BEGIN');
        for (const campaign of data) {
            await client.query(
                `INSERT INTO campaigns (client_name, card_amount, interest_rate, client_type) 
           VALUES ($1, $2, $3, $4)`,
                [
                    campaign.nombre_cliente,
                    campaign.monto_tarjeta,
                    campaign.tasa_interes,
                    campaign.tipo_cliente
                ]
            );
        }
        console.log('---->>> termina')

        await client.query('COMMIT');
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
}

