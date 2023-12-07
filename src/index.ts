import { Budget, BudgetItem } from "./Budget";
import { OverviewModule, BudgetModule, TransactionModule, GoalModule } from "./Modules";

function main(): void {

    let currentModule;

    let budget = new Budget("The best budget", 1000);
    budget.addCategory("Convenience", 400);
    budget.addCategory("Grocery", 100);



    let transactionModule = new TransactionModule("Transactions", document.querySelector("#moduleHolder"), budget)


    // Default Module
    currentModule = transactionModule;
    document.querySelector("#budgetTitle").innerHTML = budget.name + " - " + currentModule.name;
    currentModule.displayModule();
}

function switchModule(): void {

}


main();