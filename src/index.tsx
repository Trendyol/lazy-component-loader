/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useRef, useEffect, RefObject } from "react";
import { ILazyLoadComponentsProps } from "./interface";

const LazyComponent = ({
  children,
  placeholder,
  ratio = 0.1,
  force = false,
  onVisible,
}: ILazyLoadComponentsProps): React.Component | JSX.Element => {
  if (!window || !("IntersectionObserver" in window)) {
    return children;
  }

  useEffect(() => {
    handleObserve();
  }, []);

  const [currentComponent, setCurrentComponent] = useState<React.Component | string>(
    force ? children : placeholder
  );
  const el: RefObject<HTMLDivElement> = useRef(null);

  const handleChange = ([root]: any) => {
    if (
      root.intersectionRatio > Number(ratio) &&
      root.isIntersecting
    ) {
      setCurrentComponent(children);
      observer.disconnect();
      onVisible?.();
    }
  };

  const observer = new IntersectionObserver(handleChange, {
    threshold: ratio,
  });

  const handleObserve = () => {
    observer.observe(el.current as Element);
  };
  return <div ref={el}>{currentComponent}</div>;
};

export default LazyComponent;
