const ExpenseModule = {
    addExpense: async (EventID, Amount, Description, ImageURL) => {
        const db = await pool.getConnection();
        try {
            await db.query('LOCK TABLES Expenses WRITE, Events READ');
            const [results] = await db.query('SELECT * FROM Events WHERE EventID = ?', [EventID]);
            if (results.length === 0) {
                return setResponseBadRequest('Event not found');
            }
            await db.query(
                'INSERT INTO Expenses (EventID, Amount, Description, ImageURL) VALUES (?, ?, ?, ?)',
                [EventID, Amount, Description, ImageURL]
            );
            await db.query('UNLOCK TABLES');
            return setResponseOk('Expense added successfully');
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError('Failed to add expense');
        } finally {
            db.release();
        }
    },

    updateExpense: async (ExpenseID, EventID, Amount, Description, ImageURL) => {
        const db = await pool.getConnection();
        try {
            await db.query('LOCK TABLES Expenses WRITE, Events READ');
            const [results] = await db.query('SELECT * FROM Expenses WHERE ExpenseID = ?', [ExpenseID]);
            if (results.length === 0) {
                return setResponseBadRequest('Expense not found');
            }
            
            const fields = [];
            const values = [];

            if (EventID) {
                fields.push('EventID = ?');
                values.push(EventID);
            }

            if (Amount) {
                fields.push('Amount = ?');
                values.push(Amount);
            }

            if (Description) {
                fields.push('Description = ?');
                values.push(Description);
            }

            if (ImageURL) {
                fields.push('ImageURL = ?');
                values.push(ImageURL);
            }

            if (fields.length === 0) {
                return setResponseBadRequest('No fields to update');
            }

            values.push(ExpenseID);
            const query = `UPDATE Expenses SET ${fields.join(', ')} WHERE ExpenseID = ?`;
            const result =  await db.query(query, values);
            await db.query('UNLOCK TABLES');
            return setResponseOk('Expense updated successfully', result);
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError('Failed to update expense');
        } finally {
            db.release();
        }
    },

    deleteExpense: async (ExpenseID) => {
        const db = await pool.getConnection();
        try {
            await db.query('LOCK TABLES Expenses WRITE');
            const [results] = await db.query('DELETE FROM Expenses WHERE ExpenseID = ?', [ExpenseID]);
            if (results.affectedRows === 0) {
                return setResponseBadRequest('Expense not found');
            }
            await db.query('UNLOCK TABLES');
            return setResponseOk('Expense deleted successfully');
        } catch (error) {
            await db.query('UNLOCK TABLES');
            return setResponseInternalError('Failed to delete expense');
        } finally {
            db.release();
        }
    },

    getExpenseById: async (ExpenseID) => {
        const db = await pool.getConnection();
        try {
            const [results] = await db.query('SELECT * FROM Expenses WHERE ExpenseID = ?', [ExpenseID]);
            if (results.length === 0) {
                return setResponseBadRequest('Expense not found');
            }
            return setResponseOk('Expense retrieved successfully', results[0]);
        } catch (error) {
            return setResponseInternalError('Failed to retrieve expense');
        } finally {
            db.release();
        }
    },

    getAllExpenses: async (EventID) => {
        const db = await pool.getConnection();
        try {
            const [results] = await db.query('SELECT * FROM Expenses WHERE EventID = ?', [EventID]);
            if (results.length === 0) {
                return setResponseBadRequest('No expenses found for this event');
            }
            return setResponseOk('Expenses retrieved successfully', results);
        } catch (error) {
            return setResponseInternalError('Failed to retrieve expenses');
        } finally {
            db.release();
        }
    }
}

export default ExpenseModule;