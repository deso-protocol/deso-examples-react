# Deso Examples React

This is a simple [Create React
App](https://create-react-app.dev/docs/getting-started) project. **⚠ ️Since these examples were created,
the Create React App project has been deprecated and is no longer maintained. ⚠️**

For learning and experimenting, these examples are still fine to use. For a production application, however, we recommend porting these examples to a another framework or build tool. You can see a list of officially recommended react frameworks here:
https://react.dev/learn/start-a-new-react-project

The [deso-protocol](https://www.npmjs.com/package/deso-protocol) library itself is framework agnostic, so you can install and use it in any non-react context as well, even a simple vanilla javascript application.


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
docs for your preferred tool (Vite, Nextjs, Remix, Angular, Vue,
etc). If you're not sure, You can see a list of officially recommended react frameworks here:
https://react.dev/learn/start-a-new-react-project

Next install the [DeSo protocol library](https://www.npmjs.com/package/deso-protocol) using your preferred
package manager:

```sh
# npm
npm i deso-protocol

# yarn
yarn add deso-protocol
```

Finally, use the examples found in this repo to help you build social features
for your application using the [DeSo blockchain](https://deso.com)

There are lots of comments throughout the code, but if anything is unclear, please open an issue!

## Examples

- [Configuration](./src/routes/root.jsx#L12)
- [Login](./src/components/nav.jsx#L27)
- [Logout](./src/components/nav.jsx#L31)
- Identity State
  1. [Instantiate the identity state provider](./src/index.js#L36)
  6. [Use state from identity anywhere](./src/components/nav.jsx#L8)
  7. [React to changes in your code](./src/components/nav.jsx#L16)
- [Check permissions](./src/routes/sign-and-submit-tx.jsx#L42)
- [Request permissions](./src/routes/sign-and-submit-tx.jsx#L50)
- [Create, sign, submit a transaction](./src/routes/sign-and-submit-tx.jsx#L61)
