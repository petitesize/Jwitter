import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { Link, useNavigate } from "react-router-dom";
import { FirebaseError } from "firebase/app";
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from "../components/auth-components";
import GithubButton from "../components/github-btn";

export default function CreateAccount() {
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    // 변경된 Input에 따라 state 값을 set 해줌
    if (name === "name") {
      setName(value);
    } else if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 에러가 이미 표시된 경우가 있으니, Submit 시 초기화 해준다
    setError("");
    try {
      setLoading(true);
      // 계정 생성
      if (isLoading || name === "" || email === "" || password === "") return;
      // 계성 생성 성공 시 자격증명
      const credentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log(credentials.user);
      // 사용자 이름 set
      await updateProfile(credentials.user, {
        displayName: name,
      });
      // 홈페이지로 redirect
      navigate("/");
    } catch (e) {
      // 에러 핸들링
      // FirebaseError 클래스의 에러인 경우 (e.g. 이메일 중복 등..)
      if (e instanceof FirebaseError) {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }

    // console.log(name, email, password);
  };

  return (
    <Wrapper>
      <Title>Join J</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          name="name"
          value={name}
          placeholder="Name"
          type="text"
          required
        />
        <Input
          onChange={onChange}
          name="email"
          value={email}
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          name="password"
          value={password}
          placeholder="Password"
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        이미 회원이신가요? <Link to="/login">로그인 &rarr;</Link>
      </Switcher>
      <GithubButton />
    </Wrapper>
  );
}
