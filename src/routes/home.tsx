import styled from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import { auth } from "../firebase";
import Timeline from "../components/timeline";

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  /* 게시물 작성 구역은 고정상태로, 게시물들을 스크롤할 수 있게 하기 위함 */
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
`;

export default function Home() {
  //   const logOut = () => {
  //     auth.signOut();
  //   };
  return (
    <Wrapper>
      <PostTweetForm />
      <Timeline />
    </Wrapper>
  );
}
