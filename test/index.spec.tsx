import React from "react";
import { render } from "@testing-library/react";
import LazyComponent from "../src/index";
import { LazyLoadComponentsProps } from "../src/interface";
import sinon, { SinonSpy, SinonStub } from "sinon";
import { act } from "react-dom/test-utils";

const sandbox = sinon.createSandbox();

const createMockDiv = (testName: string): any => {
  return <div data-testid={testName} className={testName} />;
};
export const propsFactory = (override = {}) => ({
  placeholder: createMockDiv("placeholder"),
  children: createMockDiv("children"),
  ratio: 0.1,
  force: false,
  onVisible: sandbox.stub(),
  ...override,
});

describe("Lazy Component tests", () => {
  let props: LazyLoadComponentsProps;

  let observeStub: SinonSpy;
  let unobserveStub: SinonSpy;
  let disconnectStub: SinonSpy;

  beforeEach(() => {
    props = propsFactory();
  });

  describe("Not support intersectionObserver environment", () => {
    let windowCurrent: any;
    beforeEach(() => {
      windowCurrent = window;
      window = {} as any;
    });
    afterEach(() => {
      window = windowCurrent;
    });
    it("should return children without lazy loading", () => {
      // Act
      const { container } = render(<LazyComponent {...props} />);

      // Assert
      expect(container.getElementsByClassName("children")).toHaveLength(1);
    });
  });

  describe("IntersectionObserver supported environment", () => {
    let intersectionObserver: any;
    beforeEach(() => {
      intersectionObserver = window.IntersectionObserver;
      observeStub = sandbox.spy();
      unobserveStub = sandbox.spy();
      disconnectStub = sandbox.spy();

      (window.IntersectionObserver as any) = sandbox.spy(() => ({
        observe: observeStub,
        unobserve: unobserveStub,
        disconnect: disconnectStub,
      }));
    });

    afterEach(() => {
      sandbox.verifyAndRestore();
      window.IntersectionObserver = intersectionObserver;
    });

    describe("force prop is true", () => {
      beforeEach(() => {
        props = propsFactory({ force: true });
      });

      it("should render children when force is true", () => {
        // Act
        const { container } = render(<LazyComponent {...props} />);

        // Assert
        expect(container.getElementsByClassName("children")).toHaveLength(1);
      });
    });

    describe("force prop is false", () => {
      it("should render placeholder when force is false", () => {
        // Act
        const { container } = render(<LazyComponent {...props} />);

        // Assert
        expect(container.getElementsByClassName("placeholder")).toHaveLength(1);
        expect(observeStub.calledOnce).toBe(true);
      });

      it("should show children on observer intersectionRatio bigger than props.ratio", () => {
        // Arrange
        const intersectionObeserverSpy = (window.IntersectionObserver as unknown) as SinonSpy;
        // Act
        const { container } = render(<LazyComponent {...props} />);

        act(() => {
          intersectionObeserverSpy.getCalls()[0].args[0]([
            {
              intersectionRatio: props.ratio! + 0.1,
              isIntersecting: true,
            },
          ]);
        });

        // Assert
        expect(container.getElementsByClassName("children")).toHaveLength(1);
        expect(disconnectStub.calledOnce).toBe(true);
        expect((props.onVisible as SinonStub).calledOnce).toBe(true);
      });

      it("should show placeholder on observer intersectionRatio smaller than props.ratio", () => {
        // Arrange
        const intersectionObeserverSpy = (window.IntersectionObserver as unknown) as SinonSpy;
        props.onVisible = sandbox.stub();
        // Act
        const { container } = render(<LazyComponent {...props} />);

        act(() => {
          intersectionObeserverSpy.getCalls()[0].args[0]([
            {
              intersectionRatio: props.ratio! - 0.1,
              isIntersecting: true,
            },
          ]);
        });

        // Assert
        expect(container.getElementsByClassName("placeholder")).toHaveLength(1);
        expect(disconnectStub.calledOnce).toBe(false);
        expect((props.onVisible as SinonStub).calledOnce).toBe(false);
      });
    });
    describe("onVisible prop is undefined", () => {
      beforeEach(() => {
        props = {
          placeholder: createMockDiv("placeholder"),
          children: createMockDiv("children"),
          ratio: 0.1,
          force: false,
        };
      });
      it("should not call when onvisible prop", () => {
        // Arrange
        const intersectionObeserverSpy = (window.IntersectionObserver as unknown) as SinonSpy;
        // delete props.onVisible;
        // Act
        const { container } = render(<LazyComponent {...props} />);

        act(() => {
          intersectionObeserverSpy.getCalls()[0].args[0]([
            {
              intersectionRatio: props.ratio! + 0.1,
              isIntersecting: true,
            },
          ]);
        });
        console.log(props);
        // Assert
        expect(container.getElementsByClassName("children")).toHaveLength(1);
        expect(disconnectStub.calledOnce).toBe(true);
      });
    });
  });
});
