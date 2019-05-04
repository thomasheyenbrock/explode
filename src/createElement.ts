import warning from "warning";
import { ExplodeElement } from "./ExplodeElement";
import { ExplodeProps, FunctionComponent } from "./types";

type JSXProps = {
  children?: ExplodeElement | ExplodeElement[];
  [key: string]: any;
};

function separateKeyFromProps(props: JSXProps | null) {
  if (!props || !("key" in props)) {
    return { key: null, propsWithoutKey: props || {} };
  }

  const { key, ...restProps } = props;
  const propsWithoutKey: JSXProps = restProps;

  let errorMessage: string | null = null;
  if (key === null) {
    errorMessage = "`null`";
  } else if (typeof key === "undefined") {
    errorMessage = "`undefined`";
  } else if (typeof key === "object") {
    errorMessage = "an object";
  } else if (typeof key === "function") {
    errorMessage = "a function";
  }

  warning(
    !errorMessage,
    `You tried to use ${errorMessage} as key for an element. Only strings and numbers are valid keys. Your key was ignored!`
  );

  if ((typeof key === "number" || typeof key === "string") && !errorMessage) {
    return { key, propsWithoutKey };
  }

  return { key: null, propsWithoutKey };
}

function getChildren(children: ExplodeElement[], props: JSXProps) {
  if (children.length > 0) return children;
  if (props.children) {
    return Array.isArray(props.children) ? props.children : [props.children];
  }
  return [];
}

function filterChildren(children: ExplodeElement[]) {
  let hasNoInvalidObjectChilds = true;
  const filteredChildren = children.filter(child => {
    const childIsObject =
      typeof child === "object" && !(child instanceof ExplodeElement);
    hasNoInvalidObjectChilds = !childIsObject;
    return !(
      typeof child === "boolean" ||
      childIsObject ||
      child === null ||
      child === undefined
    );
  });
  warning(
    hasNoInvalidObjectChilds,
    "An object is not a valid child for another component or DOM element. It was therefore ignored."
  );
  return filteredChildren;
}

export function createElement(
  type: string | FunctionComponent,
  props: JSXProps | null,
  ...children: ExplodeElement[]
) {
  const typeofType = typeof type;
  if (!["string", "function"].includes(typeofType)) {
    throw new Error(
      `Expected a string or a function as type for createElement, recieved ${typeofType}.`
    );
  }

  const { key, propsWithoutKey } = separateKeyFromProps(props);
  const propsWithChildren: ExplodeProps = {
    ...propsWithoutKey,
    children: filterChildren(getChildren(children, propsWithoutKey))
  };

  return new ExplodeElement(type, propsWithChildren, key);
}
