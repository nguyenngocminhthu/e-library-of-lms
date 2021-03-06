import { CloseOutlined } from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Form,
  Input,
  Radio,
  Row,
  Select
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import lodash from "lodash";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import "suneditor/dist/css/suneditor.min.css";
import { BreadcrumbComp } from "../../../Components/Breadcrumb";
import {
  createQuestion,
  getQuestion,
  IQuestion,
  updateQuestion
} from "../../../redux/reducers/question.reducer";
import { getSubjects, ISubject } from "../../../redux/reducers/subject.reducer";
import {
  getSubjectGroups,
  ISubjectGroup
} from "../../../redux/reducers/subjectgroup.reducer";
import { UserState } from "../../../redux/reducers/user.reducer";
import { AppDispatch } from "../../../redux/store";
import "./style.scss";

export const CreateQuestions = () => {
  const { Option } = Select;
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const dataSubGroup = useSelector(
    (state: any) => state.subjectgroup.listSubjectGroup.results
  );
  const [answerNum, setAnswerNum] = useState<any[]>([]);
  const [quesType, setQuesType] = useState<number>(0);
  const [examType, setExamType] = useState<number>(0);
  const [dataSub, setDataSub] = useState<ISubject[]>([]);
  const user: UserState = JSON.parse(localStorage.getItem("user") || "{}");
  const params: any = useParams();

  useEffect(() => {
    dispatch(getSubjectGroups(999));
    if (params.id) {
      dispatch(getSubjects({ limit: 999 }))
        .unwrap()
        .then((rs) => {
          setDataSub(rs.results);
        });
      dispatch(getQuestion(params.id))
        .unwrap()
        .then((rs: IQuestion) => {
          setExamType(rs.examType);
          setQuesType(rs.quesType);
          form.setFieldsValue(rs);
          setAnswerNum(rs.answers);
          if (rs.correct.length === 1) {
            form.setFieldsValue({ correct: rs.correct[0] });
          } else {
            form.setFieldsValue({ correct: rs.correct });
          }
        });
    }
  }, [params.id]);

  const handleRefresh = () => {
    if (params.id) {
      dispatch(getSubjects({ limit: 999 }))
        .unwrap()
        .then((rs) => {
          setDataSub(rs.results);
        });
      dispatch(getQuestion(params.id))
        .unwrap()
        .then((rs: IQuestion) => {
          setExamType(rs.examType);
          setQuesType(rs.quesType);
          form.setFieldsValue(rs);
          setAnswerNum(rs.answers);
          if (rs.correct.length === 1) {
            form.setFieldsValue({ correct: rs.correct[0] });
          } else {
            form.setFieldsValue({ correct: rs.correct });
          }
        });
    }
  };

  const questionFinish = (values: any) => {
    values.correct = lodash.isArray(values.correct)
      ? values.correct
      : [values.correct];
    if (params.id) {
      dispatch(
        updateQuestion({ id: params.id, payload: { ...values, user: user.id } })
      )
        .unwrap()
        .then(() => {
          handleRefresh();
        });
    } else {
      dispatch(createQuestion({ ...values, user: user.id }))
        .unwrap()
        .then(() => {
          form.resetFields();
        });
    }
  };

  const handleSelect = (e: any) => {
    dispatch(getSubjects({ limit: 999, subGroup: e }))
      .unwrap()
      .then((rs) => {
        setDataSub(rs.results);
      });
  };

  return (
    <div className="sub-exam-bank">
      <BreadcrumbComp
        title="Th??m c??u h???i"
        prevFirstPageTitle="Ng??n h??ng c??u h???i"
        prevFirstPage="teacher/questions"
      />
      <Form
        className="new-exam-form"
        form={form}
        onFinish={questionFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Row>
          <h3>
            <b>Ch???n t??? b??? m??n - m??n h???c:</b>
          </h3>
          <Col span={10}>
            <Form.Item
              name="subjectgroup"
              label="T??? b??? m??n"
              rules={[{ required: true }]}
            >
              <Select
                // disabled={params.id}
                onChange={(e: any) => handleSelect(e)}
              >
                {dataSubGroup?.map((vl: ISubjectGroup) => (
                  <Option key={vl.id} value={vl.id}>
                    {vl.groupName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name="examType"
              label="H??nh th???c"
              rules={[{ required: true }]}
            >
              <Radio.Group
                defaultValue={0}
                onChange={(e) => setExamType(e.target.value)}
              >
                <Radio value={0}>Tr???c nghi???m</Radio>
                <Radio value={1}>T??? lu???n</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={10} offset={4}>
            <Form.Item
              name="subject"
              label="M??n h???c"
              rules={[{ required: true }]}
            >
              <Select disabled={dataSub.length === 0 || params.id}>
                {dataSub?.map((vl: ISubject) => (
                  <Option key={vl.id} value={vl.id}>
                    {vl.subName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="level" label="????? kh??" rules={[{ required: true }]}>
              <Radio.Group defaultValue={0}>
                <Radio value={0}>D???</Radio>
                <Radio value={1}>Trung b??nh</Radio>
                <Radio value={2}>Kh??</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>

        <div className="body-bank">
          <div className="question-detail">
            <Form.Item labelCol={{ span: 4 }} name="quesName" label="C??u h???i :">
              <TextArea rows={4} />
            </Form.Item>
            {examType === 0 ? (
              <>
                <Form.Item
                  labelCol={{ span: 4 }}
                  name="quesType"
                  label="C??u tr??? l???i"
                >
                  <Radio.Group onChange={(e) => setQuesType(e.target.value)}>
                    <Radio value={0}>M???t ????p ??n</Radio>
                    <Radio value={1}>Nhi???u ????p ??n</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.List
                  name="answers"
                  rules={[
                    {
                      validator: async (_, names) => {
                        if (!names || names.length < 2) {
                          return Promise.reject(new Error("??t nh???t 2 ????p ??n"));
                        }
                      },
                    },
                  ]}
                >
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => (
                        <Form.Item
                          labelCol={{ span: 4 }}
                          label={`????p ??n ${
                            index === 0
                              ? "A"
                              : index === 1
                              ? "B"
                              : index === 2
                              ? "C"
                              : "D"
                          }`}
                          required={false}
                          key={field.key}
                          className="answer-input"
                        >
                          <Form.Item
                            {...field}
                            validateTrigger={["onChange", "onBlur"]}
                          >
                            <Input />
                          </Form.Item>
                          {fields.length > 1 ? (
                            <CloseOutlined
                              className="dynamic-delete-button"
                              onClick={() => {
                                let count = answerNum;
                                count.pop();
                                remove(field.name);
                                setAnswerNum([...count]);
                              }}
                            />
                          ) : null}
                        </Form.Item>
                      ))}
                      <Form.Item
                        wrapperCol={{ span: 22 }}
                        className="answer-form"
                      >
                        <Button
                          className="default-btn"
                          type="default"
                          onClick={() => {
                            add();
                            setAnswerNum([...answerNum, fields.length]);
                          }}
                          disabled={fields.length === 4}
                        >
                          Th??m ????p ??n
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
                <Form.Item
                  labelCol={{ span: 4 }}
                  name="correct"
                  label="????p ??n ????ng"
                >
                  {quesType === 0 ? (
                    <Radio.Group>
                      {answerNum.map((vl, idx) => (
                        <Radio key={vl} value={idx}>
                          {idx === 0
                            ? "A"
                            : idx === 1
                            ? "B"
                            : idx === 2
                            ? "C"
                            : "D"}
                        </Radio>
                      ))}
                    </Radio.Group>
                  ) : (
                    <Checkbox.Group>
                      {answerNum.map((vl, idx) => (
                        <Checkbox key={vl} value={idx}>
                          {idx === 0
                            ? "A"
                            : idx === 1
                            ? "B"
                            : idx === 2
                            ? "C"
                            : "D"}
                        </Checkbox>
                      ))}
                    </Checkbox.Group>
                  )}
                </Form.Item>
              </>
            ) : (
              <div>
                <Form.Item
                  labelCol={{ span: 4 }}
                  name="correctEssay"
                  label="????p ??n ????ng"
                >
                  <TextArea rows={16} />
                </Form.Item>
              </div>
            )}
          </div>
        </div>
        <div className="footer-btn" style={{ justifyContent: "center" }}>
          <Button
            onClick={() => navigate("/teacher/questions")}
            className="default-btn"
          >
            Hu???
          </Button>
          <Button
            style={{ marginLeft: "1rem" }}
            type="primary"
            onClick={() => form.submit()}
          >
            L??u
          </Button>
        </div>
      </Form>
    </div>
  );
};
