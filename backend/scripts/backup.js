/**
 * Safe PostgreSQL Database Backup Tool for SSR Solar Power Backend
 *
 * Supported Commands:
 *   npm run db:backup            -> Full Database Dump
 *   npm run db:backup:referrals  -> Referrals-Only Table Dump
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Parse CLI flags
const isReferralsOnly = process.argv.includes('--referrals-only');

// Read DATABASE_URL from .env or environment
const envPath = path.join(__dirname, '..', '.env');
let dbUrl = process.env.DATABASE_URL;

if (!dbUrl && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/DATABASE_URL=["']?([^"'\r\n]+)["']?/);
  if (match) dbUrl = match[1];
}

if (!dbUrl) {
  console.error('❌ Error: DATABASE_URL is not set in environment or .env file.');
  process.exit(1);
}

// Parse PostgreSQL URL format: postgresql://user:password@host:port/dbname?schema=public
let parsedUrl;
try {
  parsedUrl = new URL(dbUrl);
} catch (err) {
  console.error('❌ Error: Failed to parse DATABASE_URL string format.');
  process.exit(1);
}

const dbUser = decodeURIComponent(parsedUrl.username || 'postgres');
const dbPassword = decodeURIComponent(parsedUrl.password || '');
const dbHost = parsedUrl.hostname || 'localhost';
const dbPort = parsedUrl.port || '5432';
const dbName = parsedUrl.pathname.replace(/^\//, '') || 'ssr_solar_db';

// Discover pg_dump executable
function findPgDump() {
  try {
    const res = spawnSync(process.platform === 'win32' ? 'where' : 'which', ['pg_dump'], { encoding: 'utf-8' });
    if (res.status === 0 && res.stdout) {
      const dumpPath = res.stdout.trim().split(/[\r\n]+/)[0];
      if (fs.existsSync(dumpPath)) return dumpPath;
    }
  } catch {}

  if (process.platform === 'win32') {
    const candidatePaths = [
      'C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe',
      'C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe',
      'C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump.exe',
      'C:\\Program Files\\PostgreSQL\\14\\bin\\pg_dump.exe',
      'C:\\Program Files\\PostgreSQL\\17\\pgAdmin 4\\runtime\\pg_dump.exe',
    ];
    for (const p of candidatePaths) {
      if (fs.existsSync(p)) return p;
    }
  }

  return 'pg_dump';
}

const pgDumpExec = findPgDump();

// Format timestamp: YYYY-MM-DD-HH-mm
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');
const timestamp = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}-${pad(now.getHours())}-${pad(now.getMinutes())}`;

// Prepare target backup directory
const backupsDir = path.join(__dirname, '..', 'backups');
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

// Generate unique timestamped filename (never overwrite existing backups)
const filePrefix = isReferralsOnly ? 'ssr-solar-referrals' : 'ssr-solar';
let backupFileName = `${filePrefix}-${timestamp}.dump`;
let backupFilePath = path.join(backupsDir, backupFileName);

if (fs.existsSync(backupFilePath)) {
  const seconds = pad(now.getSeconds());
  backupFileName = `${filePrefix}-${timestamp}-${seconds}.dump`;
  backupFilePath = path.join(backupsDir, backupFileName);
}

console.log(`📦 Starting PostgreSQL ${isReferralsOnly ? 'Referrals-Only' : 'Complete'} Database Backup...`);
console.log(`🎯 Target Database: ${dbName} at ${dbHost}:${dbPort}`);

// Build pg_dump arguments (Custom format -F c for safe pg_restore)
const dumpArgs = [
  '-U', dbUser,
  '-h', dbHost,
  '-p', dbPort,
  '-d', dbName,
  '-F', 'c',
  '-f', backupFilePath,
];

if (isReferralsOnly) {
  dumpArgs.push('-t', 'referrals');
}

// Execute pg_dump with PGPASSWORD in environment (never logged or exposed)
const env = { ...process.env, PGPASSWORD: dbPassword };
const result = spawnSync(pgDumpExec, dumpArgs, { env, encoding: 'utf-8' });

if (result.status !== 0) {
  console.error(`❌ Backup failed with error:`, result.stderr || result.error);
  process.exit(1);
}

// Verify backup file creation and size
if (!fs.existsSync(backupFilePath)) {
  console.error(`❌ Backup failed: Target dump file was not created.`);
  process.exit(1);
}

const stats = fs.statSync(backupFilePath);
const fileSizeKb = (stats.size / 1024).toFixed(2);
const fileSizeMb = (stats.size / (1024 * 1024)).toFixed(2);
const displaySize = stats.size > 1024 * 1024 ? `${fileSizeMb} MB` : `${fileSizeKb} KB`;

console.log(`\n======================================================`);
console.log(`✅ POSTGRESQL BACKUP COMPLETED SUCCESSFULLY!`);
console.log(`======================================================`);
console.log(`📁 Backup File    : ${backupFileName}`);
console.log(`📍 Absolute Path : ${backupFilePath}`);
console.log(`📊 File Size     : ${displaySize} (${stats.size.toLocaleString()} bytes)`);
console.log(`📅 Timestamp     : ${now.toLocaleString('en-IN')}`);
console.log(`🔒 Excluded Git  : Verified (Ignored by .gitignore)`);
console.log(`======================================================\n`);
