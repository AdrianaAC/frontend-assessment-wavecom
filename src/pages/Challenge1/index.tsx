import { Spin } from "antd";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import "./index.css";

const Page1 = lazy(() => import("./pages/Page1"));
const Page2 = lazy(() => import("./pages/Page2"));

function Challenge1() {
  return (
    <Suspense fallback={<Spin />}>
      <div className="solutionContainer">
        <h4 className="solutionH4">Problem resumed: </h4>
        <p className="solutionP">
          history.goBack() calling correctly changes the url to the previous url
          registered, but the page does not update neither reflect any changes.
          This comes for an issue caused when we have a nested child of a
          component that is being rendered by the Route component. Since our
          components, Page1 and Page2, are not being rendered directly by the
          Route and are nested in a Suspense component, they do not receive the
          router props automatically, leading to the component not being able to
          recognize the changes in the url.
        </p>
        <hr className="brSolution" />
        <h4 className="solutionH4">Solution presented: </h4>
        <p className="solutionP">
          withRouter wraps the component and injects the route props on to it.
          When this changes in props occurs, it detects the changes on url
          (location) and React re-renders the component and applies the updates
          needed Also, since the only navigation possible is from page2 to
          page1, through the go back link, we can use history.push() to navigate
          to the desired page.
        </p>
        <hr className="brSolution" />
        <h4 className="solutionH4">How to test: </h4>
        <p className="solutionP">
          {" "}
          Navigate to Page 1, check the url and the text saying "Page 1
          example", click on go to Page 2 link, check the url (now has /page2)
          and the text saying "Page 2 example", click on go back link and check
          as url and page text updates again to "Page 1 example".
        </p>
      </div>
      <BrowserRouter basename="/challenge1">
        Nested app example that could be external package
        <br />
        <Switch>
          <Route exact path="/" children={<Redirect to="/page1" />} />
          <Route exact path="/page1" children={<Page1 />} />
          <Route exact path="/page2" children={<Page2 />} />
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
}
export default Challenge1;
