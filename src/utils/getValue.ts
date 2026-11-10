export function getValue(
  obj: Record<string, unknown>,
  path: string
): unknown {
  return path
    .split(".")
    .reduce(
      (current: any, key) => current?.[key],
      obj
    );
}           