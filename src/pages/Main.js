// Main.js - 메인 페이지
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { history } from "../redux/configureStore";
import { io } from "socket.io-client";

// 리덕스
import { actionCreators as walkPostActions } from "../redux/modules/post";
import { actionCreators as dogStaPostActions } from "../redux/modules/dogsta";
import { actionCreators as notificationActions } from "../redux/modules/notification";
import { actionCreators as mainActions } from "../redux/modules/main";
import { actionCreators as signActions } from "../redux/modules/sign";

// 컴포넌츠
import Weather from "../components/Weather";
import MainDogsta from "../components/MainDogsta";
import NavBar from "../components/NavBar";
import Spinner from "../shared/Spinner";
import EventCard from "../components/EventCard";

// 이미지 + 아이콘
import LoginLogoImg from "../image/Login.png";
import Hangang from "../image/MainOlympic.jpg";
import Seoul from "../image/MainSeoul.jpg";
import Banpo from "../image/MainHangang.jpg";
import MainPageLogo from "../image/MainPageLogo.png";
import { IoNotificationsOutline } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";

import { actionCreators } from "../redux/modules/modal";

// 슬라이드
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Main = (props) => {
  const [page, setPage] = useState();

  const dogStaPostList = useSelector((state) => state.dogsta.mainFourPosts);
  const is_loading = useSelector((state) => state.sign.is_loading);
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();

  const [socket, setSocket] = useState(null);
  const [notification, setNotification] = useState([]);

  // 올림픽공원
  const olympicList = useSelector((state) => state.post.mainOlympic);
  const olympic = olympicList.slice(0, 4);
  const olympicListLength = olympicList[4];
  const [olympicTitle, setOlympicTitle] = useState("올림픽공원");
  const [olympicImage, setOlympicImage] = useState(Hangang);
  const [olympicDogName, setOlympicDogName] = useState();
  const [olympicTime, setOlympicTime] = useState();
  const [olympicLocation, setOlympicLocation] = useState("");

  const [postId, setPostId] = useState();

  // 서울숲
  const seoulList = useSelector((state) => state.post.mainSeoul);
  const seoul = seoulList.slice(0, 4);
  const seoulListLength = seoulList[4];
  const [seoulTitle, setSeoulTitle] = useState("서울숲");
  const [seoulImage, setSeoulImage] = useState(Seoul);
  const [seoulDogName, setSeoulDogName] = useState();
  const [seoulTime, setSeoulTime] = useState();
  const [seoulLocation, setSeoulLocation] = useState("");

  // 반포 한강공원
  const banpoList = useSelector((state) => state.post.mainBanpo);
  const banpo = banpoList.slice(0, 4);
  const banpoListLength = banpoList[4];

  const [banpoTitle, setBanpoTitle] = useState("반포 한강공원");
  const [banpoImage, setBanpoImage] = useState(Banpo);
  const [banpoDogName, setBanpoDogName] = useState();
  const [banpoTime, setBanpoTime] = useState();
  const [banpoLocation, setBanpoLocation] = useState("");

  // 날씨 + 주의사항 슬라이드 세팅
  const topSettings = {
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
  };

  // 개스타그램 슬라이드 세팅
  const bottomSettings = {
    dots: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 1000,
    pauseOnHover: true,
  };

  // Google Form 피드백 링크
  const feedBack = () => {
    window.open(
      "https://docs.google.com/forms/d/e/1FAIpQLSc_ZbOzE97WEYnPjQn6O_By5OJmoBfU1vpg37mx5sBOMnY5WQ/viewform?usp=sf_link"
    );
  };

  useEffect(() => {
    dispatch(dogStaPostActions.getMainPostMD());
    dispatch(walkPostActions.getMainOlympicMD());
    dispatch(walkPostActions.getMainSeoulMD());
    dispatch(walkPostActions.getMainBanpoMD());
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 알람 소켓
  // useEffect(() => {
  //   setSocket(io.connect(`https://www.walkadog.shop/notification/${userId}`));
  // }, []);

  // useEffect(() => {
  //   socket?.emit("postUser", userId);
  // }, []);

  // useEffect(() => {
  //   socket?.on("getNotification", (data) => {
  //     setNotification((prev) => [...prev, data]);
  //   });
  // }, [socket]);

  const getNoti = useSelector((state) => state.notification.noti);
  let arr = localStorage.getItem("noti");
  let noti = JSON.parse(arr);

  useEffect(() => {
    localStorage.setItem("noti", JSON.stringify(notification));
    arr = localStorage.getItem("noti");
  }, [notification, noti]);

  useEffect(() => {
    dispatch(notificationActions.getNotiMD());
  }, []);

  if (is_loading) {
    return <Spinner />;
  }

  return (
    <OutSideWrap>
      {/* 로고 + 알람 버튼 */}
      <TopWrap>
        <TopBarWrap>
          <TopBarButtons>
            {userId && (
              <TopBarBtnLeft
                onClick={() => {
                  dispatch(signActions.logoutMD());
                }}
              >
                <FiLogOut
                  style={{
                    width: "25px",
                    height: "25px",
                    color: "#000",
                  }}
                />
              </TopBarBtnLeft>
            )}
            <img src={MainPageLogo} style={{ height: "50px" }} />
            <TopBarBtnRight>
              {userId && (
                <div>
                  <IoNotificationsOutline
                    onClick={() => history.push("/notification")}
                    style={{
                      width: "24px",
                      height: "24px",
                    }}
                  />
                  <TopBarEdit>{getNoti == 0 ? 0 : getNoti.length}</TopBarEdit>
                </div>
              )}
            </TopBarBtnRight>
          </TopBarButtons>
        </TopBarWrap>
      </TopWrap>

      <Wrap>
        {/* 날씨 + 주의사항 슬라이드 */}
        <Slide>
          {!userId ? (
            <StyledSlider {...topSettings}>
              <LogoWrap>
                <Logo
                  src={LoginLogoImg}
                  onClick={() => history.push("/login")}
                />
              </LogoWrap>
            </StyledSlider>
          ) : (
            <StyledSlider {...topSettings} style={{ cursor: "pointer" }}>
              <EventCard onClick={feedBack} />
              <Weather />
              <CautionCard
                onClick={() => {
                  history.push("/caution1");
                }}
              >
                <ImageWrap>
                  <CautionImage src="https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1169&q=80" />
                </ImageWrap>
                <CautionInfo>
                  <TextWrap>
                    <span>1. 목줄 착용</span>
                    <p>목줄 착용은 선택이 아닌 필수입니다</p>
                  </TextWrap>
                </CautionInfo>
              </CautionCard>
              <CautionCard
                onClick={() => {
                  history.push("/caution2");
                }}
              >
                <ImageWrap>
                  <CautionImage src="https://images.unsplash.com/photo-1544567708-827a79119a78?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1074&q=80" />
                </ImageWrap>
                <CautionInfo>
                  <TextWrap>
                    <span>2. 사람 주의</span>
                    <p>개를 무서워하는 사람들을 주의해야합니다.</p>
                  </TextWrap>
                </CautionInfo>
              </CautionCard>
              <CautionCard
                onClick={() => {
                  history.push("/caution3");
                }}
              >
                <ImageWrap>
                  <CautionImage src="https://images.unsplash.com/photo-1560743173-567a3b5658b1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80" />
                </ImageWrap>
                <CautionInfo>
                  <TextWrap>
                    <span>3. 식물 주의</span>
                    <p>상처가 날 수 있는 식물을 주의해야합니다.</p>
                  </TextWrap>
                </CautionInfo>
              </CautionCard>
            </StyledSlider>
          )}
        </Slide>

        {/* 개스타그램 모음 */}
        <DogSta>
          <Header>
            <Text>오늘의 개스타</Text>
            <MoreBtn
              onClick={() => {
                history.push("/dogStaMain");
              }}
            >
              더보기
            </MoreBtn>
          </Header>

          <DogstaSlide {...bottomSettings}>
            {dogStaPostList.map((post, index) => {
              return <MainDogsta post={post} key={index} />;
            })}
          </DogstaSlide>
        </DogSta>

        {/* 각 게시물에 대한 카드들 */}
        <Body>
          {/* 올림픽공원 */}
          <BodyWrap>
            <Header>
              <Text>나홀로 나무 보러 가실 분</Text>
              <MoreBtn
                onFocus={() => {
                  setPage("olympic");
                }}
                onClick={() => {
                  dispatch(mainActions.setMainMD("olympic"));
                }}
              >
                더보기
              </MoreBtn>
            </Header>

            <WholeCardWrap>
              <Part
                onClick={() => {
                  {
                    postId
                      ? history.push(`/posts/${postId}`)
                      : dispatch(mainActions.setMainMD("olympic"));
                  }
                }}
              >
                <PartImg src={olympicImage} />

                <CardTextHere>
                  <Number>+{olympicListLength}</Number>

                  <CardText>
                    <div>{olympicTitle}</div>
                    <p>{olympicDogName}</p>
                    {olympicTime === undefined ? (
                      ""
                    ) : (
                      <span>{olympicTime + "  |  " + olympicLocation}</span>
                    )}
                  </CardText>
                </CardTextHere>
              </Part>

              <SubLists>
                {olympic.map((post, index) => {
                  const dogImage = post.dogImage;
                  const cardClicked = () => {
                    setOlympicTitle();
                    setOlympicImage(post.dogImage);
                    setOlympicDogName(post.dogName + "와 함께 산책하기");
                    setOlympicTime(post.meetingDate);
                    setOlympicLocation(post.locationCategory);
                    setPostId(post.postId);
                  };
                  return (
                    <MainCardWrap onClick={cardClicked}>
                      <MainCard post={post} key={index}>
                        <Image src={dogImage} />
                      </MainCard>
                    </MainCardWrap>
                  );
                })}
              </SubLists>
            </WholeCardWrap>
          </BodyWrap>

          {/* 서울숲 */}
          <BodyWrap>
            <Header>
              <Text>한국의 센트럴파크에서 산책</Text>
              <MoreBtn
                onFocus={() => {
                  setPage("seoul");
                }}
                onClick={() => {
                  dispatch(mainActions.setMainMD("seoul"));
                }}
              >
                더보기
              </MoreBtn>
            </Header>

            <WholeCardWrap>
              <Part
                onClick={() => {
                  {
                    postId
                      ? history.push(`/posts/${postId}`)
                      : dispatch(mainActions.setMainMD("seoul"));
                  }
                }}
              >
                <PartImg src={seoulImage} />

                <CardTextHere>
                  <Number>+{seoulListLength}</Number>

                  <CardText>
                    <div>{seoulTitle}</div>
                    <p>{seoulDogName}</p>
                    {seoulTime === undefined ? (
                      ""
                    ) : (
                      <span>{seoulTime + "  |  " + seoulLocation}</span>
                    )}
                  </CardText>
                </CardTextHere>
              </Part>

              <SubLists>
                {seoul.map((post, index) => {
                  const dogImage = post.dogImage;
                  const hover = () => {
                    setSeoulTitle();
                    setSeoulImage(post.dogImage);
                    setSeoulDogName(post.dogName + "와 함께 산책하기");
                    setSeoulTime(post.meetingDate);
                    setSeoulLocation(post.locationCategory);
                    setPostId(post.postId);
                  };

                  return (
                    <MainCardWrap onClick={hover}>
                      <MainCard post={post} key={index}>
                        <Image src={post.dogImage} />
                      </MainCard>
                    </MainCardWrap>
                  );
                })}
              </SubLists>
            </WholeCardWrap>
          </BodyWrap>

          {/* 반포 한강공원 */}
          <BodyWrap>
            <Header>
              <Text>야경이 이쁜 반포한강공원</Text>
              <MoreBtn
                onFocus={() => {
                  setPage("banpo");
                }}
                onClick={() => {
                  dispatch(mainActions.setMainMD("banpo"));
                }}
              >
                더보기
              </MoreBtn>
            </Header>

            <WholeCardWrap>
              <Part
                onClick={() => {
                  {
                    postId
                      ? history.push(`/posts/${postId}`)
                      : dispatch(mainActions.setMainMD("banpo"));
                  }
                }}
              >
                <PartImg src={banpoImage} />

                <CardTextHere>
                  <Number>+{banpoListLength}</Number>

                  <CardText>
                    <div>{banpoTitle}</div>
                    <p>{banpoDogName}</p>
                    {banpoTime === undefined ? (
                      ""
                    ) : (
                      <span>{banpoTime + "  |  " + banpoLocation}</span>
                    )}
                  </CardText>
                </CardTextHere>
              </Part>

              <SubLists>
                {banpo.map((post, index) => {
                  const dogImage = post.dogImage;
                  const hover = () => {
                    setBanpoTitle();
                    setBanpoImage(post.dogImage);
                    setBanpoDogName(post.dogName + "와 함께 산책하기");
                    setBanpoTime(post.meetingDate);
                    setBanpoLocation(post.locationCategory);
                    setPostId(post.postId);
                  };

                  return (
                    <MainCardWrap onClick={hover}>
                      <MainCard post={post} key={index}>
                        <Image src={dogImage} />
                      </MainCard>
                    </MainCardWrap>
                  );
                })}
              </SubLists>
            </WholeCardWrap>
          </BodyWrap>
        </Body>
      </Wrap>

      <NavBar />
    </OutSideWrap>
  );
};

const OutSideWrap = styled.div`
  margin: 0 auto;
`;
const TopBarWrap = styled.div`
  margin-bottom: 26px;
  background-color: #fff;
  padding-top: 14px;
`;
const TopBarEdit = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  cursor: pointer;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  color: white;

  width: 20px;
  height: 20px;
  padding: 6px;

  border-radius: 50%;
  background-color: red;
`;
const TopBarButtons = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: relative;
`;
const TopBarBtnLeft = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  border: none;
  background-color: transparent;
  width: 52px;
  height: 52px;
  cursor: pointer;
`;
const TopBarBtnRight = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  border: none;
  background-color: transparent;
  width: 52px;
  height: 52px;
  cursor: pointer;
`;
const TopWrap = styled.div`
  margin: 0 5%;
`;
const Wrap = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  background-color: #c4c4c4;
  position: relative;
  margin-bottom: -50px;
`;
const Slide = styled.div`
  background-color: #fff;
  padding: 0 5% 20px 5%;
  box-sizing: border-box;
`;
const StyledSlider = styled(Slider)`
  width: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 14px;
  box-shadow: 0px 1px 10px rgba(0, 0, 0, 0.25);
  cursor: pointer;
`;
const LogoWrap = styled.div``;
const Logo = styled.img`
  width: 50%;
  margin: 30px auto;
`;
const CautionCard = styled.div`
  height: 154px;
  padding: 18px;
  &::after {
    content: "";
    display: block;
    clear: both;
  }
  span {
    font-weight: 600;
  }
  p {
    font-size: 14px;
    word-break: keep-all;
  }
`;
const ImageWrap = styled.div`
  width: 120px;
  position: relative;
  overflow: hidden;
  padding-bottom: 120px;
  border-radius: 14px;
  float: left;
`;
const CautionImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  filter: drop-shadow(0px 1px 4px rgba(0, 0, 0, 0.25));
  border-radius: 14px;
  object-fit: cover;
`;
const CautionInfo = styled.div`
  float: left;
  position: relative;
  width: 50%;
  height: 100%;
`;
const TextWrap = styled.div`
  position: absolute;
  top: 50%;
  left: 16px;
  transform: translateY(-50%);
`;
const WholeCardWrap = styled.div`
  width: 100%;
`;
const Part = styled.div`
  width: 100%;
  margin-bottom: 17px;
  background-color: #000;
  border-radius: 14px;
  cursor: pointer;
  position: relative;
  padding-bottom: 75%;
  overflow: hidden;
`;
const PartImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 14px;
  opacity: 0.6;
  position: absolute;
`;
const CardTextHere = styled.div``;
const Number = styled.span`
  position: absolute;
  top: 14px;
  left: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 68px;
  height: 27px;
  background-color: #fff;
  color: #000;
  border-radius: 14px;
  font-size: 14px;
`;
const CardText = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin-bottom: 16px;
  font-weight: 500;
  font-size: 20px;
  line-height: 29px;
  color: #fff;
  span {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 400;
    line-height: 20.27px;
  }
`;
const SubLists = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const MainCardWrap = styled.div`
  width: 23%;
  cursor: pointer;
`;
const MainCard = styled.div`
  width: 100%;
  position: relative;
  padding-bottom: 100%;
  overflow: hidden;
`;
const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  border-radius: 5px;
`;
const DogSta = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  margin: 8px 0;
  padding: 20px 30px;
  background-color: #fff;
`;
const Header = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
`;
const Text = styled.p`
  font-size: 16px;
  font-weight: 700;
  line-height: 23px;
`;
const MoreBtn = styled.button`
  border: none;
  background-color: transparent;
  line-height: 20px;
  font-size: 14px;
  opacity: 0.6;
  cursor: pointer;
`;
const DogstaSlide = styled(Slider)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 12px;
  text-align: center;
  cursor: pointer;
  .slick-prev:before,
  .slick-next:before {
    color: gray;
  }
  div {
    width: 100%;
  }
`;
const Body = styled.div`
  width: 100%;
`;
const BodyWrap = styled.div`
  width: 100%;
  padding: 20px 5%;
  background-color: #fff;
  margin-bottom: 8px;
`;

export default Main;
