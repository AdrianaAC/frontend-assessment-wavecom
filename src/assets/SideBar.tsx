import { DatabaseOutlined, InfoOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import { cloneDeep } from "lodash";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface SidebarProps {
  userPermissions: { [k: string]: string };
}

const SideBar = (props: SidebarProps) => {
  const { userPermissions } = props;

  const [allowedMenuItems, setAllowedMenuItems] = useState<typeof baseItems>(
    []
  );

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

  useEffect(() => {
    const newMenuItems = cloneDeep(baseItems);

    for (let index = 0; index < newMenuItems.length; index++) {
      const item = newMenuItems[index];
      // ex: user has get permissions to access page
      if (
        !userPermissions[item.link] ||
        !userPermissions[item.link].includes("GET")
      ) {
        newMenuItems.splice(index, 1);
      }
    }

    setAllowedMenuItems(newMenuItems);
  }, [userPermissions]);

  return (
    <div className="flex flex-col items-center gap-4 absolute z-10 top-2 left-2 bg-white p-2 rounded">
      <img alt="icon" src="/wave-120x120.png" width={30} />
      {allowedMenuItems.map((item) => (
        <Link to={item.link}>{item.label}</Link>
      ))}
    </div>
  );
};

export default SideBar;
