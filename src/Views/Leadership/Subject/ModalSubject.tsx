import { UploadOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Upload } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { uploadFilesToFirebase } from "../../../Apis/Firebase";
import { setLoading } from "../../../redux/reducers/loading.reducer";
import {
  createSubject,
  updateSubject,
} from "../../../redux/reducers/subject.reducer";
import { ISubjectGroup } from "../../../redux/reducers/subjectgroup.reducer";
import { UserState } from "../../../redux/reducers/user.reducer";
import { AppDispatch } from "../../../redux/store";
import "./Subject.style.scss";

const year = [
  {
    name: "2018-2019",
    value: "2018-2019",
  },
  {
    name: "2019-2020",
    value: "2019-2020",
  },
  {
    name: "2020-2021",
    value: "2020-2021",
  },
  {
    name: "2021-2022",
    value: "2021-2022",
  },
];

const semester = [
  {
    name: "Học kì 1",
    value: 1,
  },
  {
    name: "Học kì 2",
    value: 2,
  },
  {
    name: "Học kì 3",
    value: 3,
  },
];

export const ModalSubject = (props: any) => {
  const dispatch: AppDispatch = useDispatch();
  const { Option } = Select;
  const { record, student, teacher, isModalOpen, setIsModalOpen, mode } = props;
  const [form] = Form.useForm();
  const dataSubGroup =
    useSelector((state: any) => state.subjectgroup.listSubjectGroup.results) ||
    [];
  const createAction: any = {
    title: "Tạo môn học mới",
    okText: "Tạo",
    subCode: {
      required: true,
      value: "",
      disabled: false,
    },
    subName: {
      required: true,
      value: "",
      disabled: false,
    },
    description: {
      value: "",
      disabled: false,
    },
    subGroup: {
      required: true,
      value: "",
      disabled: false,
    },
    teacher: {
      required: true,
      value: "",
      disabled: false,
    },
    student: {
      required: true,
      value: "",
      disabled: false,
    },
    image: {
      required: true,
      value: "",
      disabled: false,
    },
    year: {
      required: true,
      value: "",
      disabled: false,
    },
    semester: {
      required: true,
      value: 1,
      disabled: false,
    },
  };
  const [action, setAction] = useState(createAction);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        onFinish(values);
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (isModalOpen) {
      if (mode == "edit") {
        const students = record?.students.map((item: UserState) => item.id);
        setAction({
          title: "Chỉnh sửa môn học",
          okText: "Lưu",
          subCode: {
            required: false,
            value: record?.subCode,
            disabled: true,
          },
          subName: {
            required: true,
            value: record?.subName,
            disabled: false,
          },
          description: {
            value: record?.description,
            disabled: false,
          },
          subGroup: {
            required: true,
            value: record?.subGroup.id,
            disabled: false,
          },
          teacher: {
            required: true,
            value: record?.teacher.id,
            disabled: false,
          },
          student: {
            required: true,
            value: students,
            disabled: false,
          },
          image: {
            required: false,
            value: record?.image,
            disabled: false,
          },
          year: {
            required: false,
            value: record?.year,
            disabled: false,
          },
          semester: {
            required: false,
            value: record?.semester,
            disabled: false,
          },
        });
      } else {
        setAction(createAction);
      }
    } else {
      form.resetFields();
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (mode == "edit") {
      form.setFieldsValue({
        subCode: action.subCode.value,
        subName: action.subName.value,
        year: action.year.value,
        semester: action.semester.value,
        description: action.description.value,
        subGroup: action.subGroup.value,
        teacher: action.teacher.value,
        students: action.student.value,
      });
    }
  }, [action]);

  const onFinish = async (values: any) => {
    dispatch(setLoading(true));
    if (values.image) {
      const res: any = await dispatch(
        uploadFilesToFirebase(values.image.fileList, "Subject")
      );
      if (res) {
        values.image = res;
      }
    }
    let rs: any;
    if (record && mode == "edit") {
      rs = await dispatch(updateSubject({ id: record.id, payload: values }));
    } else {
      rs = await dispatch(createSubject(values));
    }
    dispatch(setLoading(false));
    if (!rs.payload.code) {
      setIsModalOpen(false);
    }
  };

  return (
    <Modal
      title={action.title}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      width="40%"
      className="cancel-form"
      okText={action.okText}
      cancelText="Huỷ"
    >
      <Form
        form={form}
        onFinish={onFinish}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <Form.Item
          name="subCode"
          label="Mã môn học"
          rules={[
            {
              required: action.subCode.required,
              message: "Hãy điền mã môn học",
            },
          ]}
        >
          <Input disabled={action.subCode.disabled} />
        </Form.Item>
        <Form.Item
          name="subName"
          label="Tên môn học"
          rules={[
            {
              required: action.subName.required,
              message: "Hãy điền tên môn học",
            },
          ]}
        >
          <Input disabled={action.subName.disabled} />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <TextArea disabled={action.description.disabled} rows={4} />
        </Form.Item>
        <Form.Item
          name="year"
          label="Niên khoá"
          rules={[
            {
              required: action.year.required,
              message: "Hãy chọn niên khoá",
            },
          ]}
        >
          <Select>
            {year.map((vl: any) => (
              <Option value={vl.value}>{vl.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="semester"
          label="Học kỳ"
          rules={[
            {
              required: action.semester.required,
              message: "Hãy chọn học kỳ",
            },
          ]}
        >
          <Select>
            {semester.map((vl: any) => (
              <Option value={vl.value}>{vl.name}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="subGroup"
          label="Tổ bộ môn"
          rules={[
            {
              required: action.subGroup.required,
              message: "Hãy chọn tổ môn học",
            },
          ]}
        >
          <Select>
            {dataSubGroup.map((vl: ISubjectGroup) => (
              <Option value={vl.id}>{vl.groupName}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="teacher"
          label="Giảng viên"
          rules={[
            {
              required: action.teacher.required,
              message: "Hãy chọn giảng viên",
            },
          ]}
        >
          <Select>
            <Option value="">Tất cả</Option>
            {teacher.map((vl: UserState) => (
              <Option value={vl.id}>{vl.userName}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="students"
          label="Sinh viên"
          rules={[
            {
              required: action.student.required,
              message: "Hãy thêm sinh viên",
            },
          ]}
          className="fit-content"
        >
          <Select mode="multiple" allowClear placeholder="Nhập hoặc chọn">
            {student?.map((vl: UserState) => (
              <Option key={vl.id}>{vl.userCode}</Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="image"
          label="Hình ảnh"
          rules={[
            {
              required: action.image.required,
              message: "Hãy chọn ảnh cho môn học",
            },
          ]}
        >
          <Upload
            beforeUpload={() => false}
            maxCount={1}
            className="upload-inline"
          >
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};
