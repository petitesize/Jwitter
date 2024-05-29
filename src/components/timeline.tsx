import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Jweet from "./jweet";

export interface IJweet {
  id: string;
  //   사진은 없을 수 있음
  photo?: string;
  jweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div``;

export default function Timeline() {
  const [jweets, setJweets] = useState<IJweet[]>([]);
  const fetchJweets = async () => {
    // jweets 컬렉션을 createdAt(생성) 내림차순으로 정렬하는 쿼리
    const jweetsQuery = query(
      collection(db, "jweets"),
      orderBy("createdAt", "desc")
    );
    // getDocs: QuerySnapshot 을 반환함
    const snapshot = await getDocs(jweetsQuery);
    // 참고: 개발모드에서 reacts.js가 useEffect 두번 호출
    const jweets = snapshot.docs.map((doc) => {
      const { jweet, createdAt, userId, username, photo } = doc.data();
      return {
        jweet,
        createdAt,
        userId,
        username,
        photo,
        // id는 data에 저장되는게 아니기 때문에
        id: doc.id,
      };
    });
    setJweets(jweets);
  };

  useEffect(() => {
    fetchJweets();
  }, []);
  return (
    <Wrapper>
      {jweets.map((jweet) => (
        <Jweet key={jweet.id} {...jweet}></Jweet>
      ))}
    </Wrapper>
  );
}
