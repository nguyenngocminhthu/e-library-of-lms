import { ReactComponent as Home } from "../../shared/img/icon/home.svg";
import { ReactComponent as Book } from "../../shared/img/icon/u_book-open.svg";
import { ReactComponent as File } from "../../shared/img/icon/u_file-edit-alt.svg";
import { ReactComponent as Bag } from "../../shared/img/icon/u_bag.svg";
import { ReactComponent as Bell } from "../../shared/img/icon/fi_bell.svg";
import { ReactComponent as Question } from "../../shared/img/icon/u_comment-question.svg";
import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import logosecond from "../../shared/img/icon/logo-second.svg";
import "../../shared/styles/layout-style/sidebar.scss";
const { Sider } = Layout;
const { SubMenu } = Menu;

export const TeacherSidebar: React.FC = () => {
  const [collapsed, setcollapsed] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const fakeKey = location.pathname.split("/");
  const [key, setKey] = useState([`${fakeKey[2]}`]);

  useEffect(() => {
    if (fakeKey[2] === "lessons") {
      setKey(["lessons", "resource"]);
    } else if (fakeKey[2] === "resources") {
      setKey(["resources", "resource"]);
    } else if (fakeKey[2] === "exams") {
      setKey(["exams", "exam"]);
    } else if (fakeKey[2] === "questions") {
      setKey(["questions", "exam"]);
    }
  }, []);

  const handleSelect = (key: any) => {
    navigate(`/teacher/${key[0]}`);
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
            onClick={() => handleSelect(["subject"])}
            key="subject"
            icon={<Book />}
          ></Menu.Item>
          <Menu.Item
            onClick={() => handleSelect(["lessons", "resource"])}
            key="resource"
            icon={<Bag />}
          ></Menu.Item>
          <Menu.Item
            onClick={() => handleSelect(["exams", "exam"])}
            key="exam"
            icon={<File />}
          ></Menu.Item>
          <Menu.Item
            onClick={() => handleSelect(["notification"])}
            key="notification"
            icon={<Bell />}
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
          <Menu.Item onClick={() => handleSelect(["subject"])} key="subject">
            M??n gi???ng d???y
          </Menu.Item>
          <SubMenu key="resource" title="B??i gi???ng, t??i nguy??n">
            <Menu.Item
              onClick={() => handleSelect(["lessons", "resource"])}
              key="lessons"
            >
              T???t c??? b??i gi???ng
            </Menu.Item>
            <Menu.Item
              onClick={() => handleSelect(["resources", "resource"])}
              key="resources"
            >
              T???t c??? t??i nguy??n
            </Menu.Item>
          </SubMenu>
          <SubMenu key="exam" title="????? thi, ki???m tra">
            <Menu.Item
              onClick={() => handleSelect(["exams", "exam"])}
              key="exams"
            >
              Danh s??ch ????? thi v?? ki???m tra
            </Menu.Item>
            <Menu.Item
              onClick={() => handleSelect(["questions", "exam"])}
              key="questions"
            >
              Ng??n h??ng c??u h???i
            </Menu.Item>
          </SubMenu>
          <Menu.Item
            onClick={() => handleSelect(["notification"])}
            key="notification"
          >
            Th??ng b??o
          </Menu.Item>
          <Menu.Item onClick={() => handleSelect(["help"])} key="help">
            Tr??? gi??p
          </Menu.Item>
        </Menu>
      </Sider>
    </>
  );
};
