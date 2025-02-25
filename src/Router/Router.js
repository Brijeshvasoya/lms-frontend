import React, { memo, useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { routes } from "./Routes";
import Navbar from "../ui/components/Navbar";
import Sidebar from "../ui/components/Sidebar";
import Spinner from "../ui/components/Spinner";
import {GET_USER} from "./query"

const PublicRoute = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const { data, loading } = useQuery(GET_USER, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const role = data?.GetUser?.role;

  useEffect(() => {
    if (loading) return;

    if (token) {
      if (role !== "admin") {
        navigate("/dashboard");
      } else {
        navigate("/admin-dashboard");
      }
    }
  }, [loading, token, navigate, role]);

  if (loading) return <Spinner />;
  if (token) return null;
  return <Component />;
};

const ProtectRoute = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const { data, error, loading } = useQuery(GET_USER, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const role = data?.GetUser?.role;

  useEffect(() => {
    if (loading) return;

    if (!token) {
      navigate("/");
    } else if (role === "admin") {
      navigate(-1);
    }
  }, [loading, token, navigate, role]);

  if (loading) return <Spinner />;
  if (error) {
    localStorage.clear();
    navigate("/");
    return null;
  }

  return (
    <div className="flex">
      <Sidebar user={data?.GetUser} />
      <div className="w-full">
        <Navbar user={data?.GetUser} />
        <div className="px-4">
          <Component user={data?.GetUser} />
        </div>
      </div>
    </div>
  );
};

const AdminRoute = (props) => {
  const { Component } = props;
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const { data, error, loading } = useQuery(GET_USER, {
    fetchPolicy: "network-only",
    context: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  });

  const role = data?.GetUser?.role;

  useEffect(() => {
    if (loading) return;

    if (!token) {
      navigate("/");
      return;
    }
    if (role !== "admin") {
      navigate("/dashboard");
      return;
    }
  }, [loading, token, navigate, role]);

  if (loading) return <Spinner />;
  if (error) {
    localStorage.clear();
    navigate("/");
    return null;
  }

  return (
    <div className="flex">
      <Sidebar user={data?.GetUser} />
      <div className="w-full">
        <Navbar user={data?.GetUser} />
        <div className="px-4">
          <Component user={data?.GetUser} />
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