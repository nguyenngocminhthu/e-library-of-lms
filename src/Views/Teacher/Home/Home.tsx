import { DoubleRightOutlined } from "@ant-design/icons";
import {
  Avatar,
  Card,
  Col,
  Divider,
  List,
  Row,
  Skeleton,
  Typography
} from "antd";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useDispatch, useSelector } from "react-redux";
import { AnaCard } from "../../../Components/AnaCard";
import { BreadcrumbComp } from "../../../Components/Breadcrumb";
import { SelectComp } from "../../../Components/Select";
import { getBanks, totalBank } from "../../../redux/reducers/banks.reducer";
import { getFiles, totalFile } from "../../../redux/reducers/file.reducer";
import {
  getLessons,
  totalLesson
} from "../../../redux/reducers/lesson.reducer";
import {
  getSubjects,
  ISubject,
  totalSubject
} from "../../../redux/reducers/subject.reducer";
import { UserState } from "../../../redux/reducers/user.reducer";
import { AppDispatch } from "../../../redux/store";
import ppt from "../../../shared/img/ppt.png";
import WEB23 from "../../../shared/img/WEB23.png";
interface IData {
  fileName: string;
  subject: string;
  fileCode: string;
  teacher: string;
  avt: string;
}

interface IFile {
  fileName: string;
  createdAt: string;
  subject: string;
  teacher: string;
  avt: string;
}

export const Home = () => {
  const { Title } = Typography;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>([]);
  const user: UserState = JSON.parse(localStorage.getItem("user") || "{}");
  const subjects: any = useSelector(totalSubject);
  const lessons: any = useSelector(totalLesson);
  const files: any = useSelector(totalFile);
  const exams = useSelector(totalBank);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    Promise.all([
      dispatch(getFiles({ limit: 999, user: user.id })),
      dispatch(getLessons({ limit: 999, user: user.id })),
      dispatch(getBanks({ limit: 999, user: user.id })),
      dispatch(getSubjects({ limit: 999, teacher: user.id })),
    ]);
  }, []);

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

  useEffect(() => {
    loadMoreData();
  }, []);

  const year = [
    {
      value: "2020-2021",
      name: "2020-2021",
    },
    {
      value: "2021-2022",
      name: "2021-2022",
    },
  ];

  const listData: any[] | undefined = [];
  for (let i = 0; i < 23; i++) {
    listData.push({
      fileName: "Ph??t tri???n website",
      subject: "Web Design",
      fileCode: `WEB${i}`,
      teacher: "Hoa Hoa",
      avt: `${WEB23}`,
    });
  }

  const listFile: any[] | undefined = [];
  for (let i = 0; i < 10; i++) {
    listFile.push({
      fileName: "Th????ng m???i ??i???n t??? l?? g??.docx",
      createdAt: "12:01 12/12/2020",
      subject: "Th????ng m???i ??i???n t???",
      teacher: "Hoa Hoa",
      avt: `${ppt}`,
    });
  }
  return (
    <div className="home">
      <BreadcrumbComp title="Trang ch???" />
      <Row>
        <Col span={4} style={{ display: "flex", alignItems: "center" }}>
          <SelectComp
            textLabel="Ni??n kho??"
            defaultValue={year[0].value}
            dataString={year}
          />
        </Col>
        <Col span={20}>
          <Row>
            <Col span={5} offset={1}>
              <AnaCard
                number={subjects}
                content="M??n gi???ng d???y"
                classname="anacard"
              />
            </Col>
            <Col span={5} offset={1}>
              <AnaCard
                number={lessons}
                content="B??i gi???ng"
                classname="anacard-blue"
              />
            </Col>
            <Col span={5} offset={1}>
              <AnaCard
                number={files}
                content="T??i nguy??n"
                classname="anacard"
              />
            </Col>
            <Col span={5} offset={1}>
              <AnaCard
                number={exams}
                content="????? thi v?? ki???m tra"
                classname="anacard-blue"
              />
            </Col>
          </Row>
        </Col>
      </Row>
      <div className="wrapper-list">
        <div className="title">M??n gi???ng d???y</div>
        <List
          grid={{ gutter: 30, column: 4 }}
          dataSource={user.recentSubject}
          pagination={{
            position: "top",
            onChange: (page) => {
              console.log(page);
            },
            pageSize: 8,
          }}
          renderItem={(item: ISubject) => (
            <List.Item key={item.subCode}>
              <Card>
                <Row>
                  <Col span={8} className="btn-img">
                    <img src={item.image} alt="avt" />
                  </Col>
                  <Col span={15} offset={1}>
                    <h5>{item.subName}</h5>
                    <h6>{item.subCode}</h6>

                    <span style={{ position: "absolute", bottom: 0 }}>
                      ??ang d???y 5 l???p
                    </span>
                  </Col>
                </Row>
              </Card>
            </List.Item>
          )}
        />
      </div>
      <Row>
        <Col span={12}>
          <div className="wrapper-list">
            <div className="title">T???p ri??ng t?? t???i l??n g???n ????y</div>
            <List
              grid={{ gutter: 30, column: 2 }}
              dataSource={listFile}
              pagination={{
                position: "top",
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 2,
              }}
              renderItem={(item: IFile) => (
                <List.Item key={item.fileName}>
                  <Card>
                    <Row>
                      <Col span={6}>
                        <img src={ppt} alt="file" />
                      </Col>
                      <Col span={17} offset={1}>
                        <Title ellipsis level={5}>
                          {item.fileName}
                        </Title>
                        <p>{item.createdAt}</p>
                        <h6>{item.subject}</h6>
                        <span>Gi???ng vi??n: {item.teacher}</span>
                      </Col>
                    </Row>
                  </Card>
                </List.Item>
              )}
            />
            <span style={{ color: "grey" }}>
              <i>Hi???n th??? 10 t???p t??i li???u ???? xem g???n ????y nh???t</i>
            </span>
          </div>
        </Col>
        <Col span={11} offset={1}>
          <Card className="wrapper">
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h5>Th??ng b??o ch??a ?????c</h5>
              <span style={{ marginTop: "0.5rem", fontStyle: "italic" }}>
                Xem t???t c??? th??ng b??o <DoubleRightOutlined />
              </span>
            </div>

            <Card className="inside"
            style={{
              height: 250,
              overflow: 'auto',
            }}>
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
                        avatar={<Avatar src={item.picture.large} />}
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
            </Card>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
