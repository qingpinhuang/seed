# Seed

## 为什么创建此项目

1. 开发经验积累
2. 技术体验

### root

1. Monorepo: Lerna + pnpm
2. ESLint + Prettier

### packages

1. [snapshot](./packages/snapshot/)
   1. Test: karma + mocha + chai
2. [url](./packages/url/)
   1. Test: karma + jasmine
3. [utils](./packages/utils/)
   1. Test: jest
4. [validator](./packages/validator/)
   1. Test: jest

### projects

1. [react-nextjs](./projects/react-nextjs/)
   1. React + Next.js
   2. TypeScript
   3. ESLint
   4. Prettier
   5. Tailwindcss
   6. Lingui
   7. PAG
   8. GSAP

## 如何开始

### 安装依赖

```bash
pnpm install
```

### 执行测试

```bash
pnpm test
```
