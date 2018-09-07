export function safe(expression: () => any, defaultValue: any = null) {
  try {
    return expression();
  } catch (e) {
    return defaultValue;
  }
}
