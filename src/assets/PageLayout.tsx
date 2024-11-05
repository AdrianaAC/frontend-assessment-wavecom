import PageWithBreadcrumb from "./PageWithBreadcrumb";
import { PropsWithChildren } from "react";

function pagelayout(props: PropsWithChildren) {
  return (
    <div
      style={{
        width: "inherit",
        height: "inherit",
        paddingLeft: 120,
      }}
    >
      <PageWithBreadcrumb>{props.children}</PageWithBreadcrumb>
    </div>
  );
}

export default pagelayout;
