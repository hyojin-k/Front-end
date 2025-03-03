import { createAction, handleActions } from "redux-actions";
import axios from "axios";
import { apis } from "../../lib/axios";
import { produce } from "immer";
import { getCookie } from "../../shared/Cookie";
import { list1, list2, list3 } from "../../components/MarkerList/RoadList";
import { seoul1, seoul2, seoul3 } from "../../components/MarkerList/SeoulList";
import {
  hangang1,
  hangang2,
  hangang3,
} from "../../components/MarkerList/HangangList";
import { hangang, seoul, olympic } from "../../components/MarkerList/ParkList";
import { actionCreators as modalActions } from "./modal";

// action
//메인 페이지 GET 요청
const GET_ALL = "GET_ALL"; // 모든 게시물 조회
const GET_MAIN_OLYMPIC = "GET_MAIN_OLYMPIC"; // 모든 게시물 조회
const GET_MAIN_SEOUL = "GET_MAIN_SEOUL"; // 모든 게시물 조회
const GET_MAIN_BANPO = "GET_MAIN_BANPO"; // 모든 게시물 조회
const GET_OLYMPIC = "GET_OLYMPIC"; // 모든 게시물 조회
const GET_SEOUL = "GET_SEOUL"; // 모든 게시물 조회
const GET_BANPO = "GET_BANPO"; // 모든 게시물 조회
const GET_POST = "GET_POST"; // 특정 게시물 조회
const GET_MY_POST = "GET_MY_POST"; // 내 게시물 조회
const GET_MAP = "GET_MAP";

//산책 페이지 GET,POST,FETCH,DELETE
const ADD_POST = "ADD_POST";
const UPDATE_POST = "UPDATE_POST";
const DELETE_POST = "DELETE_POST";
const LOADING = "LOADING";
const GET_MODAL = "GET_MODAL";
const CHECK_REQUEST = "CHECK_REQUEST";
const COMPANIES = "COMPANIES";
const JUST_ADDED = "JUST_ADDED";

// action creators
//메인 페이지 GET 요청
const getAll = createAction(GET_ALL, (main) => ({ main }));
const getMainOlympic = createAction(GET_MAIN_OLYMPIC, (mainOlympic) => ({
  mainOlympic,
}));
const getMainSeoul = createAction(GET_MAIN_SEOUL, (mainSeoul) => ({
  mainSeoul,
}));
const getMainBanpo = createAction(GET_MAIN_BANPO, (mainBanpo) => ({
  mainBanpo,
}));
const getOlympic = createAction(GET_OLYMPIC, (olympic) => ({ olympic }));
const getSeoul = createAction(GET_SEOUL, (seoul) => ({ seoul }));
const getBanpo = createAction(GET_BANPO, (banpo) => ({ banpo }));
const getMap = createAction(GET_MAP, (map) => ({ map }));

//산책 페이지 GET,POST,FETCH,DELETE
const getPost = createAction(GET_POST, (list) => ({ list }));
const getMyPost = createAction(GET_MY_POST, (myList) => ({ myList }));
const addPost = createAction(ADD_POST, (list) => ({ list }));
const updatePost = createAction(UPDATE_POST, (list) => ({ list }));
const deletePost = createAction(DELETE_POST, (list) => ({ list }));
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));
const getModal = createAction(GET_MODAL, (modal) => ({ modal }));
const checkRequest = createAction(CHECK_REQUEST, (request) => ({ request }));
const companies = createAction(COMPANIES, (companies) => ({ companies }));
const justAdded = createAction(JUST_ADDED, (justAdded) => ({ justAdded }));
// initialState
const initialState = {
  //메인 요청
  main: [],
  mainOlympic: [],
  mainSeoul: [],
  mainBanpo: [],
  olympic: [],
  seoul: [],
  banpo: [],
  map: [],
  //산책 요청
  list: [],
  modal: "",
  request: "",
  companies: "",
  myList: [
    {
      dogAge: "4~7세",
      dogBreed: "골든리트리버",
      dogComment: "왈왈",
      dogGender: "남",
      dogId: 19,
      dogImage:
        "http://doggy-project-bucket.s3.ap-northeast-2.amazonaws.com/08ebac7d6d399be48695097eaa0846ac",
      dogName: "골든",
      dogSize: "중형견",
      meetingDate: "2021-11-15T12:42:33.096Z",
      neutral: "false",
      postId: 27,
      userAge: "20대",
      userGender: "남",
      userId: 24,
      userImage:
        "http://doggy-project-bucket.s3.ap-northeast-2.amazonaws.com/fb6d84033fc5fb08e60c699cb42ce2b8",
      userLocation: "서울시 강동구",
      userNickname: "monmon",
      wishDesc: "하하하",
    },
  ],
  is_loading: true,
  justAdded: false,
};

