# Event Manager TypeScript
### 简体中文 | [English](./README.md)

## 🎉 一个现代化TypeScript事件管理器、易用、轻量、充满幸福。

### 🔒 类型安全
享受从事件定义到使用的全程类型提示和校验, 告别运行时错误。

### 🧩 零依赖
轻量级, 无任何外部依赖, 可以轻松集成到任何项目中。

### 💖 幸福感
每一个 API 设计都致力于带来易用、人性化的开发体验。

## 📦 安装
```bash
npm install event-manager-typescript

yarn add event-manager-typescript

pnpm add event-manager-typescript
```

## 🚀 快速开始
```typescript
import { EventManager } from "event-manager-typescript";

// 定义事件类型 强烈推荐, 既可严格EVENT_TYPE.XXX, 又可以 "xxx" 字面量使用, 底层/业务 都可用, 特别重构时非常有用
const EVENT_TYPE = {
    Work: "work",
    Sleep: "sleep",
} as const;
type EVENT_TYPE = typeof EVENT_TYPE[keyof typeof EVENT_TYPE];

// 定义事件类型映射
interface EVENT_TYPE_MAP {
    [EVENT_TYPE.Work]: (name: string, time: number) => void;
    [EVENT_TYPE.Sleep]: (name: string, time: number) => void;
}

// 字面量事件类型映射 (不推荐, 但可选)
// interface EVENT_TYPE_MAP {
//     "work": (name: string, time: number) => void;
//     "sleep": (name: string, time: number) => void;
// }

// 创建事件管理器
const eventManager = new EventManager<EVENT_TYPE_MAP>();

// 获取指定事件类型的所有事件节点
const workNodes = eventManager.getEventNodes(EVENT_TYPE.Work);
const sleepNodes = eventManager.getEventNodes(EVENT_TYPE.Sleep);
```

## 🎧 监听事件
```typescript
// 无上下文目标
const onWork = (name: string, time: number)  => {
    console.log(`${name} 开始工作, 耗时 ${time} 分钟.`);
};
eventManager.on(EVENT_TYPE.Work, onWork);

// 有上下文目标
const target = {};
eventManager.on(EVENT_TYPE.Work, onWork, target);

// 返回注销函数和事件id
const [offSleep, sleepId] = eventManager.on(EVENT_TYPE.Sleep, (name, time) => {
    console.log(`${name} 开始休眠, 耗时 ${time} 分钟.`);
});
```
* 参数类型提示
![alt text](image-1.png)
* 字面量事件类型提示
![alt text](image-4.png)

## 🚫 注销事件
```typescript
// 通过绑定的监听器和上下文目标进行注销
eventManager.off(EVENT_TYPE.Work, onWork);
eventManager.off(EVENT_TYPE.Work, onWork, target);

// 通过返回的注销函数进行注销
offSleep();

// 通过返回的事件id进行注销
eventManager.off(sleepId);

// 注销指定事件类型的所有事件
eventManager.offAll(EVENT_TYPE.Work);
eventManager.offAll(EVENT_TYPE.Sleep);

// 注销所有事件
eventManager.offAll();
```
* 参数类型提示
![alt text](image-2.png)
* 字面量事件类型提示
![alt text](image-3.png)

## 🚀 发射事件
```typescript
eventManager.emit(EVENT_TYPE.Work, "Alice", 30);
eventManager.emit(EVENT_TYPE.Sleep, "Bob", 15);
```
* 参数类型提示
![alt text](image.png)
* 字面量事件类型提示
![alt text](image-5.png)

## 🧩 生成事件信息
```typescript
const info = eventManager.generateInfo();
console.log(info);
```

## 🛠️开发

### 依赖

- **[TypeScript](https://www.typescriptlang.org/)**: TypeScript 是一种强类型编程语言，基于 JavaScript 构建，能在任何规模下提供更好的工具。
- **[tsdown](https://tsdown.dev/)**: 优雅的库打包工具
- **[nodemon](https://nodemon.io/)**: 监控源代码的任何变化并自动重启服务器。

### 安装依赖

```bash
npm install
```

### 开发

```bash
npm run dev
```

### 构建
```bash
npm run build
```