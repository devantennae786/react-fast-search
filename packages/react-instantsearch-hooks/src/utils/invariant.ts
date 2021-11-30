/**
 * Throws an error if the condition is not met in development mode.
 * This is used to make development a better experience to provide guidance as
 * to where the error comes from.
 */
export function invariant(
  condition: boolean,
  message: string | (() => string)
) {
  if (condition) {
    return;
  }

  if (!__DEV__) {
    throw new Error('Invariant failed');
  }

  if (__DEV__) {
    throw new Error(
      `[InstantSearch] ${typeof message === 'function' ? message() : message}`
    );
  }
}
