import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "../firebase";
import Jweet from "./jweet";
import { Unsubscribe } from "firebase/auth";

export interface IJweet {
  id: string;
  //   사진은 없을 수 있음
  photo?: string;
  jweet: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

export default function Timeline() {
  const [jweets, setJweets] = useState<IJweet[]>([]);

  useEffect(() => {
    // 초기값은 null
    let unsubscribe: Unsubscribe | null = null;
    const fetchJweets = async () => {
      // jweets 컬렉션을 createdAt(생성) 내림차순으로 정렬하는 쿼리
      const jweetsQuery = query(
        collection(db, "jweets"),
        orderBy("createdAt", "desc"),
        limit(25)
      );
      // // getDocs: QuerySnapshot 을 반환함
      // const snapshot = await getDocs(jweetsQuery);
      // // 참고: 개발모드에서 reacts.js가 useEffect 두번 호출
      // const jweets = snapshot.docs.map((doc) => {
      //   const { jweet, createdAt, userId, username, photo } = doc.data();
      //   return {
      //     jweet,
      //     createdAt,
      //     userId,
      //     username,
      //     photo,
      //     // id는 data에 저장되는게 아니기 때문에
      //     id: doc.id,
      //   };
      // });

      // 이벤트 리스너를 연결해줌, 쿼리에 리스너를 연결해준다
      // 무언가가 삭제, 편집 또는 생성되었을 때, 데이터를 추출한다.
      // unsubscribe 함수를 반환한다.
      // -> 이벤트 리스너를 항상 켜놓고 싶지 않음, e.g. 사용자의 자리비움
      // -> 유저가 사용 중이 아닐 때, 리스너를 쓸 필요가 없다. 따라서 fetch 함수를 useEffect 내부에서 사용
      unsubscribe = await onSnapshot(jweetsQuery, (snapshot) => {
        const jweets = snapshot.docs.map((doc) => {
          const { jweet, createdAt, userId, username, photo } = doc.data();
          return {
            jweet,
            createdAt,
            userId,
            username,
            photo,
            id: doc.id,
          };
        });
        setJweets(jweets);
      });
    };
    fetchJweets();
    return () => {
      //   unsubscribe가 null이 아니라면 unsubscribe 함수 호출
      //   useEffect는 언마운트일 때, 값을 반환하면서 cleanup 실행
      //   e.g. 다른 페이지 이동 -> 사용자가 타임라인 페이지를 볼 때만 이벤트를 사용하고 싶음
      //   useEffect 훅은 타임라인 컴포넌트가 사용되지 않을 때 구독을 취소할 것임
      //   즉, 타임라인 컴포넌트가 마운트될 때 구독되고, 언마운트될 때 구독 취소하는 것이다.
      unsubscribe && unsubscribe();
    };
  }, []);
  return (
    <Wrapper>
      {jweets.map((jweet) => (
        <Jweet key={jweet.id} {...jweet}></Jweet>
      ))}
    </Wrapper>
  );
}
