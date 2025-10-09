import validator from 'validator'

export const checkIfAmountIsValid = (amount) => {
    if (typeof amount !== 'number') {
        return false
    }
    return validator.isCurrency(amount.toFixed(2), {
        allow_negatives: false,
        digits_after_decimal: [2],
        decimal_separator: '.',
    })
}
export const checkIfTypeIsValid = (type) => {
    return ['EARNING', 'EXPENSE', 'INVESTIMENT'].includes(type)
}

export const transactionNotFoundResponse = () => ({
    message: 'Transaction not found!',
})
