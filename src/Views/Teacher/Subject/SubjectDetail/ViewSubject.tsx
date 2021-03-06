import {
  FileFilled,
  HeartFilled,
  HeartOutlined,
  MessageOutlined,
  PlayCircleFilled,
} from "@ant-design/icons";
import { Avatar, Button, Col, Collapse, Form, Input, Row, Tabs } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { useEffect, useState } from "react";
import ReactPlayer from "react-player";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { BreadcrumbComp } from "../../../../Components/Breadcrumb";
import { SelectComp } from "../../../../Components/Select";
import { getLesson, ILesson } from "../../../../redux/reducers/lesson.reducer";
import { INoti } from "../../../../redux/reducers/noti.reducer";
import { createQA, IQA, updateQA } from "../../../../redux/reducers/QA.reducer";
import { getTopic, ITopic } from "../../../../redux/reducers/topic.reducer";
import { UserState } from "../../../../redux/reducers/user.reducer";
import { AppDispatch } from "../../../../redux/store";
import { ModalReply } from "../../../Student/Subject/ModalReply";
import "../style.scss";

export const ViewSubject = () => {
  const { Panel } = Collapse;
  const { TabPane } = Tabs;
  const params = useParams<{ id: string }>();
  const [question, setQuestion] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const [data, setData] = useState<ITopic>();
  const [video, setVideo] = useState<any>();
  const [form] = Form.useForm();
  const [lesson, setLesson] = useState<ILesson>();
  const [qa, setQa] = useState<IQA[]>([]);
  const user: UserState = JSON.parse(localStorage.getItem("user") || "{}");
  const [idQA, setIdQA] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);
  const [idx, setIdx] = useState<number>(0);
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    if (params.id) {
      dispatch(getTopic(params.id))
        .unwrap()
        .then((rs: ITopic) => {
          setData(rs);
          setVideo(rs.lesson[0].video);
          dispatch(getLesson(rs.lesson[0].id))
            .unwrap()
            .then((rs) => {
              setLesson(rs);
              setQa(rs.QA);
            });
          setLesson(rs.lesson[0]);
        });
    }
  }, [params.id]);

  const handleRefresh = () => {
    if (params.id) {
      dispatch(getTopic(params?.id))
        .unwrap()
        .then((rs: ITopic) => {
          setData(rs);
          setVideo(rs.lesson[idx].video);
          dispatch(getLesson(rs.lesson[idx].id))
            .unwrap()
            .then((rs) => {
              setLesson(rs);
              setQa(rs.QA);
            });
          setLesson(rs.lesson[idx]);
        });
    }
  };

  const subject = [
    {
      name: "Th????ng m???i ??i???n t???",
      value: "TMDT",
    },
    {
      name: "Nguy??n l?? k??? to??n",
      value: "NLKT",
    },
    {
      name: "H??? th???ng th??ng tin",
      value: "HTTT",
    },
    {
      name: "Lu???t th????ng m???i",
      value: "LTM",
    },
    {
      name: "Ng??n h??ng ",
      value: "NG",
    },
  ];

  const sorta = [
    { name: "S???p x???p theo m???i nh???t", value: "Newest" },
    { name: "S???p x???p theo c?? nh???t", value: "Oldest" },
    { name: "Nhi???u t????ng t??c nh???t", value: "Interactive" },
  ];

  const sortb = [
    { name: "L???c nh???ng c??u h???i theo", value: "question" },
    { name: "C??u h???i m???i nh???t", value: "NewestQues" },
    { name: "C??u h???i c?? nh???t", value: "OldestQues" },
    { name: "C??u h???i ???????c quan t??m nh???t", value: "Carest" },
  ];

  const onFinish = (values: any) => {
    dispatch(
      createQA({
        ...values,
        lesson: lesson?.id,
        user: user.id,
        subject: data?.subjectId.id,
      })
    )
      .unwrap()
      .then(() => {
        setQuestion(false);
        handleRefresh();
      });
  };

  return (
    <div className="viewSub viewSub-student">
      <BreadcrumbComp
        title="Xem b??i gi???ng"
        prevFirstPageTitle="Danh s??ch m??n h???c"
        prevSecondPageTitle="Danh s??ch ch??? ?????"
        prevFirstPage="teacher/subject"
        prevSecondPage={`teacher/subject/subjectdetail/${data?.subjectId.id}`}
      />
      <Row>
        <Col span={16}>
          {data?.lesson[idx].url === undefined ? (
            <video
              src={video}
              style={{ width: "100%", height: "50vh" }}
              controls
            ></video>
          ) : (
            <ReactPlayer url={url} />
          )}

          <Tabs defaultActiveKey="1">
            <TabPane tab="T???ng quan" key="1">
              <Row>
                <Col span={3}>Gi???ng vi??n:</Col>
                <Col span={21}>{data?.subjectId.teacher.userName}</Col>
                <Col span={3}>M?? t???:</Col>
                <Col
                  span={21}
                  className={data?.description !== "" ? "scroll-box" : ""}
                >
                  {data?.description}
                </Col>
              </Row>
            </TabPane>
            <TabPane tab="H???i ????p" key="2">
              {question ? (
                <Form
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  form={form}
                  onFinish={onFinish}
                >
                  <Form.Item
                    label="Ti??u ????? c??u h???i"
                    name="title"
                    rules={[{ required: true }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    label="N???i dung"
                    name="content"
                    rules={[{ required: true }]}
                  >
                    <TextArea rows={4} />
                  </Form.Item>
                  <div className="footer-btn">
                    <Button
                      className="default-btn"
                      onClick={() => setQuestion(false)}
                    >
                      Hu???
                    </Button>
                    <Button
                      onClick={() => form.submit()}
                      style={{ marginLeft: "1rem" }}
                      type="primary"
                    >
                      G???i
                    </Button>
                  </div>
                </Form>
              ) : (
                <>
                  <Row>
                    <Col span={20} className="flex-col">
                      <SelectComp
                        defaultValue="T???t c??? m??n h???c"
                        dataString={subject}
                      />
                      <SelectComp
                        defaultValue="S???p x???p theo m???i nh???t"
                        dataString={sorta}
                      />
                      <SelectComp
                        defaultValue="L???c nh???ng c??u h???i theo"
                        dataString={sortb}
                      />
                    </Col>
                    <Col span={4}>
                      <Button onClick={() => setQuestion(true)}>
                        ?????t c??u h???i
                      </Button>
                    </Col>
                  </Row>
                  <div className="scroll-box question">
                    {qa.map((value: IQA) => (
                      <Row className="sub-content">
                        <Col span={2}>
                          <Avatar
                            src={
                              value.user.avt ||
                              "https://banner2.cleanpng.com/20180603/jx/kisspng-user-interface-design-computer-icons-default-stephen-salazar-photography-5b1462e1b19d70.1261504615280626897275.jpg"
                            }
                          />
                        </Col>
                        <Col span={21} offset={1}>
                          <div className="flex-row">
                            <h4>{value.user.userName}</h4>
                            <span
                              style={{
                                marginLeft: "1rem",
                                color: "gray",
                                fontSize: "12px",
                              }}
                            >
                              {value.title}
                            </span>
                            <span
                              style={{
                                marginLeft: "auto",
                                color: "gray",
                                fontStyle: "italic",
                                fontSize: "12px",
                              }}
                            >
                              {moment(value.createdAt).fromNow()}
                            </span>
                          </div>
                          {value.content}
                          <div className="flex-row">
                            {value.likes.includes(user.id) ? (
                              <HeartFilled
                                onClick={() =>
                                  dispatch(
                                    updateQA({
                                      id: value.id,
                                      payload: { likes: [user.id] },
                                    })
                                  )
                                    .unwrap()
                                    .then((rs) => handleRefresh())
                                }
                                style={{ color: "red" }}
                              />
                            ) : (
                              <HeartOutlined
                                onClick={() =>
                                  dispatch(
                                    updateQA({
                                      id: value.id,
                                      payload: { likes: [user.id] },
                                    })
                                  )
                                    .unwrap()
                                    .then((rs) => handleRefresh())
                                }
                              />
                            )}

                            <span className="gray">{value.likes.length}</span>
                            <MessageOutlined
                              onClick={() => {
                                setIdQA(value.id);
                                setVisible(true);
                              }}
                              style={{ marginLeft: "2rem" }}
                            />
                            <span className="gray">{value.answers.length}</span>
                          </div>
                        </Col>
                      </Row>
                    ))}
                  </div>
                </>
              )}
            </TabPane>
            <TabPane tab="Th??ng b??o m??n h???c" key="3">
              <div className="scroll-box sub-noti">
                {data?.noti.map((value: INoti) => {
                  return (
                    <Row className="noti-detail">
                      <Col span={7}>
                        <Row>
                          <Col span={3}>
                            <Avatar
                              src={
                                value.from.avt ||
                                "https://banner2.cleanpng.com/20180603/jx/kisspng-user-interface-design-computer-icons-default-stephen-salazar-photography-5b1462e1b19d70.1261504615280626897275.jpg"
                              }
                            />
                          </Col>
                          <Col
                            span={20}
                            offset={1}
                            style={{ lineHeight: "normal" }}
                          >
                            <h4 style={{ marginBottom: "0" }}>
                              {value.from.userName}
                            </h4>
                            <div className="flex-row">
                              <span className="time">Gi??o vi??n</span>
                              <span
                                style={{ marginLeft: "2rem" }}
                                className="time"
                              >
                                {moment(value.createdAt).fromNow()}
                              </span>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={17}>
                        <h3>{value.title}</h3>
                        <div
                          dangerouslySetInnerHTML={{ __html: value.content }}
                        />
                      </Col>
                    </Row>
                  );
                })}
              </div>
            </TabPane>
          </Tabs>
        </Col>
        <Col span={8}>
          <h1>N???i dung m??n h???c</h1>
          <hr />
          {data?.lesson.map((value: ILesson, index: number) => (
            <Collapse
              bordered={false}
              className="site-collapse-custom-collapse"
              key={value.id}
            >
              <Panel
                header={
                  <Row>
                    <Col span={18}>
                      B??i {index + 1}: {value.title}
                    </Col>
                    <Col span={6} className="time">
                      1/2|45 ph??t
                    </Col>
                  </Row>
                }
                key={value.id}
                className="site-collapse-custom-panel scrollbar"
              >
                <Row
                  className="sub-content"
                  onClick={() => {
                    setVideo(value.video);
                    setIdx(index);
                    setUrl(value.url);
                    dispatch(getLesson(value.id))
                      .unwrap()
                      .then((rs) => {
                        setLesson(rs);
                        setQa(rs.QA);
                      });
                  }}
                >
                  <Col span={4}>
                    <PlayCircleFilled />
                  </Col>
                  <Col span={19} offset={1}>
                    <h4>{value.title}</h4>
                    <span>30 ph??t</span>
                  </Col>
                </Row>
                <br />
                {value.file.map((item: string, index: number) => {
                  const vid = item.split("/");
                  const fileType = vid[vid.length - 1].split("?")[0];
                  const fileName = fileType.split("%2F")[1];

                  return (
                    <a href={item} target="_blank">
                      <Row className="sub-content">
                        <Col span={4}>
                          <FileFilled />
                        </Col>
                        <Col span={19} offset={1}>
                          <h4>
                            {index + 1}. {fileName}
                          </h4>
                        </Col>
                      </Row>
                      <br />
                    </a>
                  );
                })}
              </Panel>
            </Collapse>
          ))}
        </Col>
      </Row>
      <ModalReply
        visible={visible}
        setVisible={setVisible}
        data={idQA}
        handleRefresh={handleRefresh}
      />
    </div>
  );
};
