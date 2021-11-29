import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";

// 컴포넌츠
import NavBar from "../components/NavBar";
import TopBar from "../components/TopBar";
import All from "../components/AllList/All";
import Olympic from "../components/AllList/Olympic";
import SeoulForest from "../components/AllList/SeoulForest";
import Banpo from "../components/AllList/Banpo";
import Spinner from "../shared/Spinner";

// 리덕스
import { actionCreators as postActions } from "../redux/modules/post";

// 이미지
import { FaPaw } from "react-icons/fa";
import { setDefaultLocale } from "react-datepicker";

const AllList = (props) => {
  const [status, setStatus] = useState();
  const [focus, setFocus] = useState();

  const dispatch = useDispatch();
  const postList = useSelector((state) => state.post.main);
  const is_loading = useSelector((state) => state.sign.is_loading);
  const params = props.match.params.page;

  const all = () => {
    setStatus("all");
    setFocus("all");
  };
  const olympic = () => {
    setStatus("olympic");
    setFocus("olympic");
  };
  const seoul = () => {
    setStatus("seoul");
    setFocus("seoul");
  };
  const banpo = () => {
    setStatus("banpo");
    setFocus("banpo");
  };

  const location = useSelector((state) => state.main.main);

  useEffect(() => {
    setStatus(location);
    setFocus(params);
    dispatch(postActions.getAllMD());
  }, [location]);
 

   //무한 스크롤
   const [target, setTarget] = useState(null)
   const [isLoaded, setIsLoaded] = useState(false);
   const [itemLists, setItemLists] = useState([1]);
   const [i,setI] = useState(10)
   const getMoreItem = async () => {
     setIsLoaded(true);
     setI(i+10)
     setTimeout(() => {     setIsLoaded(false);}, 1000);

   }  //아이템들 더 보여주는 함수

   const onIntersect = async ([entry], observer) => {
     if(entry.isIntersecting)
     {
       observer.unobserve(entry.target)
       await getMoreItem();
       observer.observe(entry.target)
     }
   }

   useEffect (()=> {
     let observer;
     if (target) {
       observer = new IntersectionObserver(onIntersect, {
         threshold:0.4,
       });
       observer.observe(target);
     }
     return () => observer && observer.disconnect();
   },[target])
  if(isLoaded)
  {
    return <Spinner />
  }
  if (is_loading) {
    return <Spinner />;
  } else {
    return (
      <div>
        <Wrap>
          <TopBar>
            <FaPaw
              style={{ width: "24px", height: "24px", margin: " -4px 10px" }}
            />
            <span>산책가자</span>
          </TopBar>

          {/* 카테고리 선택 */}
          <Category>
            <button
              onClick={all}
              onFocus={() => setFocus("all")}
              style={{
                borderBottom: focus === "all" ? "4px solid red" : "",
              }}
            >
              전체
            </button>

            <button
              onClick={olympic}
              onFocus={() => setFocus("olympic")}
              style={{
                borderBottom: focus === "olympic" ? "4px solid red" : "",
              }}
            >
              올림픽공원
            </button>

            <button
              onClick={seoul}
              onFocus={() => setFocus("seoul")}
              style={{
                borderBottom: focus === "seoul" ? "4px solid red" : "",
              }}
            >
              서울숲
            </button>

            <button
              onClick={banpo}
              onFocus={() => setFocus("banpo")}
              style={{
                borderBottom: focus === "banpo" ? "4px solid red" : "",
              }}
            >
              반포 한강공원
            </button>
          </Category>

          {/* 각 게시물에 대한 카드들 */}
          <Body>
            {(status === "all" || status === "") && <All postList={postList} lastId={i}/>}
            {status === "olympic" && <Olympic />}
            {status === "seoul" && <SeoulForest />}
            {status === "banpo" && <Banpo />}
          </Body>
        </Wrap>
        <div ref={setTarget}>
              
        </div>
        <NavBar />
      </div>
    );
  }
};

const Wrap = styled.div`
  text-align: center;
  position: relative;
  width: 100%;
  /* margin: 0 auto; */
  padding: 0 5%;
  box-sizing: border-box;
  /* border: 1px solid red; */
`;

const TopBarImg = styled.img`
  height: 22px;
`;
const Category = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;

  button {
    box-sizing: border-box;

    margin: 0 5px 20px 5px;
    padding: 0 5px;
    padding-bottom: 10px;
    background-color: transparent;
    border: none;
    text-align: center;
  }
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
`;
const Text = styled.p`
  width: 152px;
  height: 16px;
  margin: 12px 0 24px 0;
  font-size: 16px;
  font-weight: 700;
`;

export default AllList;
