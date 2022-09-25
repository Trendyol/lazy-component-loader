import React from "react";

export interface ILazyLoadComponentsProps {
  placeholder: React.Component | string;
  children: React.Component;
  force?: boolean;
  ratio?: number;
  onVisible?: Function;
}
