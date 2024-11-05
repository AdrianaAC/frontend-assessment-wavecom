import { Badge } from "antd";

function Challenge2() {
  return (
    <>
      In this Challenge we need to show user has root access to content when
      requesting from GET from the user permissions can change in run time, You
      can use Badge from antd or other component to show if root is enabled or
      not Permissions data is stored inside App.tsx file on userPermissions
      state
      <br />
      Root Enabled:&nbsp;
      <Badge status="error" />
    </>
  );
}

export default Challenge2;
