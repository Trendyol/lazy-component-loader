# Lazy Load Components Package

This package helps you load components with IntersectionObserver.

| Statements                                                                  | Branches                                                                  | Functions                                                                  | Lines                                                                  |
| --------------------------------------------------------------------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| ![Statements](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Branches](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Functions](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) | ![Lines](https://img.shields.io/badge/Coverage-100%25-brightgreen.svg) |

## Installation

```
yarn install @trendyol/component-lazy-loader
```

## Usage

Example:

```js
import React from "react";
import LazyComponent from "@trendyol/component-lazy-loader";

function App() {
  let length = 100,
    i = 0,
    arr = Array(length);

  while (i < length) arr[i++] = i;
  return (
    <div>
      {arr.map((element, index) => {
        return (
          <LazyComponent
            placeholder={
              <div
                key={index}
                style={{
                  height: 100,
                  backgroundColor: "red",
                  marginBottom: 10,
                }}
              >
                Placeholder
              </div>
            }
            ratio={0.1}
          >
            <div
              key={index}
              style={{
                height: 100,
                backgroundColor: "lightblue",
                marginBottom: 10,
              }}
            >
              Test Component
            </div>
          </LazyComponent>
        );
      })}
    </div>
  );
}
```

## Options

```ts
export interface LazyLoadComponentsProps {
  placeholder: React.Component;
  children: React.Component;
  force?: boolean; // default false
  ratio?: number; // default 0.1
  onVisible?: Function;
}
```
