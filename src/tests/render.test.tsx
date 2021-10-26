/**
 * @jsx createElement
 */

import warning from "warning";
import { createElement } from "../createElement";
import { render } from "../render";
import { FunctionComponent } from "../types";

jest.mock("warning");

describe("render", () => {
  let container: HTMLDivElement;
  let root: { [key: string]: any };
  beforeEach(() => {
    (warning as jest.Mock).mockClear();
    container = document.createElement("div");
    root = {
      type: "ROOT_FIBER_TYPE",
      child: null,
      sibling: null,
      return: null
    };
  });
  describe("when there is no element", () => {
    it("should throw an error", () => {
      // @ts-ignore: Second argument is missing
      expect(() => render()).toThrowError(
        "You called `render` but passed no element that should be rendered."
      );
    });
  });
  describe("when there is no DOM node", () => {
    it("should throw an error", () => {
      // @ts-ignore: No argument passed to render
      expect(() => render(<div />)).toThrowError(
        "You called `render` but passed no DOM node in which you want to render your Explode application."
      );
    });
  });
  describe("when the DOM node contains HTML which was not rendered by Explode", () => {
    it("should throw an error", () => {
      container.innerHTML = "<span>Some existing HTML</span>";
      expect(() => render(<div />, container)).toThrowError(
        "You called `render` with a DOM node that already contains HTML. You can only render your Explode application inside an empty container."
      );
    });
  });
  describe("rendering text", () => {
    beforeEach(() => {
      const text = {
        type: "TEXT_FIBER_TYPE",
        sibling: null,
        return: root,
        textContent: "Hello World!"
      };
      root.child = text;
    });
    it("should return the correct fiber tree", () => {
      render("Hello World", container);
      expect(container).toHaveProperty("__explode__root__", root);
    });
  });
  describe("rendering numbers", () => {
    beforeEach(() => {
      const text = {
        type: "TEXT_FIBER_TYPE",
        sibling: null,
        return: root,
        textContent: "42"
      };
      root.child = text;
    });
    it("should return the correct fiber tree", () => {
      render(42, container);
      expect(container).toHaveProperty("__explode__root__", root);
    });
  });
  describe("rendering booleans", () => {
    it("should not render anything", () => {
      render(true, container);
      expect(container).not.toHaveProperty("__explode__root__");
      render(false, container);
      expect(container).not.toHaveProperty("__explode__root__");
    });
  });
  describe("rendering objects", () => {
    it("should not render anything and print a warning", () => {
      render({ foo: "bar" }, container);
      expect(container).not.toHaveProperty("__explode__root__");
      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning).toHaveBeenCalledWith(
        false,
        "An object is not a valid child for another component or DOM element. It was therefore ignored."
      );
    });
  });
  describe("rendering functions", () => {
    it("should not render anything and print a warning", () => {
      function foo() {
        alert(1);
      }
      render(foo, container);
      expect(container).not.toHaveProperty("__explode__root__");
      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning).toHaveBeenCalledWith(
        false,
        "A function is not a valid child for another component or DOM element. It was therefore ignored."
      );
    });
  });
  describe("rendering objects", () => {
    it("should not render anything and print a warning", () => {
      render({ foo: "bar" }, container);
      expect(container).not.toHaveProperty("__explode__root__");
      expect(warning).toHaveBeenCalledTimes(1);
      expect(warning).toHaveBeenCalledWith(
        false,
        "An object is not a valid child for another component or DOM element. It was therefore ignored."
      );
    });
  });
  describe("rendering a single element", () => {
    beforeEach(() => {
      const h1: { [key: string]: any } = {
        type: "h1",
        child: null,
        sibling: null,
        return: root,
        element: null,
        props: { children: ["Hello World!"] }
      };
      const text = {
        type: "TEXT_FIBER_TYPE",
        sibling: null,
        return: h1,
        textContent: "Hello World!"
      };
      h1.child = text;
      root.child = h1;
    });
    it("should build the correct fiber tree", () => {
      const container = document.createElement("div");
      render(<h1>Hello World!</h1>, container);
      expect(container).toHaveProperty("__explode__root__", root);
    });
    describe("with an attribute", () => {
      it("should include the attribute in the props", () => {
        root.child.props.style = "color: red;";
        render(<h1 style="color: red;">Hello World!</h1>, container);
        expect(container).toHaveProperty("__explode_root__", root);
      });
    });
    describe("with text interpolation", () => {
      it("should render the correct fiber tree", () => {
        const what = "super";
        root.child.props.children = ["This is ", "super", " cool!"];
        const firstText: { [key: string]: any } = {
          type: "TEXT_FIBER_TYPE",
          sibling: null,
          return: root.child,
          textContent: "This is "
        };
        const secondText: { [key: string]: any } = {
          type: "TEXT_FIBER_TYPE",
          sibling: null,
          return: root.child,
          textContent: "super"
        };
        const thirdText: { [key: string]: any } = {
          type: "TEXT_FIBER_TYPE",
          sibling: null,
          return: root.child,
          textContent: " cool!"
        };
        firstText.sibling = secondText;
        secondText.sibling = thirdText;
        root.child.child = firstText;
        render(<h1>This is {what} cool!</h1>, container);
        expect(container).toHaveProperty("__explode__root__", root);
      });
    });
  });
  describe("rendering nested elements", () => {
    beforeEach(() => {
      const wrapper: { [key: string]: any } = {
        type: "h1",
        child: null,
        sibling: null,
        return: root,
        element: null,
        props: { children: expect.any(Array), class: "wrapper" }
      };
      const h1: { [key: string]: any } = {
        type: "h1",
        child: null,
        sibling: null,
        return: wrapper,
        element: null,
        props: { children: "Hello World!" }
      };
      const h1Text: { [key: string]: any } = {
        type: "TEXT_FIBER_TYPE",
        sibling: null,
        return: h1,
        textContent: "Hello World!"
      };
      const p: { [key: string]: any } = {
        type: "p",
        child: null,
        sibling: null,
        return: wrapper,
        element: null,
        props: { children: expect.any(Array) }
      };
      const pFirstText: { [key: string]: any } = {
        type: "TEXT_FIBER_TYPE",
        sibling: null,
        return: p,
        textContent: "Here is some "
      };
      const strong: { [key: string]: any } = {
        type: "string",
        child: null,
        sibling: null,
        return: p,
        element: null,
        props: { children: ["bold"] }
      };
      const strongText: { [key: string]: any } = {
        type: "TEXT_FIBER_TYPE",
        sibling: null,
        return: strong,
        textContent: "bold"
      };
      const pThirdText: { [key: string]: any } = {
        type: "TEXT_FIBER_TYPE",
        sibling: null,
        return: p,
        textContent: " text."
      };
      const footer: { [key: string]: any } = {
        type: "footer",
        child: null,
        sibling: null,
        return: wrapper,
        element: null,
        props: {}
      };
      wrapper.child = h1;
      h1.child = h1Text;
      h1.sibling = p;
      p.child = pFirstText;
      pFirstText.sibling = strong;
      strong.child = strongText;
      strong.sibling = pThirdText;
      p.sibling = footer;
    });
    it("should build the correct fiber tree", () => {
      render(
        <div class="wrapper">
          <h1>Hello World!</h1>
          <p>
            Here is some <strong>bold</strong> text.
          </p>
          <footer />
        </div>,
        container
      );
      expect(container).toHaveProperty("__explode__root__", root);
    });
  });
  const Button: FunctionComponent<{ color: string }> = ({
    children,
    color
  }) => <button style={`background-color: ${color};`}>{children}</button>;
  describe("rendering a single component", () => {
    it("should build the correct fiber tree", () => {
      const buttonComponent: { [key: string]: any } = {
        type: Button,
        child: null,
        sibling: null,
        return: root,
        element: null,
        props: { children: ["Click me!"], color: "blue" }
      };
      const button: { [key: string]: any } = {
        type: "button",
        child: null,
        sibling: null,
        return: buttonComponent,
        element: null,
        props: { children: ["Click me!"], style: "background-color: blue;" }
      };
      const buttonText: { [key: string]: any } = {
        type: "TEXT_FIBER_TYPE",
        sibling: null,
        return: button,
        textContent: "Click me!"
      };
      root.child = buttonComponent;
      buttonComponent.child = button;
      button.child = buttonText;
      render(<Button color="blue">Click me!</Button>, container);
      expect(container).toHaveProperty("__explode__root__", root);
    });
  });
  describe("rendering nested components", () => {
    it("should build the correct fiber tree", () => {
      const firstButtonComponent: { [key: string]: any } = {
        type: Button,
        child: null,
        sibling: null,
        return: root,
        element: null,
        props: { children: expect.any(Array), color: "blue" }
      };
      const firstButton: { [key: string]: any } = {
        type: "button",
        child: null,
        sibling: null,
        return: firstButtonComponent,
        element: null,
        props: { children: expect.any(Array), style: "background-color: blue;" }
      };
      const secondButtonComponent: { [key: string]: any } = {
        type: Button,
        child: null,
        sibling: null,
        return: firstButton,
        element: null,
        props: { children: ["Click me double!"], color: "red" }
      };
      const secondButton: { [key: string]: any } = {
        type: "button",
        child: null,
        sibling: null,
        return: secondButtonComponent,
        element: null,
        props: {
          children: ["Click me double!"],
          style: "background-color: red;"
        }
      };
      const text: { [key: string]: any } = {
        type: "TEXT_FIBER_TYPE",
        sibling: null,
        return: secondButton,
        textContent: "Click me double!"
      };
      root.child = firstButtonComponent;
      firstButtonComponent.child = firstButton;
      firstButton.child = secondButtonComponent;
      secondButtonComponent.child = secondButton;
      secondButton.child = text;
      render(
        <Button color="blue">
          <Button color="red">Click me double!</Button>
        </Button>,
        container
      );
      expect(container).toHaveProperty("__explode__root__", root);
    });
  });
  describe("rendering elements inside a component", () => {
    it("should build the correct fiber tree", () => {
      const buttonComponent: { [key: string]: any } = {
        type: Button,
        child: null,
        sibling: null,
        return: root,
        element: null,
        props: { children: expect.any(Array), color: "blue" }
      };
      const button: { [key: string]: any } = {
        type: "button",
        child: null,
        sibling: null,
        return: buttonComponent,
        element: null,
        props: { children: expect.any(Array), style: "background-color: blue;" }
      };
      const span1: { [key: string]: any } = {
        type: "span",
        child: null,
        sibling: null,
        return: button,
        element: null,
        props: { children: ["Click me!"] }
      };
      const text1: { [key: string]: any } = {
        type: "TEXT_FIBER_TYPE",
        sibling: null,
        return: span1,
        textContent: "Click me!"
      };
      const span2: { [key: string]: any } = {
        type: "span",
        child: null,
        sibling: null,
        return: button,
        element: null,
        props: { children: ["And again!"] }
      };
      const text2: { [key: string]: any } = {
        type: "TEXT_FIBER_TYPE",
        sibling: null,
        return: span2,
        textContent: "And again!"
      };
      root.child = buttonComponent;
      buttonComponent.child = button;
      button.child = span1;
      span1.child = text1;
      span1.sibling = span2;
      span2.child = text2;
      render(
        <Button color="blue">
          <span>Click me!</span>
          <span>And again!</span>
        </Button>,
        container
      );
      expect(container).toHaveProperty("__explode__root__", root);
    });
  });
  describe("rendering components inside an element", () => {
    it("should build the correct fiber tree", () => {
      const div: { [key: string]: any } = {
        type: "div",
        child: null,
        sibling: null,
        return: root,
        element: null,
        props: { children: expect.any(Array), class: "wrapper" }
      };
      const firstButtonComponent: { [key: string]: any } = {
        type: Button,
        child: null,
        sibling: null,
        return: div,
        element: null,
        props: { children: expect.any(Array), color: "blue" }
      };
      const firstButton: { [key: string]: any } = {
        type: "button",
        child: null,
        sibling: null,
        return: firstButtonComponent,
        element: null,
        props: { children: [], style: "background-color: blue;" }
      };
      const secondButtonComponent: { [key: string]: any } = {
        type: Button,
        child: null,
        sibling: null,
        return: div,
        element: null,
        props: { children: expect.any(Array), color: "red" }
      };
      const secondButton: { [key: string]: any } = {
        type: "button",
        child: null,
        sibling: null,
        return: secondButtonComponent,
        element: null,
        props: { children: [], style: "background-color: red;" }
      };
      root.child = div;
      div.child = firstButtonComponent;
      firstButtonComponent.child = firstButton;
      firstButtonComponent.sibling = secondButtonComponent;
      secondButtonComponent.child = secondButton;
      render(
        <div class="wrapper">
          <Button color="blue" />
          <Button color="red" />
        </div>,
        container
      );
      expect(container).toHaveProperty("__explode__root__", root);
    });
  });
});
