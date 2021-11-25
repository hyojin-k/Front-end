import axios from "axios";
import { produce } from "immer";
import { createAction, handleActions } from "redux-actions";
import { getCookie } from "../../shared/Cookie";

const GET_NOTI = "GET_NOTI";
const DELETE_NOTI = "DELETE_NOTI";

const getNoti = createAction(GET_NOTI, (noti) => ({ noti }));
const deleteNoti = createAction(DELETE_NOTI, (noti) => ({ noti }));

const initialState = {
  noti: [],
};
const postNotiMD = (notificationId,senderId,type) => {
  return function (dispatch, getState, { history }) {
    axios({
      method: "PATCH",
      url: `https://www.walkadog.shop/notification/${notificationId}/${senderId}`,
      data: {type:type},
      headers: {
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${getCookie("userLogin")}`,
      },
    })
      .then((res) => {
        // console.log(res.data.notification)
        if(type==3)
         window.alert("산책 수락하셨습니다")
         if(type==4)
         window.alert("산책 거절하셨습니다")
         dispatch(deleteNotiMD(notificationId))
      })
      .catch((err) => {
        console.log("POSTNOTI에서 오류발생", err);
   
      });
  };
}
const getNotiMD = () => {
  return function (dispatch, getState, { history }) {
    axios({
      method: "GET",
      url: `https://www.walkadog.shop/notification`,
      data: {},
      headers: {
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${getCookie("userLogin")}`,
      },
    })
      .then((res) => {
        // console.log(res.data.notification)
        const notiList = res.data.notification;
        dispatch(getNoti(notiList));
      })
      .catch((err) => {
        console.log("GETNOTI에서 오류발생", err);
   
      });
  };
};

const deleteNotiMD = (notificationId) => {
  return function (dispatch, getState, { history }) {
    axios({
      method: "DELETE",
      url: `https://www.walkadog.shop/notification/${notificationId}`,
      data: {},
      headers: {
        // "content-type": "application/json;charset=UTF-8",
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${getCookie("userLogin")}`,
      },
    })
      .then((res) => {
        dispatch(deleteNoti(notificationId));
        console.log("알람DELETE성공");
      })
      .catch((err) => {
        console.log("deleteNotiMD에서 오류발생", err);
        window.alert("오류 발생");
      });
  };
};
export default handleActions(
  {
    [GET_NOTI]: (state, action) =>
      produce(state, (draft) => {
        draft.noti = action.payload.noti;
      }),
    [DELETE_NOTI]: (state, action) =>
      produce(state, (draft) => {
        draft.noti = draft.noti.filter(
          (n, idx) => n.notificationId !== action.payload.noti
        );

        console.log(draft.noti);
      }),
  },
  initialState
);

const actionCreators = {
  getNoti,
  getNotiMD,
  deleteNoti,
  deleteNotiMD,
  postNotiMD,
};

export { actionCreators };
