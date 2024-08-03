# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Zoid](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.





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

## Getting Started

### 1. First, set your env file
- Copy `.env.example` at the same place
- Rename the copy to `.env`

### 2.  run the development server:

```bash
# First install the depedencies
npm install
# Then start Next.js dev server, Under the hood it will build bundle and watch Zoid components
npm run dev
```

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

### 3. Run the Page
Run your page under localhost or registred domain

### 4. 

Open [http://localhost:3000](http://localhost:3000) with your browser to see the usual HelloWold page.

## Terminal Command

```bash
# Build and watch Zoid components, then start Next.js dev server
npm run dev
# Build Zoid components and then Next.js for production
npm run build
# Build Zoid components on demand
npm run build:zoid
```

## Required Files
- tsconfig.rollup.json
- rollup.config.mjs
- src/types/zoid.d.ts
- components/zoid/*.ts
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