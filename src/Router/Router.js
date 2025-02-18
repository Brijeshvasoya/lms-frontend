import React, { memo, useEffect, Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { routes } from "./Routes";
import Navbar from "../ui/components/Navbar";
import Sidebar from "../ui/components/Sidebar";
import Spinner from "../ui/components/Spinner";

const PublicRoute = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  const activeUser = JSON.parse(localStorage.getItem("active_user"));
  const role = activeUser?.role;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      if (role !== "admin") {
        navigate("/dashboard");
      } else {
        navigate("/admin-dashboard");
      }
      return;
    }
  }, [token, navigate, role]);
  if (token) {
    return null;
  }
  return <Component />;
};

const ProtectRoute = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  const activeUser = JSON.parse(localStorage.getItem("active_user"));
  const role = activeUser?.role;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
    if (role === "admin") {
      navigate(-1);
    }
  }, [token, navigate, role]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <div>
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
        <div className="p-4">
          <Component />
        </div>
      </div>
    </div>
  );
};

const AdminRoute = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  const activeUser = JSON.parse(localStorage.getItem("active_user"));
  const role = activeUser?.role;
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    if (role !== "admin") {
      navigate("/dashboard");
      return;
    }
  }, [token, navigate, role]);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex">
      <Sidebar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
      />
      <div>
        <Navbar
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
        <div className="p-4">
          <Component />
        </div>
      </div>
    </div>
  );
};

export const Routers = memo(() => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Spinner />}>
        <Routes>
          {routes.map((route, index) => {
            const Component = route.element;
            if (route.layout === "user") {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={<PublicRoute Component={Component} />}
                />
              );
            }
            if (route.layout === "admin") {
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={<AdminRoute Component={Component} />}
                />
              );
            }
            return (
              <Route
                key={index}
                path={route.path}
                element={<ProtectRoute Component={Component} />}
              />
            );
          })}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
});
