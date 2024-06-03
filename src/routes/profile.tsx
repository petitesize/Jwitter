import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { useEffect, useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { updateProfile } from "firebase/auth";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { IJweet } from "../components/timeline";
import Jweet from "../components/jweet";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #f1718a;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;
const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;

const Jweets = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export default function Profile() {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  const [jweets, setJweets] = useState<IJweet[]>([]);
  const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      const file = files[0];

      if (!user) return;

      //   유저 이미지를 저장할 ref 생성
      const locationRef = ref(storage, `avatars/${user?.uid}`);
      const result = await uploadBytes(locationRef, file);
      const avatarUrl = await getDownloadURL(result.ref);

      setAvatar(avatarUrl);
      await updateProfile(user, {
        photoURL: avatarUrl,
      });
    }
  };
  const fetchJweets = async () => {
    // 현재 로그인한 유저 ID 와 같은 게시글만 가져옴
    const jweetQuery = query(
      collection(db, "jweets"),
      //   where 과 같은 필터 사용 시, firestore 에게 어떤 필터가 발생할 것인지 알려야 한다
      //   콘솔창의 오류 링크 클릭 시, 인덱스 설정 창으로 이동
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(25)
    );

    const snapshot = await getDocs(jweetQuery);
    const jweets = snapshot.docs.map((doc) => {
      const { jweet, createdAt, userId, username, photo } = doc.data();
      return { jweet, createdAt, userId, username, photo, id: doc.id };
    });
    setJweets(jweets);
  };

  useEffect(() => {
    fetchJweets();
  }),
    [];

  return (
    <Wrapper>
      {/* avatarInput을 hidden 해놓고 이것을 버튼으로 삼을 것임 */}
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput
        onChange={onAvatarChange}
        id="avatar"
        type="file"
        accept="image/*"
      />
      <Name>{user?.displayName ?? "익명"}</Name>
      <Jweets>
        {jweets.map((jweet) => (
          <Jweet key={jweet.id} {...jweet} />
        ))}
      </Jweets>
    </Wrapper>
  );
}
