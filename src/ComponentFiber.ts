import { ElementFiber } from "./ElementFiber";
import { ExplodeElement } from "./ExplodeElement";
import { RootFiber } from "./RootFiber";
import { FunctionComponent } from "./types";

export class ComponentFiber {
  type: FunctionComponent;
  child: ElementFiber | ComponentFiber | null;
  sibling: ElementFiber | ComponentFiber | null;
  return: ElementFiber | ComponentFiber | RootFiber;
  elements: ExplodeElement[];

  constructor(
    type: FunctionComponent,
    parent: ElementFiber | ComponentFiber | RootFiber
  ) {
    this.type = type;
    this.child = null;
    this.sibling = null;
    this.return = parent;
    this.elements = [];
  }
}
