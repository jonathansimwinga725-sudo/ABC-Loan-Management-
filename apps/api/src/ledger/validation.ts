export interface PostingLine {
  accountId: number;
  debitMinor: bigint;
  creditMinor: bigint;
}

export function validateBalancedJournal(lines: PostingLine[]): void {
  if (lines.length < 2) throw new Error("A journal requires at least two entries.");

  let debit = 0n;
  let credit = 0n;

  for (const line of lines) {
    if (line.debitMinor < 0n || line.creditMinor < 0n) {
      throw new Error("Ledger amounts cannot be negative.");
    }
    if ((line.debitMinor > 0n) === (line.creditMinor > 0n)) {
      throw new Error("Each ledger entry must contain either a debit or a credit.");
    }
    debit += line.debitMinor;
    credit += line.creditMinor;
  }

  if (debit !== credit) {
    throw new Error("Journal is not balanced.");
  }
}
