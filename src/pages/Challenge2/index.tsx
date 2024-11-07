// Challenge2.tsx
import { Badge } from "antd";
import { useEffect, useState } from "react";

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
      <div>
        In this Challenge, we need to show if the user has root access to content in real-time. 
        The `userPermissions` data is updated every second.
      </div>
      <br />
      Root Enabled:&nbsp;
      <Badge status={hasRootAccess ? "success" : "error"} text={hasRootAccess ? "Enabled" : "Disabled"} />
    </>
  );
}

export default Challenge2;
