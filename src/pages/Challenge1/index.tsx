import { Spin } from "antd";
import { Route, Switch, Redirect, HashRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

const Page1 = lazy(() => import("./pages/Page1"));
const Page2 = lazy(() => import("./pages/Page2"));

function Challenge1() {
  return (
    <Suspense fallback={<Spin />}>
      <HashRouter basename="/challenge1">
        Nested app example that could be external package
        <br />
        <Switch>
          <Route exact path="/" children={<Redirect to="/page1" />} />
          <Route exact path="/page1" children={<Page1 />} />
          <Route exact path="/page2" children={<Page2 />} />
        </Switch>
      </HashRouter>
    </Suspense>
  );
}
export default Challenge1;
