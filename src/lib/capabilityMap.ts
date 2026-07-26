export interface SubCapability {
  code: string;
  name: string;
  description: string;
}

export interface Capability {
  code: string;
  name: string;
  description: string;
  objeto: string;
  subcapabilities: SubCapability[];
}

export type TierKey = 'strat' | 'core' | 'supp';

export interface CapabilityTier {
  key: TierKey;
  name: string;
  tag: string;
  capabilities: Capability[];
}

export interface BusinessLine {
  name: string;
  codes?: string[];
  note?: string;
}

export interface CapabilityMapData {
  version: string;
  fecha: string;
  purpose: string;
  tiers: CapabilityTier[];
  businessLines: BusinessLine[];
}
