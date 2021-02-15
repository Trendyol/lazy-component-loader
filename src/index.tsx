/* eslint-disable jsx-a11y/alt-text */
import React, { useState, useRef, useEffect } from "react";
import { LazyLoadComponentsProps } from "./interface";
import PropTypes from "prop-types";

const LazyComponent = ({
  children,
  placeholder,
  ratio,
  force,
  onVisible,
}: LazyLoadComponentsProps): any => {
  if (!("IntersectionObserver" in window)) {
    return children;
  }

  useEffect(() => {
    handleObserve();
  }, []);

  const [currentComponent, setCurrentComponent] = useState(
    force ? children : placeholder
  );
  const el = useRef(null);

  const handleChange = ([root]: any) => {
    if (
      root.intersectionRatio > Number(ratio) &&
      root.isIntersecting === true
    ) {
      setCurrentComponent(children);
      observer.disconnect();
      if (onVisible) onVisible();
    }
  };

  const observer = new IntersectionObserver(handleChange, {
    threshold: ratio,
  });

  const handleObserve = () => {
    observer.observe(el.current as any);
  };
  return <div ref={el}>{currentComponent}</div>;
};

LazyComponent.defaultProps = {
  ratio: 0.1,
  force: false,
};

LazyComponent.propTypes = {
  children: PropTypes.element.isRequired,
  placeholder: PropTypes.element.isRequired,
  ratio: PropTypes.number,
  force: PropTypes.bool,
  onVisible: PropTypes.func,
};

export default LazyComponent;
