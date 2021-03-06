import { PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Form,
  Input, Row,
  Select,
  Space,
  Table,
  Tooltip,
  Typography
} from "antd";
import modal from "antd/lib/modal";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BreadcrumbComp } from "../../../Components/Breadcrumb";
import SearchComponent from "../../../Components/SearchComponent";
import { SelectComp } from "../../../Components/Select";
import {
  createUser,
  deleteUser,
  getUsers,
  UserState
} from "../../../redux/reducers/user.reducer";
import { AppDispatch } from "../../../redux/store";
import { ReactComponent as Edit } from "../../../shared/img/icon/edit.svg";
import { ReactComponent as Trash } from "../../../shared/img/icon/trash.svg";
import "./style.scss";

export const UserManage = () => {
  const { Option } = Select;
  const { Title } = Typography;
  const dispatch: AppDispatch = useDispatch();
  const [data, setData] = useState<UserState[]>([]);
  const [form] = Form.useForm();
  const [rowSelected, setRowSelected] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [filter, setFilter] = useState<any>({ limit: 999 });

  useEffect(() => {
    dispatch(getUsers(filter))
      .unwrap()
      .then((rs: any) => {
        setData(rs.results);
      });
  }, [filter]);

  const roleMenu = [
    {
      name: "Tất cả",
      value: "",
    },
    {
      name: "Quản trị viên",
      value: "leadership",
    },
    {
      name: "Sinh viên",
      value: "student",
    },
    {
      name: "Giáo viên",
      value: "teacher",
    },
  ];

  const columns = [
    {
      title: "Mã người dùng",
      dataIndex: "userCode",
      key: "id",
    },
    {
      title: "Tên người dùng",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Lần cập nhật cuối",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt: any) => {
        return moment(updatedAt).format("DD/MM/YYYY");
      },
    },
    {
      title: "",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Edit">
            <Button icon={<Edit />} />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              icon={
                <Trash
                  onClick={() => {
                    modal.confirm(deleteRow);
                    setRowSelected(record.id);
                  }}
                />
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const onFinish = (values: any) => {
    if (values.role !== "student") {
      delete values.userCode;
    }
    dispatch(createUser(values)).then(() => {
      dispatch(getUsers(filter))
        .unwrap()
        .then((rs: any) => {
          setData(rs.results);
          form.resetFields();
        });
    });
  };

  const deleteRow = {
    title: "Xóa vai trò",
    content:
      "Xác nhận muốn phê duyệt đề thi này và các thông tin bên trong? Sau khi phê duyệt sẽ không thể hoàn tác.",
    okText: "Xác nhận",
    cancelText: "Huỷ",
    onOk: () =>
      dispatch(deleteUser(rowSelected)).then(() => {
        dispatch(getUsers(filter))
          .unwrap()
          .then((rs: any) => {
            setData(rs.results);
          });
      }),
  };

  const modalAdd = {
    title: "Thêm người dùng mới",
    width: "40%",
    className: "modal-add-role",
    content: (
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        name="profile-form"
        layout="horizontal"
        form={form}
        onFinish={onFinish}
      >
        <Form.Item label="Tên vai trò" name="role" rules={[{ required: true }]}>
          <Select>
            <Option value={"leadership"}>Quản trị viên</Option>
            <Option value={"teacher"}>Giáo viên</Option>
            <Option value={"student"}>Sinh viên</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Tên" name="userName" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Email" name="email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item label="MSSV" name="userCode">
          <Input />
        </Form.Item>

        <Form.Item
          label="Mật khẩu"
          name="password"
          rules={[{ required: true }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    ),
    okText: "Lưu",
    cancelText: "Huỷ",
    onOk: () => form.submit(),
    onCancel: () => form.resetFields(),
  };

  const handleFilter = (e: any) => {
    if (e !== "") {
      setFilter({ ...filter, role: e });
    } else {
      delete filter.role;
      setFilter({ ...filter });
    }
  };

  return (
    <div className="role-manage-page">
      <BreadcrumbComp
        title="Quản lý người dùng"
        prevFirstPageTitle="Cài đặt hệ thống"
        prevFirstPage="setting"
      />
      <div className="title-page">
        <Title ellipsis level={5}>
          Danh sách người dùng trên hệ thống
        </Title>
        <Button
          className="btn-location"
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => modal.confirm(modalAdd)}
        >
          Thêm mới
        </Button>
      </div>
      <Row>
        <Col className="table-header" span={16}>
          <SelectComp
            style={{ display: "block" }}
            defaultValue="Chọn vai trò"
            dataString={roleMenu}
            onChange={(e: any) => handleFilter(e)}
          />
        </Col>
        <Col className="table-header" span={8}>
          <SearchComponent placeholder="Tìm kết quả theo mã người dùng, tên" />
        </Col>
      </Row>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default UserManage;
