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

async function demoGet() {
  // get helper intellisense, try changing the path, it should offer autocompletion!
  const value = await get(demoObjectSimple, "nestedObject.numberValue");

  console.log(value, value === 456);
}

async function demoInferredValueProvider() {
  // the value provider can infer the types
  const vp = defineValueProvider(demoObjectSimple);
  const value = await vp.get("nestedObject.numberValue");
  console.log(value, value === 456);
}

async function demoValueProvider() {
  const demoValueProvider = {
    asyncString: async () => "Async String Value",
    deep: {
      deeper: {
        deepest: {
          hello: async () => "Async String Value",
        },
      },
    },
  };

  const vp = defineValueProvider(demoValueProvider);
  const value = await vp.get("deep.deeper.deepest.hello");

  console.log(value, value === "Async String Value");
}

// works with type inference now - just leaving this for reference
// async function demoValueProviderWithInterface() {
//   const demoValueProvider = {
//     asyncString: async () => "Async String Value",
//     deep: {
//       deeper: {
//         deepest: {},
//       },
//     },
//   };
//   // we are passing in an interface of the object shape and a provider that can provide these directly, via a function or an async function
//   interface DemoValueProvider {
//     asyncString: string;
//     deep: {
//       deeper: {
//         deepest: {};
//       };
//     };
//   }
//   const vp1 = defineValueProvider<DemoValueProvider>(demoValueProvider);
//   const value1 = await vp1.get("asyncString");
//   console.log(value1, value1 === "Async String Value");
// }

(async () => {
  await demoGet();
  await demoInferredValueProvider();
  await demoValueProvider();
})();
