
import { Budget, BudgetItem, BudgetCategory } from "./Budget"


export interface IModule {

    name: string;
    parent: HTMLElement | null;
    budget: Budget;

    displayModule(): void;
    clearModule(): void;

}

abstract class Module implements IModule {
    name: string;
    parent: HTMLElement | null;
    budget: Budget;

    constructor(name: string, parent: HTMLElement | null, budget: Budget) {
        this.name = name;
        this.parent = parent;
        this.budget = budget;
    }

    abstract displayModule(): void;

    clearModule(): void {
        this.parent.innerHTML = "";
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

        let budgetItemDateDiv = document.createElement("div");
        budgetItemDateDiv.classList.add("addBudgetItemFormSection");
        let budgetItemDateLabel = document.createElement("label");
        budgetItemDateLabel.htmlFor = "date";
        budgetItemDateLabel.innerText = "Date";
        let budgetItemDateInput = document.createElement("input");
        budgetItemDateInput.type = "date";
        budgetItemDateInput.name = "date";
        budgetItemDateInput.id = "budgetItemDateInput";
        budgetItemDateInput.required = true;
        budgetItemDateDiv.appendChild(budgetItemDateLabel);
        budgetItemDateDiv.appendChild(budgetItemDateInput);

        let budgetItemDescriptionDiv = document.createElement("div");
        budgetItemDescriptionDiv.classList.add("addBudgetItemFormSection")
        let budgetItemDescriptionLabel = document.createElement("label");
        budgetItemDescriptionLabel.htmlFor = "description";
        budgetItemDescriptionLabel.innerText = "Description"
        let budgetItemDescriptionInput = document.createElement("input");
        budgetItemDescriptionInput.type = "text";
        budgetItemDescriptionInput.name = "description";
        budgetItemDescriptionInput.id = "budgetItemDescriptionInput";
        budgetItemDescriptionInput.required = true;
        budgetItemDescriptionDiv.appendChild(budgetItemDescriptionLabel);
        budgetItemDescriptionDiv.appendChild(budgetItemDescriptionInput);


        let budgetItemCategoryDiv = document.createElement("div");
        budgetItemCategoryDiv.classList.add("addBudgetItemFormSection")
        let budgetItemCategoryLabel = document.createElement("label");
        budgetItemCategoryLabel.htmlFor = "category";
        budgetItemCategoryLabel.innerText = "Category"
        let budgetItemCategoryInput = document.createElement("select");
        budgetItemCategoryInput.name = "category";
        budgetItemCategoryInput.id = "budgetItemCategoryInput";
        budgetItemCategoryInput.required = true;

        for (let category of this.budget.categories) {
            let option = document.createElement("option");
            option.value = category.name;
            option.innerText = category.name;
            budgetItemCategoryInput.appendChild(option);
        }

        budgetItemCategoryDiv.appendChild(budgetItemCategoryLabel);
        budgetItemCategoryDiv.appendChild(budgetItemCategoryInput);


        let budgetItemAmountDiv = document.createElement("div");
        budgetItemAmountDiv.classList.add("addBudgetItemFormSection")
        let budgetItemAmountLabel = document.createElement("label");
        budgetItemAmountLabel.htmlFor = "amount";
        budgetItemAmountLabel.innerText = "Amount"
        let budgetItemAmountInput = document.createElement("input");
        budgetItemAmountInput.type = "number";
        budgetItemAmountInput.name = "amount";
        budgetItemAmountInput.id = "budgetItemAmountInput";
        budgetItemAmountInput.required = true;
        budgetItemAmountDiv.appendChild(budgetItemAmountLabel);
        budgetItemAmountDiv.appendChild(budgetItemAmountInput);

        let budgetItemSubmitBtnDiv = document.createElement("div");
        budgetItemSubmitBtnDiv.classList.add("addBudgetItemFormSection");
        let budgetItemSubmitBtn = document.createElement("button");
        budgetItemSubmitBtn.innerText = "Add Transaction";
        budgetItemSubmitBtn.type = "submit";
        addBudgetItemForm.addEventListener("submit", (e) => {
            e.preventDefault();
            // create date with + "T00:00:00" to ensure local time zone 
            this.budget.addBudgetItemByParam(budgetItemDescriptionInput.value, "transaction", budgetItemCategoryInput.value, new Date(budgetItemDateInput.value + "T00:00:00"), parseFloat(budgetItemAmountInput.value));
            this.#updateBudgetItemEntries();
            this.#updateSummary();
        })
        budgetItemSubmitBtnDiv.appendChild(budgetItemSubmitBtn);


        addBudgetItemForm.appendChild(budgetItemDateDiv);
        addBudgetItemForm.appendChild(budgetItemDescriptionDiv);
        addBudgetItemForm.appendChild(budgetItemCategoryDiv);
        addBudgetItemForm.appendChild(budgetItemAmountDiv);
        addBudgetItemForm.appendChild(budgetItemSubmitBtnDiv);

        // items list
        let budgetItemListDiv = document.createElement("div");
        budgetItemListDiv.classList.add("budgetItemList");
        budgetItemListDiv.id = "budgetItemList";

        // summary
        let budgetSummaryDiv = document.createElement("div");
        budgetSummaryDiv.classList.add("budgetSummary");
        budgetSummaryDiv.id = "budgetSummary";


        budgetDiv.appendChild(addBudgetItemForm);
        budgetDiv.appendChild(budgetSummaryDiv);
        budgetDiv.appendChild(budgetItemListDiv);

        if (this.parent !== null) {
            this.parent.appendChild(budgetDiv);
        }

        // add items
        this.#updateBudgetItemEntries();
        this.#updateSummary();
    }

