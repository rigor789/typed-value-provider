import { get, Path, PathValue } from ".";

type ValueOrPromiseOrFunction<T> = T | (() => Promise<T>) | (() => T);
type PrimitiveValue = string | number | boolean;

type ObjectValueProvider<T> = T extends PrimitiveValue
  ? never
  : ValueOrPromiseOrFunction<{
      [K in keyof T]: ValueProvider<T[K]>;
    }>;

type ValueProvider<T> = T extends PrimitiveValue
  ? ValueOrPromiseOrFunction<T>
  : ObjectValueProvider<T>;

type Unwrap<T> = T extends ValueOrPromiseOrFunction<infer K> ? K : T;

interface ValueP<T> {
  get<P extends Path<T>>(path?: P): Promise<Unwrap<PathValue<T, P>>>;
}

async function getValue<T>(provider: ValueProvider<T>): Promise<T> {
  if (typeof provider === "function") {
    return getValue(await (provider as any)());
  }

  return provider as T;
}

async function unwrap(value) {
  value = await getValue(value);

  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "object") {
    const unwrapped: any = {};
    for (const key of Object.keys(value)) {
      unwrapped[key] = await unwrap(value[key]);
    }

    return unwrapped;
  }

  return await getValue(value);
}

export function defineValueProvider<T>(provider: ValueProvider<T>): ValueP<T> {
  return {
    async get(path) {
      const root: T = await getValue(provider);

      const value = await get(root, path, async (value: any) => {
        return await getValue(value);
      });

      return unwrap(value);
    },
  };
}
