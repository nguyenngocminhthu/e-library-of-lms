import { ReactComponent as Home } from "../../shared/img/icon/home.svg";
import { ReactComponent as Book } from "../../shared/img/icon/u_book-open.svg";
import { ReactComponent as File } from "../../shared/img/icon/u_file-edit-alt.svg";
import { ReactComponent as Bag } from "../../shared/img/icon/u_bag.svg";
import { ReactComponent as Bell } from "../../shared/img/icon/fi_bell.svg";
import { ReactComponent as Setting } from "../../shared/img/icon/fi_settings.svg";
import { ReactComponent as Question } from "../../shared/img/icon/u_comment-question.svg";
import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate } from "react-router-dom";
import logosecond from "../../shared/img/icon/logo-second.svg";
import "../../shared/styles/layout-style/sidebar.scss";
import { useLocation } from "react-router";
const { Sider } = Layout;
const { SubMenu } = Menu;

export const Sidebar: React.FC = () => {
  const [collapsed, setcollapsed] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const fakeKey = location.pathname.split("/");
  const [key, setKey] = useState([`${fakeKey[1]}`]);

  useEffect(() => {
    if (fakeKey[1] === "subjects") {
      setKey(["subjects", "subject"]);
    }
  }, []);

  const handleSelect = (key: any) => {
    navigate(`/${key[0]}`);
    setKey(key);
  };

  return (
    <>
      <Sider
        onMouseMove={() => setcollapsed(false)}
        className="sidebar"
        collapsed={true}
      >
        <div className="logo">
          <img src={logosecond} alt="logo" />
        </div>
        <Menu selectedKeys={key} defaultSelectedKeys={["home"]} mode="inline">
          <Menu.Item
            onClick={() => handleSelect(["home"])}
            key="home"
            icon={<Home />}
          ></Menu.Item>
          <Menu.Item
            onClick={() => handleSelect(["subjects", "subject"])}
            key="subject"
            icon={<Book />}
          ></Menu.Item>
          {/* <Menu.Item
            onClick={() => handleSelect(["privatefile"])}
            key="privatefile"
            icon={<File />}
          ></Menu.Item> */}
          <Menu.Item
            onClick={() => handleSelect(["exambank"])}
            key="exambank"
            icon={<Bag />}
          ></Menu.Item>
          <Menu.Item
            onClick={() => handleSelect(["notification"])}
            key="notification"
            icon={<Bell />}
          ></Menu.Item>
          <Menu.Item
            onClick={() => handleSelect(["setting"])}
            key="setting"
            icon={<Setting />}
          ></Menu.Item>
          <Menu.Item
            onClick={() => handleSelect(["help"])}
            key="help"
            icon={<Question />}
          ></Menu.Item>
        </Menu>
      </Sider>
      <Sider
        className="sidebar-expand"
        onMouseLeave={() => setcollapsed(true)}
        hidden={collapsed}
      >
        <div className="logo"></div>
        <Menu selectedKeys={key} defaultSelectedKeys={["home"]} mode="inline">
          <Menu.Item onClick={() => handleSelect(["home"])} key="home">
            Trang ch???
          </Menu.Item>
          <SubMenu key="subject" title="Qu???n l?? m??n h???c">
            <Menu.Item
              onClick={() => handleSelect(["subjects", "subject"])}
              key="subjects"
            >
              Danh s??ch m??n h???c
            </Menu.Item>
            <Menu.Item
              onClick={() => handleSelect(["subjectManage", "subject"])}
              key="subjectManage"
            >
              Ph?? duy???t t??i li???u m??n h???c
            </Menu.Item>
          </SubMenu>
          {/* <Menu.Item
            onClick={() => handleSelect(["privatefile"])}
            key="privatefile"
          >
            T???p ri??ng t??
          </Menu.Item> */}
          <Menu.Item onClick={() => handleSelect(["exambank"])} key="exambank">
            Ng??n h??ng ????? thi
          </Menu.Item>
          <Menu.Item
            onClick={() => handleSelect(["notification"])}
            key="notification"
          >
            Th??ng b??o
          </Menu.Item>
          <Menu.Item onClick={() => handleSelect(["setting"])} key="setting">
            C??i ?????t h??? th???ng
          </Menu.Item>
          <Menu.Item onClick={() => handleSelect(["help"])} key="help">
            Tr??? gi??p
          </Menu.Item>
        </Menu>
      </Sider>
    </>
  );
};
