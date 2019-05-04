/**
 * @jsx createElement
 */

import warning from "warning";
import { createElement } from "../createElement";

jest.mock("warning");

describe("createElement", () => {
  beforeEach(() => {
    (warning as jest.Mock).mockClear();
  });
  it("should return the correct element type", () => {
    expect(<div />).toEqual({
      type: "div",
      props: { children: [] }
    });
  });
  describe("with a string as child", () => {
    it("should attach the string as element in the children array", () => {
      expect(<h1>Hello World</h1>).toEqual({
        type: "h1",
        props: { children: ["Hello World"] }
      });
    });
  });
  describe("with a number as child", () => {
    it("should attach the number as element in the children array", () => {
      expect(<h1>{42}</h1>).toEqual({
        type: "h1",
        props: { children: [42] }
      });
    });
  });
  describe("with a boolean as child", () => {
    it("should ignore the child", () => {
      expect(<h1>{true}</h1>).toEqual({
        type: "h1",
        props: { children: [] }
      });
      expect(<h1>{false}</h1>).toEqual({
        type: "h1",
        props: { children: [] }
      });
    });
  });
  describe("with an object as child", () => {
    it("should ignore the child and print a warning", () => {
      expect(<h1>{{ foo: "bar" }}</h1>).toEqual({
        type: "h1",
        props: { children: [] }
      });
      expect(warning).toHaveBeenCalledWith(
        false,
        "An object is not a valid child for another component or DOM element. It was therefore ignored."
      );
    });
  });
  describe("with `null` as child", () => {
    it("should ignore the child", () => {
      expect(<h1>{null}</h1>).toEqual({
        type: "h1",
        props: { children: [] }
      });
    });
  });
  describe("with a `undefined` as child", () => {
    it("should ignore the child", () => {
      expect(<h1>{undefined}</h1>).toEqual({
        type: "h1",
        props: { children: [] }
      });
    });
  });
  describe("with another dom element as single child", () => {
    it("should return another element as child", () => {
      expect(
        <button>
          <span>Click me</span>
        </button>
      ).toEqual({
        type: "button",
        props: {
          children: [{ type: "span", props: { children: ["Click me"] } }]
        }
      });
    });
  });
  describe("with a function as a child", () => {
    it("should attach the function to the children array", () => {
      const childFunction = () => alert("do something");
      expect(<div>{childFunction}</div>).toEqual({
        type: "div",
        props: { children: [childFunction] }
      });
    });
  });
  describe("with both valid and invalid children", () => {
    it("should ignore the invalid children but keep the valid ones", () => {
      expect(
        <div>
          <span>Some text</span>
          {null}
          More text
          {true}
          {{ foo: "bar" }}
          {42}
        </div>
      ).toEqual({
        type: "div",
        props: {
          children: [
            { type: "span", props: { children: ["Some text"] } },
            "More text",
            42
          ]
        }
      });
    });
  });
  describe("when the children are passed as prop", () => {
    it("should attach the children correctly", () => {
      expect(<button children="Click me" />).toEqual({
        type: "button",
        props: { children: ["Click me"] }
      });
    });
    describe("when the child is another react element", () => {
      it("should attach the children correctly", () => {
        expect(<button children={<span>Click me</span>} />).toEqual({
          type: "button",
          props: {
            children: [{ type: "span", props: { children: ["Click me"] } }]
          }
        });
      });
    });
  });
  describe("with multiple children", () => {
    it("should return an array with all children", () => {
      expect(
        <div>
          <h1>Hello World!</h1>
          <p>This is some text.</p>
          <button>Click here</button>
        </div>
      ).toEqual({
        type: "div",
        props: {
          children: [
            { type: "h1", props: { children: ["Hello World!"] } },
            { type: "p", props: { children: ["This is some text."] } },
            { type: "button", props: { children: ["Click here"] } }
          ]
        }
      });
    });
    describe("when the children are passed as prop", () => {
      it("should return an array with all children", () => {
        expect(
          <div
            children={[
              <h1>Hello World!</h1>,
              <p>This is some text.</p>,
              <button>Click here</button>
            ]}
          />
        ).toEqual({
          type: "div",
          props: {
            children: [
              { type: "h1", props: { children: ["Hello World!"] } },
              { type: "p", props: { children: ["This is some text."] } },
              { type: "button", props: { children: ["Click here"] } }
            ]
          }
        });
      });
    });
    describe("when the children are passed as prop and as jsx-childs", () => {
      it("should ignore the children prop", () => {
        expect(
          <div children={<button>Click me hard</button>}>
            <button>Click me harder</button>
          </div>
        ).toEqual({
          type: "div",
          props: {
            children: [
              { type: "button", props: { children: ["Click me harder"] } }
            ]
          }
        });
      });
    });
  });
  describe("with attributes", () => {
    it("should pass the attributes as children", () => {
      expect(<div class="some-class-name" />).toEqual({
        type: "div",
        props: { children: [], class: "some-class-name" }
      });
    });
    describe("when the attribute is used multiple times", () => {
      it("should use the last given attribute", () => {
        expect(
          <div
            class="some-class-name"
            style="display: block;"
            // @ts-ignore: Duplicate attribute name
            class="some-other-class-name"
          />
        ).toEqual({
          type: "div",
          props: {
            children: [],
            class: "some-other-class-name",
            style: "display: block;"
          }
        });
      });
    });
    describe("when the attribute is a number", () => {
      it("should add the number to the props array", () => {
        expect(<div attr={42} />).toEqual({
          type: "div",
          props: { children: [], attr: 42 }
        });
      });
    });
    describe("when the attribute is a boolean", () => {
      it("should add the attribute to the props array", () => {
        expect(<div attr={true} />).toEqual({
          type: "div",
          props: { children: [], attr: true }
        });
        expect(<div attr={false} />).toEqual({
          type: "div",
          props: { children: [], attr: false }
        });
      });
      describe("when the value of the attribute is omitted", () => {
        it("should add the attribute with a value of `true` to the props array", () => {
          expect(<div attr />).toEqual({
            type: "div",
            props: { children: [], attr: true }
          });
        });
      });
    });
    describe("when the attribute is an object", () => {
      it("should add the obejct to the props array", () => {
        expect(<div attr={{ foo: "bar" }} />).toEqual({
          type: "div",
          props: { children: [], attr: { foo: "bar" } }
        });
      });
    });
    describe("when the attribute is an array", () => {
      it("should add the array to the props array", () => {
        expect(<div attr={["foo", "bar", "baz"]} />).toEqual({
          type: "div",
          props: { children: [], attr: ["foo", "bar", "baz"] }
        });
      });
    });
    describe("when the attribute is `null`", () => {
      it("should add the attribute to the props array", () => {
        expect(<div attr={null} />).toEqual({
          type: "div",
          props: { children: [], attr: null }
        });
      });
    });
    describe("when the attribute is `undefined`", () => {
      it("should add the attribute to the props array", () => {
        expect(<div attr={undefined} />).toEqual({
          type: "div",
          props: { children: [], attr: undefined }
        });
      });
    });
    describe("when the attribute is a function", () => {
      it("should pass the function to the props object", () => {
        const handleClick = () => alert("clicked!");
        expect(<button onClick={handleClick} />).toEqual({
          type: "button",
          props: { children: [], onClick: handleClick }
        });
      });
    });
  });
  describe("interpolation", () => {
    describe("inside of the children", () => {
      it("should inject the variable as child", () => {
        const text = "Thomas";
        expect(<div>My name is {text}.</div>).toEqual({
          type: "div",
          props: { children: ["My name is ", text, "."] }
        });
      });
    });
    describe("inside of an attribute", () => {
      it("should attach the correct prop", () => {
        const index = 0;
        expect(<div id={`row-${index}`} />).toEqual({
          type: "div",
          props: { children: [], id: `row-${index}` }
        });
      });
    });
    describe("spreading objects", () => {
      const props = { class: "some-class-name", style: "display: block;" };
      it("should attach all key-value-pairs as props", () => {
        expect(<div {...props} />).toEqual({
          type: "div",
          props: { children: [], ...props }
        });
      });
      describe("when a prop is used multiple times", () => {
        it("should use the last given value", () => {
          expect(<div {...props} class="some-other-class-name" />).toEqual({
            type: "div",
            props: {
              children: [],
              ...props,
              class: "some-other-class-name"
            }
          });
          expect(<div class="some-other-class-name" {...props} />).toEqual({
            type: "div",
            props: { children: [], ...props }
          });
        });
      });
    });
  });
  describe("with a key prop", () => {
    it("should add the key directly to the element instead of the props object", () => {
      expect(<div key="some key" />).toEqual({
        type: "div",
        props: { children: [] },
        key: "some key"
      });
    });
    it("should allow a number as key", () => {
      expect(<div key={0} />).toEqual({
        type: "div",
        props: { children: [] },
        key: 0
      });
    });
    it("should ignore a function as key and print a warning", () => {
      expect(<div key={function foo() {}} />).toEqual({
        type: "div",
        props: { children: [] }
      });
      expect(warning).toHaveBeenCalledWith(
        false,
        "You tried to use a function as key for an element. Only strings and numbers are valid keys. Your key was ignored!"
      );
    });
    it("should ignore an object as key and print a warning", () => {
      expect(<div key={{ foo: "bar" }} />).toEqual({
        type: "div",
        props: { children: [] }
      });
      expect(warning).toHaveBeenCalledWith(
        false,
        "You tried to use an object as key for an element. Only strings and numbers are valid keys. Your key was ignored!"
      );
    });
    it("should ignore `null` as key and print a warning", () => {
      expect(<div key={null} />).toEqual({
        type: "div",
        props: { children: [] }
      });
      expect(warning).toHaveBeenCalledWith(
        false,
        "You tried to use `null` as key for an element. Only strings and numbers are valid keys. Your key was ignored!"
      );
    });
    it("should ignore `undefined` as key and print a warning", () => {
      expect(<div key={undefined} />).toEqual({
        type: "div",
        props: { children: [] }
      });
      expect(warning).toHaveBeenCalledWith(
        false,
        "You tried to use `undefined` as key for an element. Only strings and numbers are valid keys. Your key was ignored!"
      );
    });
    describe("when spreading the key", () => {
      it("should add the key correctly", () => {
        const props = { key: "some key" };
        expect(<div {...props} />).toEqual({
          type: "div",
          props: { children: [] },
          key: "some key"
        });
      });
    });
  });
  describe("custom components", () => {
    const Button = ({ color = "blue", children = "" }) => (
      <button style={`color: ${color};`}>{children}</button>
    );
    it("should use the component as type", () => {
      expect(<Button />).toEqual({ type: Button, props: { children: [] } });
    });
    it("should pass the children", () => {
      expect(<Button>Click me</Button>).toEqual({
        type: Button,
        props: { children: ["Click me"] }
      });
    });
    it("should pass the attributes", () => {
      expect(<Button color="red" />).toEqual({
        type: Button,
        props: { children: [], color: "red" }
      });
    });
  });
});
