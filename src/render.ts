import { Brain } from "./Brain";
import { ExplodeElement } from "./ExplodeElement";

const brain = new Brain();

function getFiberRootFromDomNode(domNode: HTMLElement) {
  // @ts-ignore: Property does not exist on HTMLElement
  if (domNode.__explode__root__) return domNode.__explode__root__;
  const { root, index } = brain.createRootFiber(domNode);
  // @ts-ignore: Property does not exist on HTMLElement
  domNode.__explode__root__ = root;
  // @ts-ignore: Property does not exist on HTMLElement
  domNode.__explode__index__ = index;
  return root;
}

export function render(
  element: ExplodeElement | ExplodeElement[],
  domNode: HTMLElement
) {
  const fiberRoot = getFiberRootFromDomNode(domNode);
  brain.scheduleWork(fiberRoot, Array.isArray(element) ? element : [element]);
}
