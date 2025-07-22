const validateExpense = (EventID, Amount, Description ,ImageURL) => {
    if (!EventID || !Amount || !Description ) {
            return 'EventID, Amount, and Description are required fields' ;
    }
}

export default validateExpense;