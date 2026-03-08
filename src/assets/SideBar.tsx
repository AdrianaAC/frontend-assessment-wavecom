import { DatabaseOutlined, InfoOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import { useMemo } from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  userPermissions: { [k: string]: string };
}

const baseItems = [
  {
    link: "/map",
    label: (
      <Space>
        <DatabaseOutlined />
        <Typography.Text>Map</Typography.Text>
      </Space>
    ),
  },
  {
    link: "/products",
    label: (
      <Space>
        <DatabaseOutlined />
        <Typography.Text>Products</Typography.Text>
      </Space>
    ),
  },
  {
    link: "/challenge1",
    label: (
      <Space>
        <InfoOutlined />
        <Typography.Text>Challenge1</Typography.Text>
      </Space>
    ),
  },
  {
    link: "/challenge2",
    label: (
      <Space>
        <InfoOutlined />
        <Typography.Text>Challenge2</Typography.Text>
      </Space>
    ),
  },
  {
    link: "/challenge3",
    label: (
      <Space>
        <InfoOutlined />
        <Typography.Text>Challenge3</Typography.Text>
      </Space>
    ),
  },
];

const SideBar = (props: SidebarProps) => {
  const { userPermissions } = props;

  const allowedMenuItems = useMemo(
    () =>
      baseItems.filter(
        (item) =>
          userPermissions[item.link] && userPermissions[item.link].includes("GET")
      ),
    [userPermissions]
  );

  return (
    <div className="flex flex-col items-center gap-4 absolute z-10 top-2 left-2 bg-white p-2 rounded">
      <img alt="icon" src="/wave-120x120.png" width={30} />
      {allowedMenuItems.map((item) => (
        <Link key={item.link} to={item.link}>
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default SideBar;
