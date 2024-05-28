import { useState } from "react";
import styled from "styled-components";

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: "Pretendard-Regular", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #f1718a;
  }
`;

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #f1718a;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #f1718a;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

// 재사용 가능한 컴포넌트로 공통화 하는 것도 좋아보임!
const SubmitBtn = styled.input`
  background-color: #f1718a;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`;

export default function PostTweetForm() {
  const [isLoading, setLoading] = useState(false);
  const [jweet, setJweet] = useState("");
  //   파일이 있으면 File, 없을 수 있으니 null 타입도 지정
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJweet(e.target.value);
  };

  //   e.target.value 대신 e.files 라는 것을 사용하기 때문에 별도의 함수가 필요
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // type="file"인 input이 변경될 때마다 파일의 배열을 받아온다.
    // input에 따라 복수의 파일을 업로드하기 때문에 배열로 받아온다.

    const { files } = e.target;
    // 우리는 하나의 사진만 업로드하게 해줄 것이기 때문에, 1개인지 확인 후 그 파일을 File 상태에 저장
    if (files && files?.length === 1) {
      setFile(files[0]);
    }
  };

  return (
    <Form>
      <TextArea
        rows={5}
        maxLength={300}
        onChange={onChange}
        value={jweet}
        placeholder="무슨 일이 일어나고 있나요?"
      />
      {/* file이라는 id를 가진 input을 위한 label이기 때문에 hrmlFor 사용 
      또한 input은 스타일링하기 어렵기 때문에 이 label을 스타일링 해준다 */}
      <AttachFileButton htmlFor="file">
        {file ? "사진 첨부 완료 ✅" : "사진 첨부"}
      </AttachFileButton>
      <AttachFileInput
        onChange={onFileChange}
        type="file"
        id="file"
        accept="image/*"
      />
      <SubmitBtn
        type="submit"
        value={isLoading ? "게시물 전송 중..." : "게시하기"}
      />
    </Form>
  );
}
