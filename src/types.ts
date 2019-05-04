import { ExplodeElement } from "./ExplodeElement";

export type ExplodeProps = {
  children: ExplodeElement[];
  [key: string]: any;
};

export type FunctionComponent = (
  props: object
) => ExplodeElement | ExplodeElement[];
