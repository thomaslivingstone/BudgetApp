import { Budget, BudgetItem } from "./Budget";
import { IModule, OverviewModule, BudgetModule, TransactionModule, GoalModule } from "./Modules";

let currentModule: IModule;
let overviewModule: IModule;
let budgetsModule: IModule;
let transactionModule: IModule;
let goalsModule: IModule;
let currentActiveNav: String;
let budget: Budget;

function main(): void {

    // initalizations

    initNav();

    budget = new Budget("The best budget", 1000);
    budget.addCategory("Convenience", 400);
    budget.addCategory("Grocery", 100);


    overviewModule = new OverviewModule("Overview", document.querySelector("#moduleHolder"), budget)
    budgetsModule = new BudgetModule("Budgets", document.querySelector("#moduleHolder"), budget)
    transactionModule = new TransactionModule("Transactions", document.querySelector("#moduleHolder"), budget)
    goalsModule = new GoalModule("Goals", document.querySelector("#moduleHolder"), budget)


    // Default Module
    currentModule = transactionModule;
    document.querySelector("#budgetTitle").innerHTML = budget.name + " - " + currentModule.name;
    document.querySelector("#navTransactions").classList.add("activeNav");
    currentActiveNav = "Transactions";
    currentModule.displayModule();
}

function initNav(): void {



    document.querySelector("#navHomeButton").addEventListener("click", () => {
        switchActiveNav("Overview");
        switchModule(overviewModule);
    })

    document.querySelector("#navOverviewButton").addEventListener("click", () => {
        switchActiveNav("Overview");
        switchModule(overviewModule);
    })

    document.querySelector("#navBudgetsButton").addEventListener("click", () => {
        switchActiveNav("Budgets");
        switchModule(budgetsModule);
    })

    document.querySelector("#navTransactionsButton").addEventListener("click", () => {
        switchActiveNav("Transactions");
        switchModule(transactionModule);
    })

    document.querySelector("#navGoalsButton").addEventListener("click", () => {
        switchActiveNav("Goals");
        switchModule(goalsModule);
    })

}

function switchActiveNav(newActiveNav: String): void {
    document.querySelector("#nav" + currentActiveNav).classList.remove("activeNav");
    currentActiveNav = newActiveNav;
    document.querySelector("#nav" + currentActiveNav).classList.add("activeNav");
}

function switchModule(nextModule: IModule): void {
    currentModule.clearModule();
    currentModule = nextModule;
    document.querySelector("#budgetTitle").innerHTML = budget.name + " - " + currentModule.name;
    currentModule.displayModule();
}


main();