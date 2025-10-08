import validator from 'validator'

export const checkIfAmountIsValid = (amount) =>
    validator.isCurrency(amount.toString(), {
        allow_negatives: false,
        digits_after_decimal: [2],
        decimal_separator: '.',
    })

export const checkIfTypeIsValid = (type) => {
    return ['EARNING', 'EXPENSE', 'INVESTIMENT'].includes(type)
}
