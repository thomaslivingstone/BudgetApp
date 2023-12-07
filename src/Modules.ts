
import { Budget, BudgetItem, BudgetCategory } from "./Budget"


interface IModule {

    name: string;
    parent: HTMLElement | null;
    budget: Budget;

    displayModule(): void;

}

class Module implements IModule {
    name: string;
    parent: HTMLElement | null;
    budget: Budget;

    constructor(name: string, parent: HTMLElement | null, budget: Budget) {
        this.name = name;
        this.parent = parent;
        this.budget = budget;
    }

    displayModule(): void {
        // must override 
    }

}

export class TransactionModule extends Module {

    constructor(name: string, parent: HTMLElement | null, budget: Budget) {
        super(name, parent, budget);
    }

    override displayModule(): void {

        let budgetDiv = document.createElement("div");
        budgetDiv.classList.add("budget");

        // input item form
        let addBudgetItemForm = document.createElement("form");
        addBudgetItemForm.classList.add("addBudgetItemForm");
        addBudgetItemForm.id = "addBudgetItemForm";

        let budgetItemNameInput = document.createElement("input");
        budgetItemNameInput.type = "text";
        budgetItemNameInput.name = "name";
        budgetItemNameInput.id = "budgetItemNameInput";

        let budgetItemDateInput = document.createElement("input");
        budgetItemDateInput.type = "date";
        budgetItemDateInput.name = "date";
        budgetItemDateInput.id = "budgetItemDateInput";

        let budgetItemAmountInput = document.createElement("input");
        budgetItemAmountInput.type = "number";
        budgetItemAmountInput.name = "amount";
        budgetItemAmountInput.id = "budgetItemAmountInput";

        let budgetItemCategoryInput = document.createElement("select");
        budgetItemCategoryInput.name = "category";
        budgetItemCategoryInput.id = "budgetItemCategoryInput";

        for (let category of this.budget.categories) {
            let option = document.createElement("option");
            option.value = category.name;
            option.innerText = category.name;
            budgetItemCategoryInput.appendChild(option);
        }

        let budgetItemSubmitBtn = document.createElement("button");
        budgetItemSubmitBtn.innerText = "+";
        budgetItemSubmitBtn.type = "submit";
        addBudgetItemForm.addEventListener("submit", (e) => {
            e.preventDefault();
            this.budget.addBudgetItemByParam(budgetItemNameInput.value, "transaction", budgetItemCategoryInput.value, new Date(budgetItemDateInput.value), parseFloat(budgetItemAmountInput.value));
            this.#updateBudgetItemEntries();
            this.#updateSummary();
        })

        addBudgetItemForm.appendChild(budgetItemNameInput);
        addBudgetItemForm.appendChild(budgetItemDateInput);
        addBudgetItemForm.appendChild(budgetItemAmountInput);
        addBudgetItemForm.appendChild(budgetItemCategoryInput);
        addBudgetItemForm.appendChild(budgetItemSubmitBtn);

        // items list
        let budgetItemListDiv = document.createElement("div");
        budgetItemListDiv.classList.add("budgetItemList");
        budgetItemListDiv.id = "budgetItemList";

        // summary
        let budgetSummaryDiv = document.createElement("div");
        budgetSummaryDiv.classList.add("budgetSummary");
        budgetSummaryDiv.id = "budgetSummary";

        let budgetSummaryProjectedDiv = document.createElement("div");
        budgetSummaryProjectedDiv.classList.add("budgetSummaryProjected");
        budgetSummaryProjectedDiv.innerText = "Projected Spent: $" + this.budget.totalAmountBudgeted;

        let budgetSummarySpentDiv = document.createElement("div");
        budgetSummarySpentDiv.classList.add("budgetSummarySpent");
        budgetSummarySpentDiv.innerText = "Actual Spent: $" + this.budget.getSpentSum();

        let budgetSummaryTotalDiv = document.createElement("div");
        budgetSummaryTotalDiv.classList.add("budgetSummaryTotal");
        budgetSummaryTotalDiv.innerText = "Difference: " + (this.budget.totalAmountBudgeted - this.budget.getSpentSum());

        budgetSummaryDiv.appendChild(budgetSummaryProjectedDiv);
        budgetSummaryDiv.appendChild(budgetSummarySpentDiv);
        budgetSummaryDiv.appendChild(budgetSummaryTotalDiv);

        budgetDiv.appendChild(addBudgetItemForm);
        budgetDiv.appendChild(budgetItemListDiv);
        budgetDiv.appendChild(budgetSummaryDiv);

        if (this.parent !== null) {
            this.parent.appendChild(budgetDiv);
        }

        // add items
        this.#updateBudgetItemEntries();
    }

