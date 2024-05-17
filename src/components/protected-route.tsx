// 로그인한 사용자가 보는 곳
// 로그인하지 않은 경우, 리다이렉트

import React from "react";
import { auth } from "../firebase";
import { Navigate } from "react-router-dom";

// children props: component 내부의 모든 것
export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  // 유저가 로그인했는지 확인
  // 로그인 유저: 유저의 값, 로그인하지 않은 유저: null return
  const user = auth.currentUser;
  // 로그인 유저가 아닐 경우 로그인 페이지로 리다이렉트
  if (user === null) {
    return <Navigate to="/login" />;
  }
  return children;
}
