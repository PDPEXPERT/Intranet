export type ProcedurePart = 'compartidos' | 'servicio';

export interface Responsibility {
  role: string;
  responsibility: string;
  authority: string;
}

export interface Input {
  input: string;
  origin: string;
  condition: string;
}

export interface Output {
  output: string;
  recipient: string;
  format: string;
}

export interface Exception {
  id: number;
  title: string;
  situation: string;
  detection: string;
  handling: string;
}

export interface Control {
  control: string;
  activity: string;
  executor: string;
  frequency: string;
  failure_action: string;
}

export interface Risk {
  risk: string;
  description: string;
  activity: string;
  mitigation: string;
}

export interface Indicator {
  indicator: string;
  calculation: string;
  frequency: string;
  responsible: string;
  acceptable_value: string;
}

export interface Procedure {
  id: string;
  code: string;
  title: string;
  part: ProcedurePart;
  purpose: string;
  scope: string;
  sort_order: number;
  responsibilities: Responsibility[];
  inputs: Input[];
  outputs: Output[];
  exceptions: Exception[];
  controls: Control[];
  risks: Risk[];
  indicators: Indicator[];
}

export type ActivityType =
  | 'event_start'
  | 'activity'
  | 'decision'
  | 'event_end';

export interface ActivityOutcome {
  condition: string;
  next: string;
}

export interface Activity {
  id: string;
  procedure_id: string;
  sort_order: number;
  type: ActivityType;
  number: number | null;
  title: string;
  trigger: string | null;
  executor: string | null;
  description: string | null;
  result: string | null;
  evidence: string | null;
  outcomes: ActivityOutcome[] | null;
}

export interface ProcedureInvocationRow {
  id: string;
  caller_id: string;
  callee_id: string;
  context: string;
}

export interface InvocationLink {
  code: string;
  title: string;
  context: string;
}

export interface ProcedureSummary {
  code: string;
  title: string;
  part: ProcedurePart;
  sort_order: number;
  activity_count: number;
}
