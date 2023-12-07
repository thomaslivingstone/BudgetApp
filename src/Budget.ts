

export class Budget {

    name: string;
    budgetItems: Map<number, BudgetItem>;
    totalAmountBudgeted: number;
    categories: BudgetCategory[];
    #currentID: number;

    constructor(name: string, totalAmount: number) {
        this.name = name;
        this.budgetItems = new Map();
        this.totalAmountBudgeted = totalAmount;
        this.categories = [];
        this.#currentID = 0;
    }

    addBudgetItemByObj(item: BudgetItem): void {
        this.budgetItems.set(this.#currentID++, item);
    }

    addBudgetItemByParam(name: string, type: string, category: string, date: Date, amount: number): void {
        for (let cat of this.categories) {
            if (cat.name === category) {
                this.budgetItems.set(this.#currentID++, new BudgetItem(name, type, cat, date, amount));
                break;
            }
        }
    }

    removeBudgetItemById(id: number): void {
        this.budgetItems.delete(id);
    }

    getSpentSum(): number {
        let sum = 0;
        for (let budgetItem of this.budgetItems.values()) {
            sum += budgetItem.amount;
        }
        return sum;
    }

    addCategory(category: string, amount: number): void {
        this.categories.push(new BudgetCategory(category, amount));
    }
}

export class BudgetItem {

    name: string;
    type: string;
    category: BudgetCategory;
    date: Date;
    amount: number;

    constructor(name: string, type: string, category: BudgetCategory, date: Date, amount: number) {
        this.name = name;
        this.type = type;
        this.category = category;
        this.date = date;
        this.amount = amount;
    }

}

export class BudgetCategory {

    name: string;
    amount: number;

    constructor(name: string, amount: number) {
        this.name = name;
        this.amount = amount;
    }
}