    #updateBudgetItemEntries(): void {
        let budgetItemListDiv = document.querySelector("#budgetItemList");
        budgetItemListDiv.innerHTML = "";
        for (let entry of this.budget.budgetItems.entries()) {
            this.#addBudgetItemToDocument(entry[0], entry[1], budgetItemListDiv);
        }
    }

    #addBudgetItemToDocument(id: number, budgetItem: BudgetItem, budgetItemListDiv: Element | null): void {

        let budgetItemDiv = document.createElement("div");
        budgetItemDiv.classList.add("budgetItem");
        budgetItemDiv.id = id.toString();

        let budgetItemTitleDiv = document.createElement("div");
        budgetItemTitleDiv.classList.add("budgetItemTitle");
        budgetItemTitleDiv.innerText = budgetItem.name;

        let budgetItemDateDiv = document.createElement("div");
        budgetItemDateDiv.classList.add("budgetDateTitle");
        budgetItemDateDiv.innerText = budgetItem.date.toDateString();

        let budgetItemAmountDiv = document.createElement("div");
        budgetItemAmountDiv.classList.add("budgetItemAmount");
        budgetItemAmountDiv.innerText = "$" + budgetItem.amount.toString();

        let budgetItemCategoryDiv = document.createElement("div");
        budgetItemCategoryDiv.classList.add("budgetItemCategory");
        budgetItemCategoryDiv.innerText = budgetItem.category.name;

        let editBudgetItemBtn = document.createElement("button");
        editBudgetItemBtn.classList.add("editBudgetItemBtn");
        editBudgetItemBtn.innerText = "Edit";

        let deleteBudgetItemBtn = document.createElement("button");
        deleteBudgetItemBtn.classList.add("deleteBudgetItemButton");
        deleteBudgetItemBtn.innerText = "X";

        budgetItemDiv.appendChild(budgetItemTitleDiv);
        budgetItemDiv.appendChild(budgetItemDateDiv);
        budgetItemDiv.appendChild(budgetItemAmountDiv);
        budgetItemDiv.appendChild(budgetItemCategoryDiv);
        budgetItemDiv.appendChild(editBudgetItemBtn);
        budgetItemDiv.appendChild(deleteBudgetItemBtn);

        if (budgetItemListDiv !== null) {
            budgetItemListDiv.appendChild(budgetItemDiv);
        }
        console.log(budgetItem);
    }

    #updateSummary() {
        let budgetSummaryDiv = document.querySelector("#budgetSummary");

        let budgetSummaryProjectedDiv = document.createElement("div");
        budgetSummaryProjectedDiv.classList.add("budgetSummaryProjected");
        budgetSummaryProjectedDiv.innerText = "Projected Spent: $" + this.budget.totalAmountBudgeted;

        let budgetSummarySpentDiv = document.createElement("div");
        budgetSummarySpentDiv.classList.add("budgetSummarySpent");
        budgetSummarySpentDiv.innerText = "Actual Spent: $" + this.budget.getSpentSum();

        let budgetSummaryTotalDiv = document.createElement("div");
        budgetSummaryTotalDiv.classList.add("budgetSummaryTotal");
        budgetSummaryTotalDiv.innerText = "Difference: " + (this.budget.totalAmountBudgeted - this.budget.getSpentSum());

        if (budgetSummaryDiv !== null) {
            budgetSummaryDiv.innerHTML = "";
            budgetSummaryDiv.appendChild(budgetSummaryProjectedDiv);
            budgetSummaryDiv.appendChild(budgetSummarySpentDiv);
            budgetSummaryDiv.appendChild(budgetSummaryTotalDiv);
        }
    }

}

export class OverviewModule extends Module {

    constructor(name: string, parent: HTMLElement | null, budget: Budget) {
        super(name, parent, budget);
    }

    override displayModule(): void {

    }
}

export class BudgetModule extends Module {

    constructor(name: string, parent: HTMLElement | null, budget: Budget) {
        super(name, parent, budget);
    }

    override displayModule(): void {

    }
}

export class GoalModule extends Module {

    constructor(name: string, parent: HTMLElement | null, budget: Budget) {
        super(name, parent, budget);
    }

    override displayModule(): void {

    }
}