import { ROOT_FIBER_TYPE } from "./constants";
import { ElementFiber } from "./ElementFiber";
import { ComponentFiber } from "./ComponentFiber";
import { ExplodeElement } from "./ExplodeElement";

export class RootFiber {
  domNode: HTMLElement;
  type: typeof ROOT_FIBER_TYPE;
  child: ElementFiber | ComponentFiber | null;
  sibling: ElementFiber | ComponentFiber | null;
  elements: ExplodeElement[];

  constructor(domNode: HTMLElement) {
    this.domNode = domNode;
    this.type = ROOT_FIBER_TYPE;
    this.child = null;
    this.sibling = null;
    this.elements = [];
  }
}
