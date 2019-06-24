export interface Amount {
  amount: number;
  currency: string;
}

export interface Expense {
  id: string;
  purchasedOn: Date;
  nature: string;
  originalAmount: Amount;
  convertedAmount: Amount;
  comment: string;
  createdAt?: Date;
  lastModifiedAt?: Date;
}

export interface ExpenseStore {
  items: { [id: string]: Expense };
  count: number;
}
