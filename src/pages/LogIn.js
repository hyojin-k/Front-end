import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router";
const LogIn = () => {
  const history = useHistory();
  return (
    <>
      <InputBox>
        <div>
          <label>아이디</label>
          <input />
        </div>
        <div>
          <label>비밀번호</label>
          <input />
        </div>
        <button>로그인하기</button>
        <button onClick={()=>history.push("/signup")}>회원가입</button>
      </InputBox>
    </>
  );
};

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 400px;
  height: 300px;
  margin: auto;
`;

export default LogIn;
