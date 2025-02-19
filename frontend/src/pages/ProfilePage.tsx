import { useAuthStore } from "@/store/useAuthStore";
import React from "react";

type Props = {};

const ProfilePage = (props: Props) => {
  const { authUser } = useAuthStore();
  return <div>ProfilePage</div>;
};

export default ProfilePage;
