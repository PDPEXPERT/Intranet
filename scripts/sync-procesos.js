#!/usr/bin/env node

/**
 * sync-procesos.js
 * Lee content/procesos/*.json y sincroniza con Supabase.
 *
 * Uso:
 *   npm run sync
 *
 * Requiere en .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ---------------------------------------------------------------------------
// Cargar .env.local (sin depender de dotenv)
// ---------------------------------------------------------------------------
const envPath = path.resolve(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  for (const line of envContent.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim();
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

// ---------------------------------------------------------------------------
// Configuración
// ---------------------------------------------------------------------------
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error(
    '❌ Faltan variables de entorno.\n' +
    '   Asegúrate de tener NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY en .env.local'
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

const CONTENT_DIR = path.resolve(__dirname, '..', 'content', 'procesos');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function readJson(filename) {
  const filePath = path.join(CONTENT_DIR, filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
}

function getProcedureFiles() {
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.startsWith('PRC-CON-') && f.endsWith('.json'))
    .sort();
}

// ---------------------------------------------------------------------------
// Sync procedures + activities
// ---------------------------------------------------------------------------

async function syncProcedure(json) {
  const { activities, ...procedureData } = json;

  // Upsert procedure (on conflict code)
  const { data: proc, error: procError } = await supabase
    .from('procedures')
    .upsert(procedureData, { onConflict: 'code' })
    .select('id, code')
    .single();

  if (procError) {
    throw new Error(`Error upserting ${json.code}: ${procError.message}`);
  }

  console.log(`  ✅ ${proc.code} → ${proc.id}`);

  // Eliminar actividades existentes para re-insertar
  const { error: delError } = await supabase
    .from('activities')
    .delete()
    .eq('procedure_id', proc.id);

  if (delError) {
    throw new Error(`Error eliminando activities de ${proc.code}: ${delError.message}`);
  }

  // Insertar actividades con procedure_id
  if (activities && activities.length > 0) {
    const rows = activities.map((a) => ({
      procedure_id: proc.id,
      sort_order: a.sort_order,
      type: a.type,
      number: a.number,
      title: a.title,
      trigger: a.trigger,
      executor: a.executor,
      description: a.description,
      result: a.result,
      evidence: a.evidence,
      outcomes: a.outcomes,
    }));

    const { error: actError } = await supabase
      .from('activities')
      .insert(rows);

    if (actError) {
      throw new Error(`Error insertando activities de ${proc.code}: ${actError.message}`);
    }

    console.log(`     ${rows.length} actividades`);
  }

  return proc;
}

// ---------------------------------------------------------------------------
// Sync invocations
// ---------------------------------------------------------------------------

async function syncInvocations(codeToId) {
  const invocations = readJson('_invocations.json');

  // Eliminar invocaciones existentes
  const { error: delError } = await supabase
    .from('procedure_invocations')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (delError) {
    throw new Error(`Error eliminando invocations: ${delError.message}`);
  }

  if (invocations.length === 0) {
    console.log('  ℹ️  Sin invocaciones');
    return;
  }

  const rows = invocations.map((inv) => {
    const callerId = codeToId[inv.caller_code];
    const calleeId = codeToId[inv.callee_code];

    if (!callerId) throw new Error(`caller_code no encontrado: ${inv.caller_code}`);
    if (!calleeId) throw new Error(`callee_code no encontrado: ${inv.callee_code}`);

    return {
      caller_id: callerId,
      callee_id: calleeId,
      context: inv.context,
    };
  });

  const { error: insError } = await supabase
    .from('procedure_invocations')
    .insert(rows);

  if (insError) {
    throw new Error(`Error insertando invocations: ${insError.message}`);
  }

  console.log(`  ✅ ${rows.length} invocaciones`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('🔄 Sync procesos → Supabase');
  console.log(`   URL: ${SUPABASE_URL}`);
  console.log(`   Directorio: ${CONTENT_DIR}\n`);

  const files = getProcedureFiles();
  console.log(`📁 ${files.length} procedimientos encontrados\n`);

  const codeToId = {};

  for (const file of files) {
    console.log(`📄 ${file}`);
    const json = readJson(file);
    const proc = await syncProcedure(json);
    codeToId[proc.code] = proc.id;
  }

  console.log('\n🔗 Invocaciones');
  await syncInvocations(codeToId);

  console.log('\n✅ Sync completado');
}

main().catch((err) => {
  console.error(`\n❌ Error fatal: ${err.message}`);
  process.exit(1);
});
