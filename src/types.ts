import { ExplodeElement } from "./ExplodeElement";
import { RootFiber } from "./RootFiber";
import { ElementFiber } from "./ElementFiber";
import { ComponentFiber } from "./ComponentFiber";

export type ExplodeProps = {
  children: ExplodeElement[];
  [key: string]: any;
};

export type Fiber = RootFiber | ElementFiber | ComponentFiber;

export type FunctionComponent<Props = {}> = (
  props: Props & { children?: ExplodeElement | ExplodeElement[] }
) => ExplodeElement | ExplodeElement[];
