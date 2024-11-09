// Challenge2.tsx
import { Badge } from "antd";
import { useEffect, useState } from "react";
import "./index.css";

interface Challenge2Props {
  userPermissions: string[];
}

function Challenge2({ userPermissions }: Challenge2Props) {
  const [hasRootAccess, setHasRootAccess] = useState(false);

  useEffect(() => {
    // Check if "root" is in the userPermissions array
    setHasRootAccess(userPermissions.includes("root"));
  }, [userPermissions]);

  return (
    <>
      <div className="solutionContainer">
        <h4 className="solutionH4">Problem resumed: </h4>
        <p className="solutionP">
          We need to display a real-time badge, provided by antd, that shows if
          the user has root permissions on this page. We use the userPermissions
          state to update the badge and reflect its state on a real-time basis.
          We need to pass the userPermissions state from App to the challenge2
          component.
        </p>
        <hr className="brSolution" />
        <h4 className="solutionH4">Solution presented: </h4>
        <p className="solutionP">
          Add a function - fetchApiPermissions - that fetches the user
          permissions from an API (in order to mock different states, this
          function sometimes "hides" the root permission). This function is
          called in a userEffect hook on App component, and the userPermissions
          state is updated with the fetched data. The Challenge2 component
          receives the userPermissions state as a prop and checks if the user
          has root access, dinamically rendering a status and a message.
        </p>
        <hr className="brSolution" />
        <h4 className="solutionH4">How to test: </h4>
        <p className="solutionP">
          Run the application, on Challenge 2 page observe the badge status for
          root access. It will update with a spawn of seconds, and it will
          indicate if the user has root access (green) orjhas not root access
          (red).
        </p>
      </div>
      <div>
        In this Challenge, we need to show if the user has root access to
        content in real-time. The `userPermissions` data is updated every
        second.
      </div>
      <br />
      Root Enabled:&nbsp;
      <Badge
        status={hasRootAccess ? "success" : "error"}
        text={hasRootAccess ? "Enabled" : "Disabled"}
      />
    </>
  );
}

export default Challenge2;
