import fs from 'fs';
import pg from 'pg';

const env = fs.readFileSync('services/api/.env', 'utf8').split('\n').reduce((acc, line) => {
  const [k, ...v] = line.split('=');
  if (k && v.length) acc[k.trim()] = v.join('=').trim();
  return acc;
}, {});

const replacements = JSON.parse(fs.readFileSync('C:/Users/hp/.gemini/antigravity/brain/fd89a98b-ce5e-4ae0-82f9-b17f07631cfb/scratch/final-replacements.json', 'utf8'));

// 1. Update seed-catalog.json
const catalogPath = 'services/api/src/db/seed-catalog.json';
const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

let updatedInCatalog = 0;
for (const item of catalog) {
  if (replacements[item.sku]) {
    item.image = replacements[item.sku];
    updatedInCatalog++;
  }
}

fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2), 'utf8');
console.log(`[CATALOG] Updated ${updatedInCatalog} products in ${catalogPath}`);

// 2. Update live Supabase Database
async function updateDatabase() {
  const client = new pg.Client({
    host: env.DB_HOST,
    port: parseInt(env.DB_PORT || '5432', 10),
    database: env.DB_NAME,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    ssl: { rejectUnauthorized: false }
  });

  await client.connect();
  console.log('[DATABASE] Connected to Supabase PostgreSQL');

  let updatedInDb = 0;
  for (const [sku, newImageUrl] of Object.entries(replacements)) {
    const res = await client.query(
      'UPDATE products SET image_url = $1 WHERE sku = $2 RETURNING sku, name',
      [newImageUrl, sku]
    );
    if (res.rowCount > 0) {
      updatedInDb++;
      console.log(`[DB UPDATED] ${sku} -> ${res.rows[0].name}`);
    } else {
      console.log(`[DB WARNING] SKU ${sku} not found in products table`);
    }
  }

  console.log(`[DATABASE] Successfully updated ${updatedInDb}/${Object.keys(replacements).length} products in live database!`);
  await client.end();
}

updateDatabase().catch(err => {
  console.error('[DATABASE ERROR]', err);
  process.exit(1);
});
