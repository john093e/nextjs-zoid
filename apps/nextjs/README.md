# NextJs Zoid

> [!NOTE]
>
> I don't have the pretention to say that this is the way to do it. Far from that...
> Actually this could be a bad integration, but it works and since I never receive any reply or help and still see people interested in using Zoid with NextJs here is a starting point


> [!NOTE]
> 
> You want to share your experience with NextJs and Zoid, please open a PR <3

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).
It integrate [Zoid](https://github.com/krakenjs/zoid) with the help of [Rollup](rollupjs.org/). 


## 1. What's in?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Zoid](https://trpc.io)
- [Rollup](https://rollupjs.org)


### 2. Embbed the Zoid component
Embed into any vanilla Html page one of the following Zoid test component :
#### a. "MyZoidComponent" :
A simple Hello World Iframe.
```html
    <script src="http://localhost:3000/api/widgets/my-zoid-component" id="widget-id"></script>
    <div id="zoid-container"></div>
    <script>
        MyZoidComponent({
          name: 'Your Name'
      }).render('#zoid-container');
    </script>
```
#### b. "Button" :
A simple Button.
```html
    <script src="http://localhost:3000/api/widgets/button" id="widget-id"></script>
    <div id="zoid-container"></div>
    <script>
        MyZoidComponent({
          name: 'Your Name'
      }).render('#zoid-container');
    </script>
```
> [!NOTE]
> Change `localhost:3000` with your registred domain on production


## Required Files
- **rollup.config.mjs** : 
To bundle each zoid component with its dependencies and generate the \[filename\].js

- **tsconfig.rollup.json** :
Typescript configuratioon specific to the bundlling process

- **src/types/zoid.d.ts** :
An ugly but working typing of zoid and some other libarry from the @krakenJs suite

- **components/zoid/*.ts** :
Folder to place the Zoid components, for now the RollupJs config expect to find a zoid components per .ts, so eah zoid omponoent should be .ts and everything in on file. 
- app/api/widgets/[component]/route
- a page with Zoid integrated :
  - example 1: app/zoid-button/page.tsx
  - example 2: app/zoid-child/page.tsx
- autogeneated from rollup but requied to work dist/\[name-of-the-zoid-component\].js
- .env containing `ZOID_FRAME_ONLY`

### Requied dependecies
```bash
zoid
```

### Requied dev dependecies
```bash
rollup @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-typescript @rollup/plugin-terser @rollup/plugin-replace
```

## Useful Links : 
- [Zoid](https://github.com/krakenjs/zoid)
- [Zoid docs](https://github.com/krakenjs/zoid/tree/main/docs)
- [Zoid Demo](https://github.com/krakenjs/zoid-demo/tree/main)
- [#Semoal - HOC WithZoid](https://gist.github.com/semoal/9ff2ac000040062d71ee6add04141dc1)
- [Paypal - Checkout Component](https://github.com/paypal/paypal-checkout-components/blob/main/docs/implement-checkout.md)