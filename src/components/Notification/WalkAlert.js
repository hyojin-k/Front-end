import React, {useEffect,useState} from "react";
import styled from "styled-components";
import { useDispatch,useSelector } from "react-redux";
import { actionCreators as notiActions } from "../../redux/modules/notification";
import { actionCreators as chatActions } from "../../redux/modules/chat";
import {io} from "socket.io-client";
const WalkAlert = ({noti}) => {
  const dispatch = useDispatch();
 
  const userId = localStorage.getItem("userId");

  const [socket, setSocket] = useState(null)
  const [notification, setNotification] = useState([]);
  useEffect(() => {
    setSocket(io.connect(`http://13.209.70.209/notification/${userId}`));
  }, []);
  useEffect(() => {
    socket?.emit("postUser", userId);
    console.log(userId)
  }, []);
  useEffect(() => {
    socket?.on("getNotification", (data)=>{
     setNotification(((prev)=>[...prev,data]))

    });
  }, [socket]);
 console.log(notification)

  return (
        <div>
        <Wrap >
  
          <Left>
            <img src={noti.senderImage} />
          
            <span>{noti.senderNickname}</span>
          </Left>
          <Right>
          <Info>
            <Time>{noti.AGOTIME}</Time>
            </Info>
          <Message>{noti.senderNickname}님이 산책요청하셨습니다.<br/>수락하시겠습니까?</Message>
         <BtnArea>
          <SubmitBtn onClick={()=>dispatch(notiActions.postNotiMD(noti.notificationId,noti.senderId,3))} >수락하기</SubmitBtn>
          <CancelBtn onClick={()=>dispatch(notiActions.postNotiMD(noti.notificationId,noti.senderId,4))}>거절하기</CancelBtn>
          </BtnArea>
          </Right>
  
        </Wrap>
        {notification.map((n)=> {
          return (
            <Wrap onClick={()=>{dispatch(notiActions.deleteNotiMD(n.notificationId))}}>
          <Left>
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=687&q=80" />
          </Left>
          <Right>
            <Message>
          {n.senderNickname}님이 회원님에게 쪽지를 보냈습니다!
          </Message>
          <BtnArea>
          <SubmitBtn>수락하기</SubmitBtn>
          <CancelBtn>거절하기</CancelBtn>
          </BtnArea>
            <span>1시간 전</span>
          </Right>
          
        </Wrap>
          )
        })}
        </div>
        )
   
 
};
const BtnArea = styled.div
`
width:100%;
display:flex;
justify-content:flex-start;
padding-bottom:10px;
`
const Message = styled.div
`
display:flex;
width:100%;
height:80%;
justify-content:flex-start;
align-items:center;
padding-top:10px;
`
const Info = styled.div
`
display:flex;
width:100%;
justify-content:flex-end;
align-items:center;
padding-right:1rem;
`
const Time = styled.div
`
padding-right:10px;
padding-bottom:3px;
`
const CancelBtn = styled.div
`

display:flex;
justify-content:center;
align-items:center;
border-radius:20px;
width:7rem;
height:40px;
box-shadow: 0 0.03em 0.03em rgba(0, 0, 0, 0.25);
  border: 0.01rem solid lightGray;
`
const SubmitBtn = styled.div
`
background-color:#FF5656;
display:flex;
justify-content:center;
align-items:center;
border-radius:20px;
width:7rem;
height:40px;
box-shadow: 0 0.03em 0.03em rgba(0, 0, 0, 0.25);
  border: 0.01rem solid lightGray;
  margin-right:10px;
`
const Wrap = styled.div`
margin: 0.5rem;
display: flex;
flex-direction: row;
justify-content: center;
align-items: center;
  cursor:pointer;
  height: 9em;

  box-shadow: 0 0.03em 0.03em rgba(0, 0, 0, 0.25);
  border: 0.01rem solid lightGray;
  border-radius:15px;
  position:relative;
`;

const Left = styled.div`
 display:block;

  padding-left:10px;
  padding:30px 

  height:100%;
  img {
    display:flex;
    justify-content: center;
    
    width: 4em;
    height: 4em;
    border-radius: 50%;
    object-fit: cover;
  }
  span {
    display:flex;
    justify-content: center;
    
    margin-bottom:5px;
  }
  button {
    display:flex;
  }
`;
const Right = styled.div`
  display: flex;
  flex-direction: column;

  height:100%;
  justify-content: center;
  align-items: center;

  width:100%;
  margin-left: 10px;
 
 
`;

export default WalkAlert;