const modalMD = () => {
  return function (dispatch, getState, { history }) {
    dispatch(getModal(false));
    history.goBack();
  };
};
//받는 데이터 dog_size,dog_gender,dog_age,location_category,completed, dog_name,meeting_date
// 산책 약속 모든 게시물 받아오는것
const getAllMD = () => {
  return function (dispatch, getState, { history }) {
    axios({
      method: "GET",
      url: "http://13.209.70.209/posts/",
      data: {},
      headers: {
        // "content-type": "application/json;charset=UTF-8",
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        for (let i = 0; i < res.data.posts.length; i++) {
          const fullDate = res.data.posts[i].meetingDate.split("T")[0];
          const yearTens = fullDate.split("-")[0].charAt(2);
          const yearOnes = fullDate.split("-")[0].charAt(3);
          const year = yearTens + yearOnes;
          const month = fullDate.split("-")[1];
          const day = fullDate.split("-")[2];
          const fullTime = res.data.posts[i].meetingDate.split("T")[1];
          const hour = fullTime.split(":")[0];
          const minute = fullTime.split(":")[1];
          res.data.posts[i].meetingDate =
            year + "." + month + "." + day + ". " + hour + ":" + minute;
        }
        const postList = res.data.posts.posts;
        dispatch(getAll(postList));
        dispatch(loading(false));
        console.log("산책가자 전체 정보 불러오기 완료", res.data.posts);
      })
      .catch((err) => {
        // console.log(err);
        // console.log("정보 불러오기 실패");
      });
  };
};
// 메인 페이지 - 올림픽 게시물 4개 받아오는것
const getMainOlympicMD = () => {
  return function (dispatch, getState, { history }) {
    axios({
      method: "GET",
      url: "http://13.209.70.209/posts/main/olympicPark",
      data: {},
      headers: {
        // "content-type": "application/json;charset=UTF-8",
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        for (let i = 0; i < res.data.posts.length; i++) {
          const fullDate = res.data.posts[i].meetingDate.split("T")[0];
          const yearTens = fullDate.split("-")[0].charAt(2);
          const yearOnes = fullDate.split("-")[0].charAt(3);
          const year = yearTens + yearOnes;
          const month = fullDate.split("-")[1];
          const day = fullDate.split("-")[2];
          const fullTime = res.data.posts[i].meetingDate.split("T")[1];
          const hour = fullTime.split(":")[0];
          const minute = fullTime.split(":")[1];
          res.data.posts[i].meetingDate =
            year + "." + month + "." + day + ". " + hour + ":" + minute;
        }
        const postList = res.data.posts.posts;
        const totalCount = res.data.posts.totalCount;
        const postLists = [...postList, totalCount];
        dispatch(getMainOlympic(postLists));
        dispatch(loading(false));
        // console.log("getOlympicMD 정보 불러오기 완료");
      })
      .catch((err) => {
        // console.log("정보 불러오기 실패", err);
      });
  };
};
// 메인 페이지 - 서울숲 게시물 4개 받아오는것
const getMainSeoulMD = () => {
  return function (dispatch, getState, { history }) {
    axios({
      method: "GET",
      url: "http://13.209.70.209/posts/main/seoulForest",
      data: {},
      headers: {
        // "content-type": "application/json;charset=UTF-8",
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        for (let i = 0; i < res.data.posts.length; i++) {
          const fullDate = res.data.posts[i].meetingDate.split("T")[0];
          const yearTens = fullDate.split("-")[0].charAt(2);
          const yearOnes = fullDate.split("-")[0].charAt(3);
          const year = yearTens + yearOnes;
          const month = fullDate.split("-")[1];
          const day = fullDate.split("-")[2];
          const fullTime = res.data.posts[i].meetingDate.split("T")[1];
          const hour = fullTime.split(":")[0];
          const minute = fullTime.split(":")[1];
          res.data.posts[i].meetingDate =
            year + "." + month + "." + day + ". " + hour + ":" + minute;
        }
        const postList = res.data.posts.posts;
        const totalCount = res.data.posts.totalCount;
        const postLists = [...postList, totalCount];
        dispatch(getMainSeoul(postLists));
        dispatch(loading(false));
        // console.log("getseoul 정보 불러오기 완료");
      })
      .catch((err) => {
        // console.log("정보 불러오기 실패", err);
      });
  };
};
// 메인 페이지 - 반포 게시물 4개 받아오는것
const getMainBanpoMD = () => {
  return function (dispatch, getState, { history }) {
    axios({
      method: "GET",
      url: "http://13.209.70.209/posts/main/banpoPark",
      data: {},
      headers: {
        // "content-type": "application/json;charset=UTF-8",
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        for (let i = 0; i < res.data.posts.length; i++) {
          const fullDate = res.data.posts[i].meetingDate.split("T")[0];
          const yearTens = fullDate.split("-")[0].charAt(2);
          const yearOnes = fullDate.split("-")[0].charAt(3);
          const year = yearTens + yearOnes;
          const month = fullDate.split("-")[1];
          const day = fullDate.split("-")[2];
          const fullTime = res.data.posts[i].meetingDate.split("T")[1];
          const hour = fullTime.split(":")[0];
          const minute = fullTime.split(":")[1];
          res.data.posts[i].meetingDate =
            year + "." + month + "." + day + ". " + hour + ":" + minute;
        }
        const postList = res.data.posts.posts;
        const totalCount = res.data.posts.totalCount;
        const postLists = [...postList, totalCount];
        dispatch(getMainBanpo(postLists));
        dispatch(loading(false));
        // console.log("getOlympicMD 정보 불러오기 완료");
      })
      .catch((err) => {
        // console.log("정보 불러오기 실패");
      });
  };
};
// 산책가자 페이지 - 전체 올림픽 게시물 받아오기
const getOlympicMD = () => {
  return function (dispatch, getState, { history }) {
    axios({
      method: "GET",
      url: "http://13.209.70.209/posts/olympicPark",
      data: {},
      headers: {
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        for (let i = 0; i < res.data.posts.length; i++) {
          const fullDate = res.data.posts[i].meetingDate.split("T")[0];
          const yearTens = fullDate.split("-")[0].charAt(2);
          const yearOnes = fullDate.split("-")[0].charAt(3);
          const year = yearTens + yearOnes;
          const month = fullDate.split("-")[1];
          const day = fullDate.split("-")[2];
          const fullTime = res.data.posts[i].meetingDate.split("T")[1];
          const hour = fullTime.split(":")[0];
          const minute = fullTime.split(":")[1];
          res.data.posts[i].meetingDate =
            year + "." + month + "." + day + ". " + hour + ":" + minute;
        }
        const postList = res.data.posts;
        dispatch(getOlympic(postList));
        dispatch(loading(false));
        // console.log("getOlympicMD 정보 불러오기 완료");
      })
      .catch((err) => {
        // console.log("정보 불러오기 실패", err);
      });
  };
};
// 산책가자 페이지 - 전체 서울숲 게시물 받아오기
const getSeoulMD = () => {
  return function (dispatch, getState, { history }) {
    axios({
      method: "GET",
      url: "http://13.209.70.209/posts/seoulForest",
      data: {},
      headers: {
        // "content-type": "application/json;charset=UTF-8",
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        for (let i = 0; i < res.data.posts.length; i++) {
          const fullDate = res.data.posts[i].meetingDate.split("T")[0];
          const yearTens = fullDate.split("-")[0].charAt(2);
          const yearOnes = fullDate.split("-")[0].charAt(3);
          const year = yearTens + yearOnes;
          const month = fullDate.split("-")[1];
          const day = fullDate.split("-")[2];
          const fullTime = res.data.posts[i].meetingDate.split("T")[1];
          const hour = fullTime.split(":")[0];
          const minute = fullTime.split(":")[1];
          res.data.posts[i].meetingDate =
            year + "." + month + "." + day + ". " + hour + ":" + minute;
        }
        const postList = res.data.posts;
        dispatch(getSeoul(postList));
        dispatch(loading(false));
        // console.log("getseoul 정보 불러오기 완료");
      })
      .catch((err) => {
        // console.log("정보 불러오기 실패", err);
      });
  };
};
// 산책가자 페이지 - 전체 반포 게시물 받아오기
const getBanpoMD = () => {
  return function (dispatch, getState, { history }) {
    axios({
      method: "GET",
      url: "http://13.209.70.209/posts/banpoPark",
      data: {},
      headers: {
        // "content-type": "application/json;charset=UTF-8",
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        for (let i = 0; i < res.data.posts.length; i++) {
          const fullDate = res.data.posts[i].meetingDate.split("T")[0];
          const yearTens = fullDate.split("-")[0].charAt(2);
          const yearOnes = fullDate.split("-")[0].charAt(3);
          const year = yearTens + yearOnes;
          const month = fullDate.split("-")[1];
          const day = fullDate.split("-")[2];
          const fullTime = res.data.posts[i].meetingDate.split("T")[1];
          const hour = fullTime.split(":")[0];
          const minute = fullTime.split(":")[1];
          res.data.posts[i].meetingDate =
            year + "." + month + "." + day + ". " + hour + ":" + minute;
        }
        const postList = res.data.posts;
        dispatch(getBanpo(postList));
        dispatch(loading(false));
        // console.log('반포', postList)
      })
      .catch((err) => {
        // console.log("정보 불러오기 실패");
      });
  };
};
// 산책 약속 상세페이지
const getPostMD = (postId) => {
  return function (dispatch, getState, { history }) {
    axios({
      method: "GET",
      url: `http://13.209.70.209/posts/${postId}`,
      data: {},
      headers: {
        // "content-type": "application/json;charset=UTF-8",
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        // console.log(res.data);
        localStorage.setItem("date", res.data.posts.meetingDate);
        localStorage.setItem("dogCount", res.data.posts.dogCount);
        const whenTheMeeting = res.data.posts.meetingDate;
        const todayOriginal = new Date().toISOString();
        res.data.posts.completed =
          whenTheMeeting < todayOriginal ? "마감" : "진행중";

        const fullDate = res.data.posts.meetingDate.split("T")[0];
        const year = fullDate.split("-")[0];
        const month = fullDate.split("-")[1];
        const day = fullDate.split("-")[2];
        const initialTime = res.data.posts.meetingDate.split("T")[1];
        const hour = initialTime.split(":")[0];
        const minute = initialTime.split(":")[1];
        res.data.posts.meetingDate =
          year +
          "년 " +
          month +
          "월 " +
          day +
          "일 " +
          hour +
          "시 " +
          minute +
          "분";
        if (
          res.data.posts.routeName == "산책로A" &&
          res.data.posts.locationCategory == "올림픽공원"
        )
          res.data.posts.walk = list1;
        if (
          res.data.posts.routeName == "산책로B" &&
          res.data.posts.locationCategory == "올림픽공원"
        )
          res.data.posts.walk = list2;
        if (
          res.data.posts.routeName == "산책로C" &&
          res.data.posts.locationCategory == "올림픽공원"
        )
          res.data.posts.walk = list3;
        if (
          res.data.posts.routeName == "산책로A" &&
          res.data.posts.locationCategory == "서울숲"
        )
          res.data.posts.walk = seoul1;
        if (
          res.data.posts.routeName == "산책로B" &&
          res.data.posts.locationCategory == "서울숲"
        )
          res.data.posts.walk = seoul2;
        if (
          res.data.posts.routeName == "산책로C" &&
          res.data.posts.locationCategory == "서울숲"
        )
          res.data.posts.walk = seoul3;
        if (
          res.data.posts.routeName == "산책로A" &&
          res.data.posts.locationCategory == "반포한강공원"
        )
          res.data.posts.walk = hangang1;
        if (
          res.data.posts.routeName == "산책로B" &&
          res.data.posts.locationCategory == "반포한강공원"
        )
          res.data.posts.walk = hangang2;
        if (
          res.data.posts.routeName == "산책로C" &&
          res.data.posts.locationCategory == "반포한강공원"
        )
          res.data.posts.walk = hangang3;
        if (res.data.posts.locationCategory == "올림픽공원")
          res.data.posts.start = olympic;
        if (res.data.posts.locationCategory == "서울숲")
          res.data.posts.start = seoul;
        if (res.data.posts.locationCategory == "반포한강공원")
          res.data.posts.start = hangang[0];
        const postList = res.data.posts;
        const requestData = res.data.existRequest;
        // console.log("companies", res.data);
        dispatch(checkRequest(requestData));
        dispatch(getPost(postList));
        dispatch(companies(res.data.companyName));
        // console.log("정보 불러오기 완료");
      })
      .catch((err) => {
        // console.log("정보 불러오기 실패", err);
      });
  };
};
// 마이페이지 - 산책 약속 내가 쓴 게시물 모음
const getMyPostMD = (userId) => {
  return function (dispatch, getState, { history }) {
    axios({
      method: "GET",
      url: `http://13.209.70.209/mypage/myPost/${userId}`,
      data: {},
      headers: {
        // "content-type": "application/json;charset=UTF-8",
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        for (let i = 0; i < res.data.posts.length; i++) {
          const fullDate = res.data.posts[i].meetingDate.split("T")[0];
          const yearTens = fullDate.split("-")[0].charAt(2);
          const yearOnes = fullDate.split("-")[0].charAt(3);
          const year = yearTens + yearOnes;
          const month = fullDate.split("-")[1];
          const day = fullDate.split("-")[2];
          const fullTime = res.data.posts[i].meetingDate.split("T")[1];
          const hour = fullTime.split(":")[0];
          const minute = fullTime.split(":")[1];
          res.data.posts[i].meetingDate =
            year + "년 " + month + "월 " + day + "일 " + hour + ":" + minute;
        }
        const postList = res.data.posts;
        dispatch(getMyPost(postList));
        // console.log("정보 불러오기 완료", postList);
      })
      .catch((err) => {
        // console.log("정보 불러오기 실패", err);
      });
  };
};
//산책 수정할 때 GET으로 읽을 데이터 가져올 미들웨어
const getMapMD = (postId) => {
  return function (dispatch, getState, { history }) {
    axios({
      method: "GET",
      url: `http://13.209.70.209/posts/${postId}`,
      data: {},
      headers: {
        // "content-type": "application/json;charset=UTF-8",
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
        authorization: `Bearer ${getCookie("token")}`,
      },
    })
      .then((res) => {
        res.data.posts.longitude = res.data.posts.longitude.toString();
        res.data.posts.latitude = res.data.posts.latitude.toString();
        const fullDate = res.data.posts.meeting_date.split("T")[0];
        const year = fullDate.split("-")[0];
        const month = fullDate.split("-")[1];
        const day = fullDate.split("-")[2];
        const initialTime = res.data.posts.meeting_date.split("T")[1];
        const hour = initialTime.split(":")[0];
        const minute = initialTime.split(":")[1];
        res.data.posts.meeting_date =
          year +
          "년 " +
          month +
          "월 " +
          day +
          "일 " +
          hour +
          "시 " +
          minute +
          "분";
        res.data.posts.mapedit_date =
          year + "-" + month + "-" + day + "T" + hour + ":" + minute;
        const postList = res.data.posts;

        dispatch(getMap(postList));
        dispatch(loading(false));
        // console.log("정보 불러오기 완료", res.data);
      })
      .catch((err) => {
        // console.log("정보 불러오기 실패", err);
      });
  };
};
const addPostMD = (post, postId) => {
  return function (dispatch, getState, { history }) {
    apis
      .createPostAX(post, postId)
      .then((res) => {
        // dispatch(addPost(post));
        // dispatch(modalActions.setModal("산책 등록완료"));
        history.push("/alllist/all");
        dispatch(justAdded(postId, true));
      })
      .catch((err) => {
        window.alert("에러");
      });
  };
};
const updatePostMD = (postId, post) => {
  return function (dispatch, getState, { history }) {
    apis
      .updatePostAX(postId, post)
      .then((res) => {
        // dispatch(updatePost(postId));
        dispatch(modalActions.editModal(postId));
        dispatch(updatePost(post));
        history.push("/postEditModal");
        console.log(res);
      })
      .catch((err) => {
        // console.log(err);
      });
  };
};
const deletePostMD = (postId) => {
  return function (dispatch, getState, { history }) {
    // console.log(postId);
    apis
      .deletePostAX(postId)
      .then((res) => {
        history.push("/deleteModal");
        dispatch(modalActions.setModal("게시물이 삭제되었습니다"));
      })
      .catch((err) => {
        // console.log(err);
      });
  };
};

// reducer
export default handleActions(
  {
    [GET_ALL]: (state, action) =>
      produce(state, (draft) => {
        draft.main = action.payload.main;
      }),
    [GET_MAIN_OLYMPIC]: (state, action) =>
      produce(state, (draft) => {
        draft.mainOlympic = action.payload.mainOlympic;
      }),
    [GET_MAIN_SEOUL]: (state, action) =>
      produce(state, (draft) => {
        draft.mainSeoul = action.payload.mainSeoul;
      }),
    [GET_MAIN_BANPO]: (state, action) =>
      produce(state, (draft) => {
        draft.mainBanpo = action.payload.mainBanpo;
      }),
    [GET_OLYMPIC]: (state, action) =>
      produce(state, (draft) => {
        draft.olympic = action.payload.olympic;
      }),
    [GET_SEOUL]: (state, action) =>
      produce(state, (draft) => {
        draft.seoul = action.payload.seoul;
      }),
    [GET_BANPO]: (state, action) =>
      produce(state, (draft) => {
        draft.banpo = action.payload.banpo;
      }),
    [GET_MAP]: (state, action) =>
      produce(state, (draft) => {
        draft.map = action.payload.map;
      }),
    [GET_MY_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.myList = action.payload.myList;
      }),
    [GET_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = action.payload.list;
      }),
    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.push(action.payload.list);
      }),
    [UPDATE_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list = { ...draft.list, ...action.payload.post };
      }),
    [DELETE_POST]: (state, action) =>
      produce(state, (draft) => {
        // console.log(action.payload.postId);
        draft.list = draft.list.filter(
          (post) => post.id !== action.payload.postId
        );
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
    [GET_MODAL]: (state, action) =>
      produce(state, (draft) => {
        draft.modal = action.payload.modal;
      }),
    [CHECK_REQUEST]: (state, action) =>
      produce(state, (draft) => {
        draft.request = action.payload.request;
      }),
    [COMPANIES]: (state, action) =>
      produce(state, (draft) => {
        draft.companies = action.payload.companies;
      }),
    [JUST_ADDED]: (state, action) =>
      produce(state, (draft) => {
        draft.justAdded = action.payload.justAdded;
      }),
  },
  initialState
);
const actionCreators = {
  getAll,
  getMainOlympic,
  getMainSeoul,
  getMainBanpo,
  getOlympic,
  getSeoul,
  getBanpo,
  getPost,
  getMyPost,
  addPost,
  updatePost,
  deletePost,
  justAdded,
  companies,

  modalMD,
  getAllMD,
  getMainOlympicMD,
  getMainSeoulMD,
  getMainBanpoMD,
  getOlympicMD,
  getSeoulMD,
  getBanpoMD,
  getMyPostMD,
  getPostMD,
  addPostMD,
  deletePostMD,
  updatePostMD,
  getMapMD,
};
export { actionCreators };