    #updateBudgetItemEntries(): void {
        let budgetItemListDiv = document.querySelector("#budgetItemList");
        budgetItemListDiv.innerHTML = "";

        let budgetItemListTable = document.createElement("table");
        budgetItemListTable.classList.add("budgetItemListTable");
        budgetItemListTable.id = "budgetItemListTable";

        let tableHeaderDate = document.createElement("th");
        tableHeaderDate.classList.add("tableHeaderDate");
        tableHeaderDate.innerText = "Date";

        let tableHeaderTitle = document.createElement("th");
        tableHeaderTitle.innerText = "Description";
        tableHeaderTitle.classList.add("tableHeaderTitle");

        let tableHeaderCategory = document.createElement("th");
        tableHeaderCategory.innerText = "Category";
        tableHeaderCategory.classList.add("tableHeaderCategory");

        let tableHeaderAmount = document.createElement("th");
        tableHeaderAmount.innerText = "Amount";
        tableHeaderAmount.classList.add("tableHeaderAmount");

        let tableHeaderEdit = document.createElement("th");
        let tableHeaderDelete = document.createElement("th");

        let headerRow = document.createElement("tr");
        headerRow.classList.add("tableHeader");

        headerRow.appendChild(tableHeaderDate);
        headerRow.appendChild(tableHeaderTitle);
        headerRow.appendChild(tableHeaderCategory);
        headerRow.appendChild(tableHeaderAmount);
        headerRow.appendChild(tableHeaderEdit);
        headerRow.appendChild(tableHeaderDelete);
        budgetItemListTable.appendChild(headerRow);
        budgetItemListDiv.appendChild(budgetItemListTable);

        for (let entry of this.budget.budgetItems.entries()) {
            this.#addBudgetItemToTable(entry[0], entry[1], budgetItemListTable);
        }

