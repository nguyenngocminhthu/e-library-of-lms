import { Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import { Navigate, Outlet } from "react-router";
import { FooterComp } from "../Layout/Footer/Footer";
import { HeaderComp } from "../Layout/Header/Header";
import { StudentSidebar } from "./Sidebar/StudentSidebar";

export const StudentLayout = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div>
      {user.role === "student" ? (
        <Layout style={{ minHeight: "100vh" }}>
          <StudentSidebar />
          <Layout className="site-layout">
            <HeaderComp />
            <Content style={{ margin: "16px 16px" }}>
              <div
                className="site-layout-background"
                style={{
                  padding: "10px 24px 24px 24px",
                  minHeight: 360,
                }}
              >
                <Outlet />
              </div>
            </Content>
            <FooterComp />
          </Layout>
        </Layout>
      ) : (
        <Navigate to="/404" />
      )}
    </div>
  );
};
