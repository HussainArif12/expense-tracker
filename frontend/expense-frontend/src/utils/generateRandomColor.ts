// taken from https://medium.com/@nechemetu/generating-random-hex-colors-in-react-3df1bf7feb3e

function randomColorUtility(length: number) {
  return Math.floor(Math.random() * length)
}

export function hexy() {
  const hex = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F']
  let hexColor = '#'
  for (let i = 0; i < 6; i++) {
    hexColor += hex[randomColorUtility(hex.length)]
  }
  return hexColor
}
