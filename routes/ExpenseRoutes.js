import ExpenseController from '../controller/ExpenseController.js';
import { Router } from 'express';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';

const expenseRouter = Router();
expenseRouter.post(
    '/addExpense',
    ExpenseController.addExpense
);
expenseRouter.put(
    '/updateExpense',
    ExpenseController.updateExpense
);
expenseRouter.delete(
    '/deleteExpense',
    ExpenseController.deleteExpense
);
expenseRouter.get(
    '/getExpenseById',
    ExpenseController.getExpenseById
);
expenseRouter.get(
    '/getAllExpenses',
    ExpenseController.getAllExpenses
);

export default expenseRouter;
