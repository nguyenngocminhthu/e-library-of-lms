import { DownloadOutlined, EyeOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  Row,
  Space,
  Table,
  Tag,
  Tooltip
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import modal from "antd/lib/modal";
import lodash from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router";
import { BreadcrumbComp } from "../../../Components/Breadcrumb";
import SearchComponent from "../../../Components/SearchComponent";
import { SelectComp } from "../../../Components/Select";
import {
  getFiles,
  IFile,
  updateFile,
} from "../../../redux/reducers/file.reducer";
import {
  getLessons,
  ILesson,
  updateLesson,
} from "../../../redux/reducers/lesson.reducer";
import { getSubject, ISubject } from "../../../redux/reducers/subject.reducer";
import { UserState } from "../../../redux/reducers/user.reducer";
import { AppDispatch } from "../../../redux/store";
import { ReactComponent as Word } from "../../../shared/img/icon/word.svg";
import { ReactComponent as Mp4 } from "../../../shared/img/icon/mp4_file.svg";
import pdf from "../../../shared/img/pdf.png";
import pptx from "../../../shared/img/pptx.png";
import { ReactComponent as Excel } from "../../../shared/img/icon/excel_file.svg";
import "./style.scss";

export const ListFile = () => {
  const params = useParams<{ idSub: string }>();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();

  const onSelectChange = (selectedRowKeys: any) => {
    setSelectedRowKeys(selectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };
  const dispatch: AppDispatch = useDispatch();
  const [data, setData] = useState<ILesson[]>([]);
  const [resourceData, setResourceData] = useState<IFile[]>([]);
  const [fileType, setFileType] = useState<number>(0);
  const [subData, setSubdata] = useState<ISubject>();

  useEffect(() => {
    if (params.idSub) {
      dispatch(getSubject(params.idSub))
        .unwrap()
        .then((rs) => {
          setSubdata(rs);
        });

      dispatch(getLessons({ limit: 999, subject: params.idSub }))
        .unwrap()
        .then((rs) => {
          setData(rs.results);
        });

      dispatch(getFiles({ limit: 999, subject: params.idSub }))
        .unwrap()
        .then((rs) => {
          setResourceData(rs.results);
        });
    }
  }, []);

  const handleRefresh = () => {
    dispatch(getLessons({ limit: 999, subject: params.idSub }))
      .unwrap()
      .then((rs) => {
        setData(rs.results);
      });

    dispatch(getFiles({ limit: 999, subject: params.idSub }))
      .unwrap()
      .then((rs) => {
        setResourceData(rs.results);
      });
  };

  const status = [
    {
      name: "???? ph?? duy???t",
      value: "DPD",
    },
    {
      name: "Ch??? ph?? duy???t",
      value: "CPD",
    },
  ];

  const type = [
    {
      name: "B??i gi???ng",
      value: 0,
    },
    {
      name: "T??i nguy??n",
      value: 1,
    },
  ];

  const ModalConFirm = (id: string, type: number) => {
    const config = {
      title: "Ph?? duy???t",
      className: "file-modal",
      content:
        type === 0
          ? "X??c nh???n mu???n ph?? duy???t b??i gi???ng n??y v?? c??c th??ng tin b??n trong? Sau khi ph?? duy???t s??? kh??ng th??? ho??n t??c."
          : "X??c nh???n mu???n ph?? duy???t t??i nguy??n n??y v?? c??c th??ng tin b??n trong? Sau khi ph?? duy???t s??? kh??ng th??? ho??n t??c.",
      okText: "X??c nh???n",
      cancelText: "Hu???",
      onOk: () =>
        type === 0
          ? dispatch(updateLesson({ id: id, payload: { status: 1 } })).then(
              () => {
                handleRefresh();
              }
            )
          : dispatch(updateFile({ id: id, payload: { status: 1 } })).then(
              () => {
                handleRefresh();
              }
            ),
    };
    modal.confirm(config);
  };

  const config1 = {
    title: "Hu??? ph?? duy???t t??i li???u",
    width: "40%",
    className: "cancel-form file-modal",
    content: (
      <Form
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        name="cancel-form"
        layout="horizontal"
        form={form}
      >
        <Form.Item
          name="startDate"
          label="Ng??y b???t ?????u"
          rules={[{ required: true }]}
        >
          <DatePicker style={{ width: "50%" }} />
        </Form.Item>
        <Form.Item name="user" label="Ng?????i hu???" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="note" label="Ghi ch??">
          <TextArea rows={4} />
        </Form.Item>
        <Form.Item name="cbnotification" label=" ">
          <Checkbox className="cb-style">G???i th??ng b??o cho ng?????i t???o</Checkbox>
        </Form.Item>
      </Form>
    ),
    okText: "L??u",
    cancelText: "Hu???",
  };

  const downloadFile = {
    title: "T???i xu???ng t???p",
    className: "modal-common-style",
    content:
      "X??c nh???n mu???n t???i xu???ng 25 t???p ???? ch???n. C??c file ???? ch???n s??? ???????c l??u d?????i d???ng .rar.",
    okText: "X??c nh???n",
    cancelText: "Hu???",
  };

  const seeDetails = {
    title: "T???ng quan v??? Th????ng m???i ??i???n t??? ??? Vi???t Nam",
    width: "90%",
    content: <div></div>,
  };

  const columns = [
    {
      title: "Th??? lo???i",
      dataIndex: "video",
      key: "video",
      render: (video: string) => {
        if (!lodash.isEmpty(video)) {
          const vid = video.split("/");
          const fileType = vid[vid.length - 1].split("?")[0];
          return <>{fileType.endsWith("mp4") && <Mp4 />}</>;
        } else return "--";
      },
    },
    {
      title: "T??n",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "M??n h???c",
      dataIndex: "subject",
      key: "subject",
      render: (subject: ISubject) => {
        return subject.subName;
      },
    },
    {
      title: "Ng?????i ch???nh s???a",
      dataIndex: "user",
      key: "user",
      render: (user: UserState) => {
        return user.userName;
      },
    },
    {
      title: "Ng??y s???a l???n cu???i",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (updatedAt: any) => {
        return moment(updatedAt).format("DD/MM/YYYY");
      },
    },
    // {
    //   title: "T??nh tr???ng t??i li???u m??n h???c",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status: number) => (
    //     <Tag
    //       color={status === 0 ? "green" : status === 1 ? "blue" : "red"}
    //       key={status}
    //     >
    //       {status === 0
    //         ? "Ch??? ph?? duy???t"
    //         : status === 1
    //         ? "???? ph?? duy???t"
    //         : "???? hu???"}
    //     </Tag>
    //   ),
    // },
    // {
    //   title: "Ph?? duy???t t??i li???u",
    //   dataIndex: "verify",
    //   key: "verify",
    //   render: (stt: any, record: ILesson) => (
    //     <div>
    //       {record.status === 0 ? (
    //         <div style={{ display: "flex" }}>
    //           <Button onClick={() => ModalConFirm(record.id, 0)} type="primary">
    //             Ph?? duy???t
    //           </Button>
    //           <Button
    //             onClick={() => modal.confirm(config1)}
    //             className="cancel-btn"
    //           >
    //             Hu???
    //           </Button>
    //         </div>
    //       ) : record.status === 1 ? (
    //         <span className="gray">???? ph?? duy???t</span>
    //       ) : (
    //         <span className="gray">???? hu???</span>
    //       )}
    //     </div>
    //   ),
    // },

    {
      title: "",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Detail">
            <Button
              onClick={() => modal.confirm(seeDetails)}
              icon={<EyeOutlined />}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const resourceColumns = [
    {
      title: "Th??? lo???i",
      dataIndex: "url",
      key: "url",
      render: (file: string) => {
        const vid = file.split("/");
        const fileType = vid[vid.length - 1].split("?")[0];
        if (fileType.endsWith("doc") || fileType.endsWith("docx")) {
          return <Word />;
        } else if (fileType.endsWith("pdf")) {
          return <img src={pdf} alt="pdf" />;
        } else if (fileType.endsWith("pptx")) {
          return <img src={pptx} alt="pptx" />;
        } else if (
          fileType.endsWith("xlsx") ||
          fileType.endsWith("xls") ||
          fileType.endsWith("csv")
        ) {
          return <Excel />;
        }
      },
    },
    {
      title: "T??n",
      dataIndex: "url",
      key: "url",
      render: (file: string) => {
        const vid = file.split("/");
        const fileType = vid[vid.length - 1].split("?")[0];
        const fileName = fileType.split("%2F")[1];
        return <>{fileName}</>;
      },
    },
    {
      title: "M??n h???c",
      dataIndex: "subject",
      key: "subject",
      render: (subject: ISubject) => {
        return subject.subName;
      },
    },
    {
      title: "Ng?????i ch???nh s???a",
      dataIndex: "user",
      key: "user",
      render: (user: UserState) => {
        return user.userName;
      },
    },
    // {
    //   title: "T??nh tr???ng t??i li???u m??n h???c",
    //   dataIndex: "status",
    //   key: "status",
    //   render: (status: number) => (
    //     <Tag
    //       color={status === 0 ? "green" : status === 1 ? "blue" : "red"}
    //       key={status}
    //     >
    //       {status === 0
    //         ? "Ch??? ph?? duy???t"
    //         : status === 1
    //         ? "???? ph?? duy???t"
    //         : "???? hu???"}
    //     </Tag>
    //   ),
    // },
    // {
    //   title: "Ph?? duy???t t??i li???u",
    //   dataIndex: "verify",
    //   key: "verify",
    //   render: (stt: any, record: IFile) => (
    //     <div>
    //       {record.status === 0 ? (
    //         <div style={{ display: "flex" }}>
    //           <Button onClick={() => ModalConFirm(record.id, 1)} type="primary">
    //             Ph?? duy???t
    //           </Button>
    //           <Button
    //             onClick={() => modal.confirm(config1)}
    //             className="cancel-btn"
    //           >
    //             Hu???
    //           </Button>
    //         </div>
    //       ) : record.status === 1 ? (
    //         <span className="gray">???? ph?? duy???t</span>
    //       ) : (
    //         <span className="gray">???? hu???</span>
    //       )}
    //     </div>
    //   ),
    // },

    {
      title: "",
      key: "action",
      render: (text: any, record: any) => (
        <Space size="middle">
          <Tooltip title="Detail">
            <Button
              onClick={() => modal.confirm(seeDetails)}
              icon={<EyeOutlined />}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="subject sub-manage">
      <BreadcrumbComp
        title="Danh s??ch t??i li???u"
        prevFirstPageTitle="Qu???n l?? m??n h???c"
        prevFirstPage="subjects"
      />
      <div className="top-head">
        <h1>{subData?.subName}</h1>
        <div style={{ display: "flex" }}>
          <Space className="" size="middle">
            <Tooltip title="Download">
              <Button
                type="link"
                disabled={selectedRowKeys.length === 0 ? true : false}
                icon={
                  <DownloadOutlined
                    onClick={() => modal.confirm(downloadFile)}
                  />
                }
              />
            </Tooltip>
          </Space>
          <div className="line"></div>
          <Button
            className="default-btn"
            disabled={selectedRowKeys.length === 0 ? true : false}
            style={{ marginLeft: "1rem" }}
          >
            Hu??? ph?? duy???t
          </Button>
          <Button
            disabled={selectedRowKeys.length === 0 ? true : false}
            style={{ marginLeft: "1rem" }}
            type="primary"
          >
            Ph?? duy???t
          </Button>
        </div>
      </div>
      <Row>
        <Col className="table-header" span={16}>
          <SelectComp
            style={{ display: "block" }}
            textLabel="T??nh tr???ng t??i li???u"
            defaultValue="T???t c??? t??nh tr???ng"
            dataString={status}
          />
          <SelectComp
            style={{ display: "block" }}
            textLabel="Lo???i file"
            defaultValue={fileType}
            dataString={type}
            onChange={(e: number) => setFileType(e)}
          />
        </Col>
        <Col className="table-header" span={8}>
          <SearchComponent placeholder="T??m k???t qu??? theo t??n, l???p, m??n h???c,..." />
        </Col>
      </Row>
      {fileType === 0 ? (
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
        />
      ) : (
        <Table
          rowSelection={rowSelection}
          columns={resourceColumns}
          dataSource={resourceData}
        />
      )}
    </div>
  );
};
