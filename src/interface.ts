import React from "react";

export interface LazyLoadComponentsProps {
  placeholder: React.Component;
  children: React.Component;
  force?: boolean;
  ratio?: number;
  onVisible?: Function;
}
