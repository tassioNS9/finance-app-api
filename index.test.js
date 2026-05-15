const sum = (a, b) => a + b

describe('sum function', () => {
    it('adds 1 + 2 to equal 3', () => {
        // arrange
        const a = 2
        const b = 1
        // act
        const result = sum(a, b)
        // assert
        expect(result).toBe(3)
    })

    it('should not return null or undefined', () => {
        // arrange
        const a = 2
        const b = 1
        // act
        const result = sum(a, b)
        // assert
        expect(result).not.toBeNull()
        expect(result).not.toBeUndefined()
    })
})
