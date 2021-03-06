import { SettingOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Checkbox,
  Divider,
  Form,
  Input,
  List,
  Modal,
  Skeleton,
  Space,
  Tabs,
  Tooltip
} from "antd";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import SunEditor from "suneditor-react";
import { BreadcrumbComp } from "../../../Components/Breadcrumb";
import { ISelect, SelectComp } from "../../../Components/Select";
import { createNoti } from "../../../redux/reducers/noti.reducer";
import {
  getSubject,
  getSubjects,
  ISubject
} from "../../../redux/reducers/subject.reducer";
import { ITopic } from "../../../redux/reducers/topic.reducer";
import { UserState } from "../../../redux/reducers/user.reducer";
import { AppDispatch } from "../../../redux/store";
import "./style.scss";

export const Notification = () => {
  const { TabPane } = Tabs;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const user: UserState = JSON.parse(localStorage.getItem("user") || "{}");
  const [dataClass, setDataClass] = useState<ISelect[]>([]);
  const [form] = Form.useForm();
  const [topic, setTopic] = useState<ISelect[]>([]);

  useEffect(() => {
    loadMoreData();

    dispatch(getSubjects({ limit: 999, teacher: user.id }))
      .unwrap()
      .then((rs: any) => {
        let arr: ISelect[] = [];
        rs.results.forEach((vl: ISubject) => {
          arr.push({ name: vl.subName, value: vl.id });
        });
        setDataClass(arr);
      });
  }, []);

  const handleRefresh = () => {
    dispatch(getSubjects({ limit: 999, teacher: user.id }))
      .unwrap()
      .then((rs: any) => {
        let arr: ISelect[] = [];
        rs.results.forEach((vl: ISubject) => {
          arr.push({ name: vl.subName, value: vl.id });
        });
        setDataClass(arr);
      });
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setTopic([]);
    form.resetFields();
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
        setData([...data, ...body.results]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const handleSelect = (e: any) => {
    dispatch(getSubject(e))
      .unwrap()
      .then((rs: ISubject) => {
        console.debug(rs);

        let arr: ISelect[] = [];
        rs.topic.forEach((vl: ITopic) => {
          arr.push({ name: vl.title, value: vl.id });
        });
        setTopic(arr);
      });
  };

  const onFinish = (values: any) => {
    dispatch(
      createNoti({
        ...values,
        from: user.id,
      })
    )
      .unwrap()
      .then(() => {
        handleRefresh();
        handleCancel();
      });
  };

  return (
    <div className="Noti-Page">
      <BreadcrumbComp title="Th??ng b??o" />
      <div className="tab-notilist">
        <Tabs defaultActiveKey="1" type="card" size={"small"}>
          <TabPane tab="Th??ng b??o ng?????i d??ng" key="1">
            <div
              id="scrollableDiv"
              style={{
                height: 400,
                overflow: "auto",
                padding: "0 16px",
                border: "1px solid rgba(140, 140, 140, 0.35)",
              }}
            >
              <InfiniteScroll
                dataLength={data.length}
                next={loadMoreData}
                hasMore={data.length < 50}
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>It is all, nothing more ????</Divider>}
                scrollableTarget="scrollableDiv"
              >
                <List
                  dataSource={data}
                  renderItem={(item: any) => (
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        avatar={
                          <Checkbox>
                            <Avatar src={item.picture.large} />
                          </Checkbox>
                        }
                        title={
                          <a href="https://ant.design">{item.name.last}</a>
                        }
                        description={item.email}
                      />
                      <div>5 ph??t tr?????c</div>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </TabPane>
          <TabPane tab="Th??ng b??o h??? th???ng" key="2">
            <div
              id="scrollableDiv"
              style={{
                height: 400,
                overflow: "auto",
                padding: "0 16px",
                border: "1px solid rgba(140, 140, 140, 0.35)",
              }}
            >
              <InfiniteScroll
                dataLength={data.length}
                next={loadMoreData}
                hasMore={data.length < 50}
                loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
                endMessage={<Divider plain>It is all, nothing more ????</Divider>}
                scrollableTarget="scrollableDiv"
              >
                <List
                  dataSource={data}
                  renderItem={(item: any) => (
                    <List.Item key={item.id}>
                      <List.Item.Meta
                        avatar={
                          <Checkbox>
                            <Avatar src={item.picture.large} />
                          </Checkbox>
                        }
                        title={
                          <a href="https://ant.design">{item.name.last}</a>
                        }
                        description={item.email}
                      />
                      <div>5 ph??t tr?????c</div>
                    </List.Item>
                  )}
                />
              </InfiniteScroll>
            </div>
          </TabPane>
        </Tabs>
        <div className="tab-control">
          <Space className="" size="middle">
            <Tooltip title="Setting">
              <Button
                className="setting-btn-icon"
                type="link"
                onClick={() => navigate("/notification/setting")}
                icon={<SettingOutlined style={{ fontSize: "36px" }} />}
              />
            </Tooltip>
          </Space>
          <div className="line"></div>
          <Button type="primary" onClick={showModal}>
            Th??m th??ng b??o
          </Button>
          <Modal
            title="G???i th??ng b??o m???i"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={() => {
              handleCancel();
            }}
            footer={[
              <Button onClick={() => form.submit()} type="primary">
                G???i
              </Button>,
            ]}
          >
            <Form
              layout="vertical"
              form={form}
              onFinish={onFinish}
              className="header-notification"
            >
              <Form.Item name="subject" rules={[{ required: true }]}>
                <SelectComp
                  textLabel="Ch???n m??n gi???ng d???y"
                  className="label-style-item"
                  dataString={dataClass}
                  onChange={(e: any) => handleSelect(e)}
                />
                <Form.Item name="topic" rules={[{ required: true }]}>
                  <SelectComp
                    textLabel="Ch???n ch??? ?????"
                    className="label-style-item"
                    dataString={topic}
                    disabled={topic.length === 0}
                  />
                </Form.Item>
              </Form.Item>
              <Form.Item
                name="title"
                className="label-style-item"
                label="Ti??u ?????"
                rules={[{ required: true }]}
              >
                <Input placeholder="Ti??u ?????" />
              </Form.Item>

              <Form.Item
                name="content"
                label="N???i dung"
                className="label-style-item"
                rules={[{ required: true }]}
              >
                <SunEditor
                  placeholder="N???i dung"
                  setOptions={{
                    defaultTag: "div",
                    minHeight: "250px",
                    showPathLabel: false,
                    buttonList: [
                      ["undo", "redo"],
                      ["fontSize", "bold", "underline", "italic"],
                      ["align", "image"],
                      ["list", "outdent", "indent"],
                      ["fullScreen"],
                    ],
                  }}
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};
