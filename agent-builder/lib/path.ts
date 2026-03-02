// ─────────────────────────────────────────────────────────────────────────────
// Path Utilities — get/set values by dot-notation valuePath
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Get a nested value from an object by dot-notation path.
 * @example getByPath({ a: { b: 1 } }, "a.b") // → 1
 */
export function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current == null || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, obj);
}

/**
 * Return a new object with a nested value set at dot-notation path (immutable).
 * @example setByPath({ a: { b: 1 } }, "a.b", 2) // → { a: { b: 2 } }
 */
export function setByPath(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const keys = path.split(".");
  const result = { ...obj };
  let cursor: Record<string, unknown> = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    cursor[key] =
      cursor[key] != null && typeof cursor[key] === "object"
        ? { ...(cursor[key] as Record<string, unknown>) }
        : {};
    cursor = cursor[key] as Record<string, unknown>;
  }

  cursor[keys[keys.length - 1]] = value;
  return result;
}
