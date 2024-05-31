import styled from "styled-components";
import { IJweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Jweet({ username, photo, jweet, userId, id }: IJweet) {
  //   현재 로그인 한 유저를 받아옴
  const user = auth.currentUser;

  const onDelete = async () => {
    const ok = confirm("게시물을 정말 삭제할까요?");
    if (!ok || user?.uid !== userId) return;
    try {
      // doc 함수를 사용하여 내 db 에 있는 jweets 컬렉션의 해당 id의 문서를 삭제
      await deleteDoc(doc(db, "jweets", id));
      if (photo) {
        // 스토리지의 해당 경로(우리는 이미지 이름을 게시물 id로 지정하였음)를 이용하여 사진 참조
        const photoRef = ref(storage, `jweets/${user.uid}/${id}`);
        // 참조한 사진을 삭제
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{jweet}</Payload>
        {user?.uid === userId ? (
          <DeleteButton onClick={onDelete}>삭제</DeleteButton>
        ) : null}
      </Column>
      {/* 사진은 없을 수 있음 */}
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}
