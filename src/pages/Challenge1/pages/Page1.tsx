import { Typography } from "antd";
import { Link } from "react-router-dom";

function Page1() {
  return (
    <>
      <Typography>Page 1 example</Typography>
      <Link to="/page2">
        <Typography.Link>Go to Page 2</Typography.Link>
      </Link>
    </>
  );
}

export default Page1;
