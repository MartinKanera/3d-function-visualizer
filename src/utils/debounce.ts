export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number,
) {
  let timeout: number | undefined;

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const context = this;

    clearTimeout(timeout);
    timeout = window.setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  } as T;
}
