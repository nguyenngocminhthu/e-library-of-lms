import { useNavigate } from "react-router";
import cover from "../../shared/img/cover2x.png";
import logo from "../../shared/img/logo-system.png";
import "./Cover.style.scss";
const Cover = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="cover">
      <div className="coverContent">
        <h1 className="h1-content">LMS - Learning Management System</h1>
        <button
          className="coverButton"
          onClick={() =>
            user.role === "leadership"
              ? navigate("/home")
              : user.role === "teacher"
              ? navigate("/teacher/home")
              : user.role === "student"
              ? navigate("/student/home")
              : navigate("/login")
          }
        >
          E-Library
        </button>

        <div className="coverLogo">
          <p className="text-label">
            Hệ thống giáo dục được sưu tầm và phát triển bởi sinh viên UTE
          </p>
          <img className="imgLogo" src={logo} alt="logo" />
        </div>
      </div>
      <div className="coverImg">
        <img src={cover} alt="cover" />
        <p className="signCover">
          Shorten the distance, save time, high efficiency, support anytime,
          anywhere, ...
        </p>
      </div>
    </div>
  );
};

export default Cover;
