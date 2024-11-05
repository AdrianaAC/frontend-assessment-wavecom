import { HomeOutlined } from "@ant-design/icons";
import { PropsWithChildren } from "react";
import { Breadcrumb, Typography } from "antd";
import { useHistory } from "react-router-dom";

function PageWithBreadcrumb(props: PropsWithChildren) {
  const history = useHistory();

  return (
    <>
      <Breadcrumb
        items={[
          {
            title: <HomeOutlined />,
          },
          {
            title: (
              <Typography.Text style={{ textTransform: "capitalize" }}>
                {history.location.pathname.split("/")[1]}
              </Typography.Text>
            ),
          },
        ]}
      />
      {props.children}
    </>
  );
}

export default PageWithBreadcrumb;
