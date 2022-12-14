# Typed Value Provider

[![Test](https://github.com/rigor789/typed-value-provider/actions/workflows/test.yml/badge.svg)](https://github.com/rigor789/typed-value-provider/actions/workflows/test.yml)

This is a proof of concept for 2 utils, the base util is a typed `get` function that provides TypeScript intellisense for dot notation access, the second one bulding on top of the `get` function that combines the dot notation access with a "Value Provider".

A Value Provider can be a direct value (ie. `someValue: 42`), a function that returns the value (ie. `someValue: () => 42`) or a function that returns a Promise/async function (ie. `someValue: async () => 42`).

Definining a Value Provider returns a `get` function that accepts a dot notated path and returns the resolved value at a given path. In case a resolved value contains inner value providers, they are automatically unwrapped.

## Demo

https://user-images.githubusercontent.com/879060/203845216-569a91d1-cbe4-46bd-a674-e6d406034347.mov

## API

### get

```ts
import { get } from "@rigor789/typed-value-provider";

get(object: any, path: string);
```

### value provider

```ts
import { defineValueProvider } from "@rigor789/typed-value-provider";

defineValueProvider<{
  someValue: string
}>({
  someValue: async () => await getSomeValue();
})
```



