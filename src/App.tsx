import pagelayout from "./assets/PageLayout.tsx";
import { lazy, useEffect, useState, Suspense } from "react";
import { Switch, BrowserRouter, Route, Redirect } from "react-router-dom";
import "./index.css";
import SideBar from "./assets/SideBar.tsx";
import { cloneDeep } from "lodash";

const MapView = lazy(() => import("./pages/MapView.tsx"));
const Products = lazy(() => import("./pages/Products.tsx"));
const Challenge1 = lazy(() => import("./pages/Challenge1"));
const Challenge2 = lazy(() => import("./pages/Challenge2"));
const Challenge3 = lazy(() => import("./pages/Challenge3"));

function randomIntFromInterval(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// api permission simulation
function fetchApiPermissions(userID: string) {
  const aclPermissions: { [k: string]: string } = {
    userID,
    root: "GET",
    "/map": "GET",
    "/products": "GET,POST",
    "/challenge1": "GET",
    "/challenge2": "GET",
    "/challenge3": "GET",
  };

  return new Promise<typeof aclPermissions>((resolve) => {
    if (randomIntFromInterval(0, 1)) {
      // random root permissions
      delete aclPermissions.root;
    }

    resolve(cloneDeep(aclPermissions));
  });
}

const routes = [
  {
    path: "/map",
    children: <MapView />,
    exact: true,
  },
  {
    path: "/products",
    children: <Products />,
    exact: true,
  },
  {
    path: "/challenge1",
    children: <Challenge1 />,
    exact: false,
  },
  {
    path: "/challenge2",
    children: <Challenge2 />,
    exact: true,
  },
  {
    path: "/challenge3",
    children: <Challenge3 />,
    exact: true,
  },
];

function App() {
  const [userPermissions, setUserPermissions] = useState({});
  // useEffect(() => {
  //   // simulation of permissions checking
  //   setInterval(() => {
  //     // parameter api simulation
  //     fetchApiPermissions("user_1234").then(setUserPermissions);
  //   }, 5000);
  // }, []);
  useEffect(() => {
    const fetchPermissions = async () => {
      const permissions = await fetchApiPermissions("user_1234");
      setUserPermissions(permissions);
    };

    fetchPermissions();
    const intervalId = setInterval(fetchPermissions, 30000); // Fetch every 30 seconds

    return () => clearInterval(intervalId); // Clear interval on component unmount
  }, []);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <SideBar userPermissions={userPermissions} />
        <Switch>
          <Route exact path="/">
            <Redirect to="/map" />
          </Route>
          {/* we need to check permissions on route to */}
          {routes.map((route) => (
            <Route
              {...route}
              children={pagelayout({ children: route.children })}
            />
          ))}
        </Switch>
      </BrowserRouter>
    </Suspense>
  );
}
export default App;
