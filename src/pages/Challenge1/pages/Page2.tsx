import { Space, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";

function Page2() {
  const history = useHistory();
  return (
    <Space direction="vertical">
      <Typography>Page 2 example</Typography>
      <Typography>try to go back to page 2 with back button</Typography>
      <Typography.Link onClick={() => history.goBack()}>
        <ArrowLeftOutlined /> Go back
      </Typography.Link>
    </Space>
  );
}

export default Page2;
