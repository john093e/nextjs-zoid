# NextJs Zoid

> [!NOTE]
>
> I don't have the pretention to say that this is the way to do it. Far from that...
> Actually this could be a bad integration, but it works and since I never receive any reply or help and still see people interested in using Zoid with NextJs here is a starting point


> [!NOTE]
> 
> You want to share your experience with NextJs and Zoid, please open a PR <3


## Demo 
Visit the following third party website [third-party-nextjs-zoid.vercel.app](https://third-part-nextjs-zoid.vercel.app/) links to see zoid in action 
1. Extemely Basic integration [Button](https://third-part-nextjs-zoid.vercel.app/test-button.html)


2. Some features tested [Advanced](https://third-part-nextjs-zoid.vercel.app/test-advanced.html)

> [!NOTE]
> Each Zoiid Ifame comes from the following [NextJs 14](https://nextjs-zoid.vercel.app/) app

## About this repo
This repo is based on the starter [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo)
It uses [Turborepo](https://turborepo.org) and contains:

```text
.github
  └─ workflows
        └─ CI with pnpm cache setup
.vscode
  └─ Recommended extensions and settings for VSCode users
apps
  ├─ nextjs
  |   ├─ Next.js 14
  |   ├─ React 18
  |   ├─ Tailwind CSS
  |   ├─ Zoid
  |   └─ RollupJs
  └─ third-party-website
      ├─ Next.js 14
      ├─ React 18
      ├─ Tailwind CSS
      └─ Vanilla HTML
packages
  └─ ui
      └─ Start of a UI package for the webapp using shadcn-ui
tooling
  ├─ eslint
  |   └─ shared, fine-grained, eslint presets
  ├─ prettier
  |   └─ shared prettier configuration
  ├─ tailwind
  |   └─ shared tailwind configuration
  └─ typescript
      └─ shared tsconfig you can extend from
```

> In this template, we use `@acme` as a placeholder for package names. As a user, you might want to replace it with your own organization or project name. You can use find-and-replace to change all the instances of `@acme` to something like `@my-company` or `@project-name`.

## Quick Start
To get it running in local, follow the steps below:

### 1. Setup dependencies

```bash
# Install dependencies
pnpm i

# Configure environment variables
# There is an `.env.example` in the root directory you can use for reference
cp .env.example .env
```

### 2. Run the TurboRepo

```bash
# Run the TuboRepo project
turbo run dev
```

### 3. Visit one of the following example

- Extremly basic example : http://localhost:3001/test-button.html
- Advanced example : http://localhost:3001/advanced-zoid.html


## Useful Links : 
- [Zoid](https://github.com/krakenjs/zoid)
- [Zoid docs](https://github.com/krakenjs/zoid/tree/main/docs)
- [Zoid Demo](https://github.com/krakenjs/zoid-demo/tree/main)
- [#Semoal - HOC WithZoid](https://gist.github.com/semoal/9ff2ac000040062d71ee6add04141dc1)
- [Paypal - Checkout Component](https://github.com/paypal/paypal-checkout-components/blob/main/docs/implement-checkout.md)


## References

The stack originates from [create-t3-app](https://github.com/t3-oss/create-t3-app).