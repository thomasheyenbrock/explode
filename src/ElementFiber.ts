import { ComponentFiber } from "./ComponentFiber";
import { ExplodeElement } from "./ExplodeElement";
import { RootFiber } from "./RootFiber";

export class ElementFiber {
  type: string;
  child: ElementFiber | ComponentFiber | null;
  sibling: ElementFiber | ComponentFiber | null;
  return: ElementFiber | ComponentFiber | RootFiber;
  elements: ExplodeElement[];

  constructor(type: string, parent: ElementFiber | ComponentFiber | RootFiber) {
    this.type = type;
    this.child = null;
    this.sibling = null;
    this.return = parent;
    this.elements = [];
  }
}
