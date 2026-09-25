const fs = require('fs');
const path = require('path');

const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
const provider = process.argv[2] || 'postgresql';

if (!['sqlite', 'postgresql', 'postgres'].includes(provider)) {
  console.error('Invalid provider. Please specify "sqlite" or "postgresql"');
  process.exit(1);
}

const targetProvider = provider === 'postgres' ? 'postgresql' : provider;
let schema = fs.readFileSync(schemaPath, 'utf8');
schema = schema.replace(/provider\s*=\s*"(sqlite|postgresql)"/, `provider = "${targetProvider}"`);
fs.writeFileSync(schemaPath, schema);
console.log(`✓ Prisma schema datasource provider set to: "${targetProvider}"`);
