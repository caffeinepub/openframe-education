/**
 * referralStore.ts
 * localStorage-based data store for the FE → Admin Referral System.
 * All operations are wrapped in try/catch for safety.
 */

// ─── Types ────────────────────────────────────────────────────────────────────

export type LeadStatus = "Pending" | "Approved" | "Rejected";
export type PaymentStatus = "Unpaid" | "Received";
export type WithdrawalStatus = "Pending" | "Approved" | "Rejected";

export interface EnrollmentLead {
  leadId: string;
  studentName: string;
  parentName: string;
  mobile: string;
  classLevel: string;
  courseSelected: string; // "Basic" | "Standard" | "Premium" | "Pragati Magazine"
  cityVillage: string;
  referralCode: string; // e.g. "AK1023"
  feAccountId: string;
  status: LeadStatus;
  paymentStatus: PaymentStatus;
  commissionAmount: number;
  commissionPaid: boolean;
  createdAt: number;
}

export interface FieldExecAccount {
  feAccountId: string; // e.g. "FE1001"
  feCode: string; // referral code e.g. "AK1023"
  name: string;
  phone: string;
  upiDetails: string;
  totalEarned: number;
  totalWithdrawn: number;
  enrollmentCount: number;
  bonusEarned: number;
  isActive: boolean;
  createdAt: number;
}

export interface WithdrawalRequest {
  requestId: string;
  feAccountId: string;
  amount: number;
  upiDetails: string;
  status: WithdrawalStatus;
  adminNote: string;
  createdAt: number;
}

// ─── Commission Map ───────────────────────────────────────────────────────────

export const COMMISSION_MAP: Record<string, number> = {
  Basic: 50,
  Standard: 100,
  Premium: 150,
  "Pragati Magazine": 50,
};

export const BONUS_PER_10 = 100;

// ─── Storage Keys ─────────────────────────────────────────────────────────────

const KEYS = {
  leads: "oe_leads",
  feAccounts: "oe_fe_accounts",
  withdrawals: "oe_withdrawals",
} as const;

// ─── Generic Helpers ──────────────────────────────────────────────────────────

function readStore<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeStore<T>(key: string, data: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch {
    // quota exceeded or private mode — silently fail
  }
}

// ─── Leads ────────────────────────────────────────────────────────────────────

export function getLeads(): EnrollmentLead[] {
  return readStore<EnrollmentLead>(KEYS.leads);
}

export function saveLead(lead: EnrollmentLead): void {
  const leads = getLeads();
  leads.push(lead);
  writeStore(KEYS.leads, leads);
}

export function updateLead(
  leadId: string,
  updates: Partial<EnrollmentLead>,
): void {
  const leads = getLeads().map((l) =>
    l.leadId === leadId ? { ...l, ...updates } : l,
  );
  writeStore(KEYS.leads, leads);
}

// ─── FE Accounts ──────────────────────────────────────────────────────────────

export function getFEAccounts(): FieldExecAccount[] {
  return readStore<FieldExecAccount>(KEYS.feAccounts);
}

export function saveFEAccount(acc: FieldExecAccount): void {
  const accounts = getFEAccounts().filter(
    (a) => a.feAccountId !== acc.feAccountId,
  );
  accounts.push(acc);
  writeStore(KEYS.feAccounts, accounts);
}

export function updateFEAccount(
  id: string,
  updates: Partial<FieldExecAccount>,
): void {
  const accounts = getFEAccounts().map((a) =>
    a.feAccountId === id ? { ...a, ...updates } : a,
  );
  writeStore(KEYS.feAccounts, accounts);
}

export function getFEByCode(code: string): FieldExecAccount | undefined {
  return getFEAccounts().find((a) => a.feCode === code);
}

// ─── Withdrawals ──────────────────────────────────────────────────────────────

export function getWithdrawals(): WithdrawalRequest[] {
  return readStore<WithdrawalRequest>(KEYS.withdrawals);
}

export function saveWithdrawal(w: WithdrawalRequest): void {
  const list = getWithdrawals();
  list.push(w);
  writeStore(KEYS.withdrawals, list);
}

export function updateWithdrawal(
  id: string,
  updates: Partial<WithdrawalRequest>,
): void {
  const list = getWithdrawals().map((w) =>
    w.requestId === id ? { ...w, ...updates } : w,
  );
  writeStore(KEYS.withdrawals, list);
}

// ─── Business Logic ───────────────────────────────────────────────────────────

/**
 * Approves a lead:
 * - Sets status = Approved, paymentStatus = Received, commissionPaid = true
 * - Credits commission + any new bonus to the FE account
 */
export function approveLead(leadId: string): void {
  const lead = getLeads().find((l) => l.leadId === leadId);
  if (!lead) return;

  updateLead(leadId, {
    status: "Approved",
    paymentStatus: "Received",
    commissionPaid: true,
  });

  if (!lead.feAccountId) return;

  const account = getFEAccounts().find(
    (a) => a.feAccountId === lead.feAccountId,
  );
  if (!account) return;

  const newEnrollmentCount = account.enrollmentCount + 1;
  const prevBonusMilestones = Math.floor(account.enrollmentCount / 10);
  const newBonusMilestones = Math.floor(newEnrollmentCount / 10);
  const bonusIncrement =
    (newBonusMilestones - prevBonusMilestones) * BONUS_PER_10;

  updateFEAccount(lead.feAccountId, {
    enrollmentCount: newEnrollmentCount,
    totalEarned: account.totalEarned + lead.commissionAmount + bonusIncrement,
    bonusEarned: account.bonusEarned + bonusIncrement,
  });
}

/**
 * Rejects a lead — sets status = Rejected.
 */
export function rejectLead(leadId: string): void {
  updateLead(leadId, { status: "Rejected" });
}

/**
 * Approves a withdrawal request — sets status = Approved, increments FE totalWithdrawn.
 */
export function approveWithdrawal(requestId: string, note: string): void {
  const request = getWithdrawals().find((w) => w.requestId === requestId);
  if (!request) return;

  updateWithdrawal(requestId, { status: "Approved", adminNote: note });

  const account = getFEAccounts().find(
    (a) => a.feAccountId === request.feAccountId,
  );
  if (account) {
    updateFEAccount(request.feAccountId, {
      totalWithdrawn: account.totalWithdrawn + request.amount,
    });
  }
}

/**
 * Rejects a withdrawal request with an optional admin note.
 */
export function rejectWithdrawal(requestId: string, note: string): void {
  updateWithdrawal(requestId, { status: "Rejected", adminNote: note });
}

// ─── Seed Default FE Account ──────────────────────────────────────────────────

/**
 * Ensures the AK1023 FE account exists. Call on FE dashboard mount.
 */
export function ensureDefaultFEAccount(): FieldExecAccount {
  const existing = getFEByCode("AK1023");
  if (existing) return existing;

  const account: FieldExecAccount = {
    feAccountId: "FE1001",
    feCode: "AK1023",
    name: "Field Executive",
    phone: "7996401388",
    upiDetails: "",
    totalEarned: 0,
    totalWithdrawn: 0,
    enrollmentCount: 0,
    bonusEarned: 0,
    isActive: true,
    createdAt: Date.now(),
  };
  saveFEAccount(account);
  return account;
}
