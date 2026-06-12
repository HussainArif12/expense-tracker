export const getTotalSum = (array: number[]) => {
  if (array.length) {
    return array.reduce((partialSum, current) => partialSum + current, 0)
  } else {
    return 0
  }
}
