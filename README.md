# Deso Examples React

This is a simple [Create React
App](https://create-react-app.dev/docs/getting-started) project, but these
examples can be easily ported to your preferred framework or build tool.

## How to run these examples locally

Run the following in your terminal

```sh
git clone https://github.com/deso-protocol/deso-examples-react.git
cd deso-examples-react
npm i
npm run start
```

## How to use this repo

If you want to port these examples to your own app, set up a project using the
docs for your preferred tool (Create React App, Vite, Nextjs, Remix, Angular, Vue,
etc). If you're not sure, Create React App is a reasonable choice for getting a
development environment up and running for quick prototyping/experimenting.

Next install the [DeSo identity
library](https://www.npmjs.com/package/@deso-core/identity) using your preferred
package manager:

```sh
# npm
npm i @deso-core/identity

# yarn
yarn add @deso-core/identity
```

Finally, use the examples found in this repo to help you build social features
for your application using the [DeSo blockchain](https://deso.com)

Also note, the emphasis here is own deomonstrating how to use the identity library, not UI/UX. The UI for this app is _ugly_. Do not copy it :)

## Questions

- What are all these _WARNINGS_ when I run my app?

```sh
WARNING in ./node_modules/@deso-core/identity/src/lib/types.js
Module Warning (from ./node_modules/source-map-loader/dist/cjs.js):
Failed to parse source map from '/Absolute/Path/deso-examples-react/libs/identity/src/lib/types.ts' file: Error: ENOENT: no such file or directory, open '/Absolute/Path/deso-examples-react/libs/identity/src/lib/types.ts'
```

This is a known issue with webpack and can be safely ignored. This issue may be resolved by the time you are reading this. See this issue for more context https://github.com/facebook/create-react-app/pull/11752

## Examples

- [Login](./src/components/Nav.js#L8)
  ```js
  identity.login();
  ```
- [Logout](./src/components/Nav.js#L9)
  ```js
  identity.logout();
  ```
- State Sync
  ```js
  identity.subscribe((state) => /* do whatever you want with the state here */);
  ```
  Code walk-through:
  1. [Create a react context](./src/contexts.js#L3)
  2. [Set up useState hook](./src/routes/root.jsx#L8)
  3. [Set up useEffect hook](./src/routes/root.jsx#11)
  4. [Subscribe to changes](./src/routes/root.jsx#L23)
  5. [use context](./src/components/nav.jsx#7)
  6. [React to changes](./src/components/nav.jsx#17)
