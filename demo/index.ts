import { defineValueProvider, get } from "../src";

const demoObjectSimple = {
  stringValue: "String Value",
  numberValue: 123,
  boolValue: false,
  arrayValue: ["Hello", "World"],
  nestedObject: {
    stringValue: "Nested String Value",
    numberValue: 456,
    boolValue: true,
    arrayValue: ["Nested", "Hello", "World"],
  },
};

interface DemoValueProvider {
  asyncString: string;
  deep: {
    deeper: {
      deepest: {};
    };
  };
}

const demoValueProvider = {
  asyncString: async () => "Async String Value",
  deep: {
    deeper: {
      deepest: {},
    },
  },
};

async function demo() {
  // get helper intellisense, try changing the path, it should offer autocompletion!
  const value = await get(demoObjectSimple, "nestedObject.numberValue");
  // type of value should be correctly inferred

  console.log(value === 456);

  // value providers
  const vp = defineValueProvider(demoObjectSimple);
  console.log((await vp.get("nestedObject.numberValue")) === 456);

  // we are passing in an interface of the object shape and a provider that can provide these directly, via a function or an async function
  const vp2 = defineValueProvider<DemoValueProvider>(demoValueProvider);

  console.log((await vp2.get("asyncString")) === "Async String Value");
}

demo();
