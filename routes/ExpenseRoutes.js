import ExpenseController from '../controller/ExpenseController.js';
import { Router } from 'express';
import authorizeRoles from '../utilites/auth/authorizeRoles.js';

const expenseRouter = Router();
expenseRouter.post(
    '/addExpense',
    authorizeRoles(4),
    ExpenseController.addExpense
);
expenseRouter.put(
    '/updateExpense',
    authorizeRoles(4),
    ExpenseController.updateExpense
);
expenseRouter.delete(
    '/deleteExpense',
    authorizeRoles(4),
    ExpenseController.deleteExpense
);
expenseRouter.get(
    '/getExpenseById',
    authorizeRoles(4),
    ExpenseController.getExpenseById
);
expenseRouter.get(
    '/getAllExpenses',
    authorizeRoles(4),
    ExpenseController.getExpensesByEvent
);

export default expenseRouter;