        if (this.budget.budgetItems.size === 0) {
            budgetItemListDiv.innerHTML = "No Transactions Found";
        }
    }

    #addBudgetItemToTable(id: number, budgetItem: BudgetItem, budgetItemTable: Element | null): void {

        let tableRow = document.createElement("tr");
        tableRow.classList.add("budgetItem");
        tableRow.id = id.toString();

        let budgetItemDate = document.createElement("td");
        budgetItemDate.classList.add("budgetItemDate");
        budgetItemDate.innerText = budgetItem.date.toDateString();

        let budgetItemTitle = document.createElement("td");
        budgetItemTitle.classList.add("budgetItemTitle");
        budgetItemTitle.innerText = budgetItem.name;



        let budgetItemCategory = document.createElement("td");
        budgetItemCategory.classList.add("budgetItemCategory");
        budgetItemCategory.innerText = budgetItem.category.name;

        let budgetItemAmount = document.createElement("td");
        budgetItemAmount.classList.add("budgetItemAmount");
        budgetItemAmount.innerText = "$" + budgetItem.amount.toString();

        let editBudgetItemBtnTd = document.createElement("td")
        let editBudgetItemBtn = document.createElement("button");
        editBudgetItemBtn.classList.add("editBudgetItemButton");
        editBudgetItemBtn.innerText = "Edit";
        editBudgetItemBtnTd.appendChild(editBudgetItemBtn)

        let deleteBudgetItemBtnTd = document.createElement("td")
        let deleteBudgetItemBtn = document.createElement("button");
        deleteBudgetItemBtn.classList.add("deleteBudgetItemButton");
        deleteBudgetItemBtn.innerText = "X";
        deleteBudgetItemBtnTd.appendChild(deleteBudgetItemBtn);

        tableRow.appendChild(budgetItemDate);
        tableRow.appendChild(budgetItemTitle);
        tableRow.appendChild(budgetItemCategory);
        tableRow.appendChild(budgetItemAmount);
        tableRow.appendChild(editBudgetItemBtnTd);
        tableRow.appendChild(deleteBudgetItemBtnTd);

        if (budgetItemTable !== null) {
            budgetItemTable.appendChild(tableRow);
        }


        this.#updateSummary();
    }

    #updateSummary(): void {
        let budgetSummaryDiv = document.querySelector("#budgetSummary");

        let budgetSummaryProjectedDiv = document.createElement("div");
        budgetSummaryProjectedDiv.classList.add("budgetSummaryProjected", "budgetSummaryItem");
        let budgetSummaryProjectedTitle = document.createElement("div");
        budgetSummaryProjectedTitle.classList.add("budgetSummaryProjectedTitle");
        budgetSummaryProjectedTitle.innerText = "Projected";
        let budgetSummaryProjectedAmount = document.createElement("div");
        budgetSummaryProjectedAmount.classList.add("budgetSummaryProjectedAmount");
        budgetSummaryProjectedAmount.innerText = "$" + this.budget.totalAmountBudgeted.toString();
        budgetSummaryProjectedDiv.appendChild(budgetSummaryProjectedTitle);
        budgetSummaryProjectedDiv.appendChild(budgetSummaryProjectedAmount);


        let budgetSummarySpentDiv = document.createElement("div");
        budgetSummarySpentDiv.classList.add("budgetSummarySpent", "budgetSummaryItem");
        let budgetSummarySpentTitle = document.createElement("div");
        budgetSummarySpentTitle.classList.add("budgetSummarySpentTitle");
        budgetSummarySpentTitle.innerText = "Spent";
        let budgetSummarySpentAmount = document.createElement("div");
        budgetSummarySpentAmount.classList.add("budgetSummarySpentAmount");
        budgetSummarySpentAmount.innerText = "$" + this.budget.getSpentSum().toString();
        budgetSummarySpentDiv.appendChild(budgetSummarySpentTitle);
        budgetSummarySpentDiv.appendChild(budgetSummarySpentAmount);

        let budgetSummaryTotalDiv = document.createElement("div");
        budgetSummaryTotalDiv.classList.add("budgetSummaryTotal", "budgetSummaryItem");
        let budgetSummaryTotalTitle = document.createElement("div");
        budgetSummaryTotalTitle.classList.add("budgetSummaryTotalTitle");
        budgetSummaryTotalTitle.innerText = "Total";
        let budgetSummaryTotalAmount = document.createElement("div");
        budgetSummaryTotalAmount.classList.add("budgetSummaryTotalAmount");
        budgetSummaryTotalAmount.innerText = "$" + (this.budget.totalAmountBudgeted - this.budget.getSpentSum()).toString();
        budgetSummaryTotalDiv.appendChild(budgetSummaryTotalTitle);
        budgetSummaryTotalDiv.appendChild(budgetSummaryTotalAmount);


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