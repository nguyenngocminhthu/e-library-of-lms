import { EyeOutlined, MoreOutlined } from "@ant-design/icons";
import { Button, Col, Form, Popover, Row, Select, Space, Table, Tooltip } from "antd";
import modal from "antd/lib/modal";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { BreadcrumbComp } from "../../../Components/Breadcrumb";
import SearchComponent from "../../../Components/SearchComponent";
import { SelectComp } from "../../../Components/Select";
import { getSubjects, ISubject } from "../../../redux/reducers/subject.reducer";
import {
  getUser,
  updateProfile,
  UserState
} from "../../../redux/reducers/user.reducer";
import { AppDispatch } from "../../../redux/store";
import "./style.scss";

export const Subject = () => {
  const { Option } = Select;
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [form] = Form.useForm();
  const [disable, setDisable] = useState(false);
  const [data, setData] = useState<ISubject[]>([]);
  const user: UserState = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    dispatch(getSubjects({ limit: 999, teacher: user.id }))
      .unwrap()
      .then((rs: any) => {
        let list: ISubject[] = [];
        rs.results.forEach((vl: ISubject, idx: number) => {
          list.push({ key: idx, ...vl });
        });
        setData(list);
      });
  }, []);
  

  const handleClick = (id: string) => {
    navigate(`subjectdetail/${id}`);
    const subjectIds = user.recentSubjectId;
    if (subjectIds.length === 10) {
      subjectIds.pop();
    }
    if (subjectIds.includes(id)) {
      const newSubjectIds = subjectIds.filter(function (e: any) {
        return e !== id;
      });
      dispatch(
        updateProfile({
          id: user.id,
          payload: { recentSubjectId: [id, ...newSubjectIds] },
        })
      )
        .unwrap()
        .then(() => {
          dispatch(getUser(user.id))
            .unwrap()
            .then((rs: UserState) => {
              localStorage.setItem("user", JSON.stringify(rs));
            });
        });
    } else {
      dispatch(
        updateProfile({
          id: user.id,
          payload: { recentSubjectId: [id, ...subjectIds] },
        })
      )
        .unwrap()
        .then(() => {
          dispatch(getUser(user.id))
            .unwrap()
            .then((rs: UserState) => {
              localStorage.setItem("user", JSON.stringify(rs));
            });
        });
    }
  };

  const modalCourseManage = {
    title: "Ph??n c??ng t??i li???u m??n h???c",
    width: "50%",
    content: (
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        name="cancel-form"
        layout="horizontal"
        form={form}
        style={{ textAlign: "left"}}
      >
        <Form.Item name="fileName" label="M?? m??n h???c">
          <div>#DLK6</div>
        </Form.Item>
        <Form.Item name="fileName" label="M??n h???c">
          <div>Th????ng m???i ??i???n t???</div>
        </Form.Item>
        <Form.Item name="fileName" label="Gi???ng vi??n">
          <div>Hoa Hoa</div>
        </Form.Item>
        <p style={{ fontWeight: "700", marginBottom: "16px"}}>Ph??n c??ng v??o c??c l???p gi???ng d???y</p>
        <Form.Item name="chooseTopic" label="T???t c??? l???p h???c" rules={[{ required: true }]}>
          <Select disabled={disable} defaultValue="T??y ch???n l???p h???c">
            <Option value={0}>V??n h??a x?? h???i</Option>
            <Option value={1}>Sample</Option>
          </Select>
        </Form.Item>
        <Form.Item name="chooseTopic" label="Ch???n ch??? ?????" rules={[{ required: true }]}>
          <Select disabled={disable} defaultValue="Ch???n ch??? ?????">
            <Option value={0}>V??n h??a x?? h???i</Option>
            <Option value={1}>Sample</Option>
          </Select>
        </Form.Item>
        <Form.Item name="fileNameTitle" label="Ch???n b??i gi???ng" rules={[{ required: true }]}>
        <Select disabled={disable} defaultValue="Ch???n b??i gi???ng">
            <Option value={0}>V??n h??a x?? h???i</Option>
            <Option value={1}>Sample</Option>
          </Select>
        </Form.Item>
      </Form>
    ),
    okText: "L??u",
    cancelText: "Hu???",
  };

  const expandedRowRender = (record: ISubject) => {
    const columnsNested = [
      {
        title: "M?? l???p",
        dataIndex: "classCode",
        key: "classCode",
      },
      {
        title: "T??n l???p",
        dataIndex: "className",
        key: "className",
      },
      {
        title: "Xem chi ti???t",
        dataIndex: "details",
        key: "details",
        render: (record: any) => (
          <Space size="middle">
            <Tooltip title="Detail">
              <Button
                onClick={() => navigate(`subjectdetail/${record.id}`)}
                icon={<EyeOutlined />}
              />
            </Tooltip>
          </Space>
        ),
      },
    ];
    return (
      <Table
        columns={columnsNested}
        dataSource={record.classes}
        pagination={false}
        className="table-nested"
      />
    );
  };

  const subjectSelect = [
    {
      value: "X???p theo t??n m??n h???c",
      key: "XSTMH",
    },
    {
      value: "L???n truy c???p g???n nh???t",
      key: "LTCGN",
    },
  ];

  const columns = [
    {
      title: "M?? m??n h???c",
      dataIndex: "subCode",
      key: "subCode",
    },
    {
      title: "T??n m??n h???c",
      dataIndex: "subName",
      key: "subName",
      sorter: (a: any, b: any) => a.subName.length - b.subName.length,
      render: (subName: string, record: any) => (
        <div onClick={() => navigate(`subjectdetail/${record.id}`)}>
          {subName}
        </div>
      ),
    },
    {
      title: "M?? t???",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "T??nh tr???ng",
      dataIndex: "status",
      key: "status",
      render: (status: number) => (
        <div className={status === 0 ? "gray" : "green"}>
          {status === 0 ? "Ch??? ph?? duy???t" : "???? ph?? duy???t"}
        </div>
      ),
    },
    {
      title: "S??? t??i li???u ch??? duy???t",
      dataIndex: "file",
      key: "file",
    },
    {
      title: "",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip title="More">
            <Popover
              content={
                <div className="popover">
                  <p onClick={() => handleClick(record.id)}>Chi ti???t m??n h???c</p>
                  <p onClick={() => navigate(`listfile/${record.id}`)}>
                    Danh s??ch t??i li???u
                  </p>
                  <p onClick={() => modal.confirm(modalCourseManage)}>
                    Ph??n c??ng t??i li???u
                  </p>
                </div>
              }
              trigger="click"
            >
              <Button
                // onClick={() => navigate(`/subjectManage/${record.subCode}`)}
                icon={
                  <MoreOutlined
                    style={{
                      fontSize: "24px",
                    }}
                  />
                }
              />
            </Popover>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="subject">
      <BreadcrumbComp title="Danh s??ch m??n gi???ng d???y" />
      <Row>
        <Col className="table-header" span={16}>
          <SelectComp
            style={{ display: "block" }}
            defaultValue="X???p theo t??n m??n h???c"
            dataString={subjectSelect}
          />
        </Col>
        <Col className="table-header" span={8}>
          <SearchComponent placeholder="T??m k???t qu??? theo t??n, l???p, m??n h???c,..." />
        </Col>
      </Row>
      <Table
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender: (record) => expandedRowRender(record),
        }}
      />
    </div>
  );
};
