import {
  CaretRightOutlined,
  PlusOutlined,
  SettingOutlined
} from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  Dropdown,
  Form,
  Menu, Row,
  Tabs,
  Tooltip
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BreadcrumbComp } from "../../../../Components/Breadcrumb";
import {
  getSubject,
  ISubject
} from "../../../../redux/reducers/subject.reducer";
import { createTopic, ITopic } from "../../../../redux/reducers/topic.reducer";
import { AppDispatch } from "../../../../redux/store";
import { EditTopic } from "./EditTopic";

export const EditSubject = () => {
  const { TabPane } = Tabs;
  const { Panel } = Collapse;
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const [data, setData] = useState<ISubject>();
  const [loading, setLoading] = useState(false);
  const [dataNotification, setDataNotification] = useState<any>([]);
  const [form] = Form.useForm();
  const [formTopic] = Form.useForm();
  const [editTopic, setEditTopic] = useState<boolean>(false);
  const [idx, setIdx] = useState<number>(0);
  const [newIdx, setNewIdx] = useState<number>(0);

  useEffect(() => {
    if (params.id) {
      dispatch(getSubject(params.id))
        .unwrap()
        .then((rs: ISubject) => {
          setData(rs);
        });
    }
  }, []);

  const handleRefresh = () => {
    if (params.id) {
      dispatch(getSubject(params.id))
        .unwrap()
        .then((rs: ISubject) => {
          setData(rs);
        });
    }
  };

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch(
      "https://randomuser.me/api/?results=10&inc=name,gender,email,nat,picture&noinfo"
    )
      .then((res) => res.json())
      .then((body) => {
        setDataNotification([...dataNotification, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const genExtra = (index: number) => (
    <div className="extra-style">
      <Dropdown.Button
        overlay={
          <Menu>
            <Menu.Item
              key=""
              onClick={() => {
                setEditTopic(true);
                setIdx(index);
              }}
            >
              Th??m b??i gi???ng
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item key="1">Ch???nh s???a</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="2">Sao ch??p</Menu.Item>
            <Menu.Divider />
            <Menu.Item key="3">X??a</Menu.Item>
          </Menu>
        }
        icon={
          <SettingOutlined
            onClick={(event) => {
              event.stopPropagation();
            }}
          />
        }
      ></Dropdown.Button>
    </div>
  );

  const onFinish = (values: any) => {
    console.debug(values.title[newIdx]);
    dispatch(createTopic({ subjectId: params.id, title: values.title[newIdx] }))
      .unwrap()
      .then((rs) => {
        handleRefresh();
        formTopic.resetFields();
      });
  };

  return (
    <div className="subDetail teacher-subject">
      <BreadcrumbComp
        title={data?.subName}
        prevFirstPageTitle="Danh s??ch m??n gi???ng d???y"
        prevFirstPage="teacher/subject"
      />
      <div className="Noti-Page">
        <div className="tab-notilist">
          <Tabs defaultActiveKey="1" type="card" size={"small"}>
            <TabPane tab="T???ng quan m??n h???c" key="1">
              <Form
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                layout="horizontal"
                form={form}
                style={{ width: "85%", marginLeft: "60px" }}
              >
                <Form.Item name="subcode" label="M?? m??n h???c">
                  <div>{data?.subCode}</div>
                </Form.Item>
                <Form.Item name="codesuject" label="M??n h???c">
                  <div>{data?.subName}</div>
                </Form.Item>
                <Form.Item name="teacher" label="Gi???ng vi??n">
                  <div>{data?.teacher.userName}</div>
                </Form.Item>
                <Form.Item name="description" label="M?? t???">
                  <TextArea rows={3} />
                </Form.Item>
                <Form.List name="names">
                  {(fields, { add, remove }, { errors }) => (
                    <>
                      {fields.map((field, index) => (
                        <Form.Item wrapperCol={{ span: 24 }} key={field.key}>
                          <Form.Item
                            {...field}
                            validateTrigger={["onChange", "onBlur"]}
                            rules={[
                              {
                                required: true,
                                whitespace: true,
                                message:
                                  "Vui l??ng nh???p ?????y ????? m?? t??? ho???c x??a tr?????ng n??y.",
                              },
                            ]}
                          >
                            <div className="add-description-input">
                              <Row>
                                <Col span={6}>
                                  <TextArea placeholder="Ti??u ?????" rows={3} />
                                </Col>
                                <Col span={17} offset={1}>
                                  <TextArea
                                    placeholder="N???i dung chi ti???t "
                                    rows={3}
                                  />
                                </Col>
                              </Row>
                              <div className="group-btn-add">
                                <Button
                                  className="cancel-btn"
                                  onClick={() => remove(field.name)}
                                >
                                  H???y
                                </Button>
                                <Button
                                  type="primary"
                                  style={{ marginLeft: "1rem" }}
                                >
                                  L??u
                                </Button>
                              </div>
                            </div>
                          </Form.Item>
                        </Form.Item>
                      ))}
                      <Form.Item>
                        <Button
                          type="primary"
                          onClick={() => add()}
                          className="add-description"
                          icon={<PlusOutlined />}
                        >
                          Th??m m?? t???
                        </Button>
                        <Form.ErrorList errors={errors} />
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              </Form>
            </TabPane>
            <TabPane tab="Danh s??ch ch??? ?????" key="2">
              {editTopic ? (
                <EditTopic topic={data?.topic[idx]} />
              ) : (
                <div
                  id="scrollableDiv"
                  style={{
                    height: 600,
                    overflow: "auto",
                    padding: "0 16px",
                  }}
                >
                  <Collapse
                    bordered={false}
                    className="site-collapse-custom-collapse"
                  >
                    {data?.topic.map((vl: ITopic, index: number) => (
                      <Panel
                        header={vl.title}
                        key={index}
                        className="site-collapse-custom-panel"
                        extra={genExtra(index)}
                      >
                        {vl.lesson.length !== 0 && (
                          <div className="accor-video">
                            <Tooltip title="Play">
                              <Button
                                size="large"
                                shape="circle"
                                icon={<CaretRightOutlined />}
                                onClick={() =>
                                  navigate(
                                    `/teacher/subject/viewsubject/${vl.id}`
                                  )
                                }
                              />
                            </Tooltip>
                          </div>
                        )}
                      </Panel>
                    ))}
                  </Collapse>
                  <Form form={formTopic} onFinish={onFinish}>
                    <Form.List name="title">
                      {(fields, { add, remove }, { errors }) => (
                        <>
                          {fields.map((field, index) => (
                            <Form.Item
                              className="add-description-input"
                              key={field.key}
                            >
                              <Form.Item
                                {...field}
                                validateTrigger={["onChange", "onBlur"]}
                                rules={[
                                  {
                                    required: true,
                                    whitespace: true,
                                    message:
                                      "Vui l??ng nh???p ?????y ????? m?? t??? ho???c x??a tr?????ng n??y.",
                                  },
                                ]}
                              >
                                <TextArea
                                  placeholder="Nh???p ti??u ????? c???a ch??? ????? m???i"
                                  rows={3}
                                />
                              </Form.Item>
                              <div className="group-btn-add">
                                <Button
                                  className="cancel-btn"
                                  onClick={() => remove(field.name)}
                                >
                                  H???y
                                </Button>
                                <Button
                                  type="primary"
                                  style={{ marginLeft: "1rem" }}
                                  onClick={() => {
                                    formTopic.submit();
                                    setNewIdx(index);
                                  }}
                                >
                                  L??u
                                </Button>
                              </div>
                            </Form.Item>
                          ))}
                          <Form.Item>
                            <Button
                              type="primary"
                              onClick={() => add()}
                              className="add-description"
                              icon={<PlusOutlined />}
                            >
                              Th??m ch??? ?????
                            </Button>
                            <Form.ErrorList errors={errors} />
                          </Form.Item>
                        </>
                      )}
                    </Form.List>
                  </Form>
                </div>
              )}
            </TabPane>
          </Tabs>
          <div className="tab-control">
            <Button
              onClick={() =>
                editTopic
                  ? setEditTopic(false)
                  : navigate(`/teacher/subject/subjectdetail/${params.id}`)
              }
              className="cancel-btn"
            >
              Hu???
            </Button>
            <Button type="primary" style={{ marginLeft: "1rem" }}>
              L??u v?? g???i ph?? duy???t
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
