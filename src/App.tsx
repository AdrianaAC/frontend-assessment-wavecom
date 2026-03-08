import pagelayout from "./assets/PageLayout.tsx";
import { lazy, useEffect, useMemo, useState, Suspense } from "react";
import {
  Switch,
  BrowserRouter,
  Route,
  Redirect,
  useLocation,
} from "react-router-dom";
import "./index.css";
import SideBar from "./assets/SideBar.tsx";

const MapView = lazy(() => import("./pages/MapView.tsx"));
const Products = lazy(() => import("./pages/Products.tsx"));
const Challenge1 = lazy(() => import("./pages/Challenge1"));
const Challenge2 = lazy(() => import("./pages/Challenge2"));
const Challenge3 = lazy(() => import("./pages/Challenge3"));

type Permissions = { [k: string]: string };

function randomIntFromInterval(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function fetchApiPermissions(userID: string) {
  const aclPermissions: Permissions = {
    userID,
    root: "GET",
    "/map": "GET",
    "/products": "GET,POST",
    "/challenge1": "GET",
    "/challenge2": "GET",
    "/challenge3": "GET",
  };

  if (randomIntFromInterval(0, 1)) {
    delete aclPermissions.root;
  }

  return Promise.resolve(aclPermissions);
}

function arePermissionsEqual(current: Permissions, next: Permissions) {
  const currentKeys = Object.keys(current);
  const nextKeys = Object.keys(next);

  if (currentKeys.length !== nextKeys.length) {
    return false;
  }

  return currentKeys.every((key) => current[key] === next[key]);
}

function AppContent() {
  const [userPermissions, setUserPermissions] = useState<Permissions>({});
  const location = useLocation();
  const shouldPollPermissions = location.pathname === "/challenge2";

  useEffect(() => {
    let isMounted = true;
    let intervalId: number | undefined;

    const fetchPermissions = async () => {
      const permissions = await fetchApiPermissions("user_1234");
      if (!isMounted) {
        return;
      }

      setUserPermissions((currentPermissions) =>
        arePermissionsEqual(currentPermissions, permissions)
          ? currentPermissions
          : permissions
      );
    };

    fetchPermissions();

    if (shouldPollPermissions) {
      intervalId = window.setInterval(fetchPermissions, 1000);
    }

    return () => {
      isMounted = false;
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [shouldPollPermissions]);

  const routes = useMemo(
    () => [
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
        children: <Challenge2 userPermissions={Object.keys(userPermissions)} />,
        exact: true,
      },
      {
        path: "/challenge3",
        children: <Challenge3 />,
        exact: true,
      },
    ],
    [userPermissions]
  );

  return (
    <>
      <SideBar userPermissions={userPermissions} />
      <Switch>
        <Route exact path="/">
          <Redirect to="/map" />
        </Route>
        {routes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            exact={route.exact}
            children={pagelayout({ children: route.children })}
          />
        ))}
      </Switch>
    </>
  );
}

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Suspense>
  );
}

export default App;
