// https://twitter.com/diegohaz/status/1309644466219819008
export type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ? K | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof any[]>>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never;

export type Path<T> = PathImpl<T, keyof T> | keyof T;

export type PathValue<
  T,
  P extends Path<T>
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;

// @ts-ignore
export function get<T, P extends Path<T>>(
  obj: T,
  path?: P,
  valueTransformer?: any
): PathValue<T, P>;

export async function get(object: any, path?: string, valueTransformer?: any) {
  const pathArray = path?.split(".");
  return await getPath(object, pathArray ?? [], valueTransformer);
}

async function getPath(object: any, path: string[], valueTransformer?: any) {
  if (!path.length) {
    return object;
  }

  const key = path.at(0)!;
  let value = object[key];

  if (valueTransformer) {
    value = await valueTransformer(value);
  }

  if (path.length === 1) {
    return value;
  }

  return getPath(value, path.slice(1), valueTransformer);
}

export * from "./valueProvider";
