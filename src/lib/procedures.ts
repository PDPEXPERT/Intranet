import { supabase } from './supabase';
import type {
  Activity,
  InvocationLink,
  Procedure,
  ProcedureSummary,
} from './types';

const PROCEDURE_COLUMNS =
  'id, code, title, part, purpose, scope, sort_order, responsibilities, inputs, outputs, exceptions, controls, risks, indicators';

function unwrapRelation<T>(value: unknown): T | null {
  if (value == null) return null;
  if (Array.isArray(value)) return (value[0] as T) ?? null;
  return value as T;
}

export async function listProcedures(): Promise<ProcedureSummary[]> {
  const { data, error } = await supabase
    .from('procedures')
    .select('code, title, part, sort_order, activities(count)')
    .order('sort_order', { ascending: true });

  if (error) throw error;
  if (!data) return [];

  return data.map((row) => {
    const counts = row.activities as Array<{ count: number }> | null;
    return {
      code: row.code as string,
      title: row.title as string,
      part: row.part as ProcedureSummary['part'],
      sort_order: row.sort_order as number,
      activity_count: counts && counts[0] ? counts[0].count : 0,
    };
  });
}

export async function getProcedureByCode(
  code: string,
): Promise<Procedure | null> {
  const { data, error } = await supabase
    .from('procedures')
    .select(PROCEDURE_COLUMNS)
    .eq('code', code)
    .maybeSingle();

  if (error) throw error;
  return (data as Procedure | null) ?? null;
}

export async function listActivitiesByProcedureId(
  procedureId: string,
): Promise<Activity[]> {
  const { data, error } = await supabase
    .from('activities')
    .select(
      'id, procedure_id, sort_order, type, number, title, trigger, executor, description, result, evidence, outcomes',
    )
    .eq('procedure_id', procedureId)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data as Activity[] | null) ?? [];
}

export interface InvocationGroups {
  calls: InvocationLink[];
  calledBy: InvocationLink[];
}

export async function listInvocations(
  procedureId: string,
): Promise<InvocationGroups> {
  const [outRes, inRes] = await Promise.all([
    supabase
      .from('procedure_invocations')
      .select('context, callee:procedures!callee_id(code, title)')
      .eq('caller_id', procedureId),
    supabase
      .from('procedure_invocations')
      .select('context, caller:procedures!caller_id(code, title)')
      .eq('callee_id', procedureId),
  ]);

  if (outRes.error) throw outRes.error;
  if (inRes.error) throw inRes.error;

  const calls: InvocationLink[] = (outRes.data ?? []).map((row) => {
    const callee = unwrapRelation<{ code: string; title: string }>(row.callee);
    return {
      code: callee?.code ?? '',
      title: callee?.title ?? '',
      context: row.context as string,
    };
  });

  const calledBy: InvocationLink[] = (inRes.data ?? []).map((row) => {
    const caller = unwrapRelation<{ code: string; title: string }>(row.caller);
    return {
      code: caller?.code ?? '',
      title: caller?.title ?? '',
      context: row.context as string,
    };
  });

  return { calls, calledBy };
}

export interface SearchHit {
  code: string;
  title: string;
  snippet: string | null;
}

interface SearchRow {
  source: 'procedure' | 'activity';
  procedure_code: string;
  procedure_title: string;
  activity_title: string | null;
  rank: number;
}

export async function searchProcedures(query: string): Promise<SearchHit[]> {
  const { data, error } = await supabase.rpc('search_procedures', { query });
  if (error) throw error;
  const rows = (data as SearchRow[] | null) ?? [];

  const seen = new Set<string>();
  const hits: SearchHit[] = [];
  for (const row of rows) {
    const key = row.procedure_code;
    if (seen.has(key)) continue;
    seen.add(key);
    hits.push({
      code: row.procedure_code,
      title: row.procedure_title,
      snippet:
        row.source === 'activity' && row.activity_title
          ? row.activity_title
          : null,
    });
    if (hits.length >= 10) break;
  }
  return hits;
}
