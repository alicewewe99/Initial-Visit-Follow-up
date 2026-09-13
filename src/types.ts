export interface MonthStat {
  t: number;    // Total (初診總量)
  reg: number;  // Regular returned (規則返診)
  nR: number;   // Not returned (未規則返診)
}

export type BaseStatsMap = Record<string, MonthStat>;

export interface ReasonDiagItem {
  id: number;
  r: string; // Reason (未返診原因)
  d: string; // Diagnosis Code (診斷代碼)
}
