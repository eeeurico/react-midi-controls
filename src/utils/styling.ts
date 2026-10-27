import type { CSSProperties } from "react"

// Join class names, skipping empty values
export const cx = (...classes: (string | false | null | undefined)[]) =>
  classes.filter(Boolean).join(" ")

// Root style carrying --rmc-value: the value's position in range, from 0 to 1
export const valueStyle = (
  value: number,
  range: [number, number],
  style?: CSSProperties
): CSSProperties => {
  const span = range[1] - range[0]
  const position =
    span === 0 ? 0 : Math.min(Math.max((value - range[0]) / span, 0), 1)
  return { ...style, "--rmc-value": position } as CSSProperties
}
