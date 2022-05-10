import React, { useRef } from "react";
import swi1 from "images/icimg1.png";
import swi2 from "images/icimg2.png";
import swi3 from "images/icimg3.png";
import swi4 from "images/icimg4.png";
import swi5 from "images/icimg5.png";
import swi6 from "images/icimg6.png";
import swi7 from "images/icimg7.png";
import swi8 from "images/icimg8.png";
import Typewriter from "typewriter-effect";
import { gsap } from "gsap";

const Introduce = ({ userObj, containerStyle }) => {
  const el = useRef();
  const q = gsap.utils.selector(el);
  const tl = useRef();

  return (
    <div style={containerStyle}>
      <div className="intro-title">
        <Typewriter
          options={{ delay: 70 }}
          onInit={(typewriter) => {
            typewriter
              .typeString(`안녕하세요! 저의 포트폴리오는...`)
              .pauseFor(300)
              .start()
              .callFunction(() => {
                tl.current = gsap
                  .timeline()
                  .to(q(".itimg1"), {
                    opacity: 1,
                    display: "inline-block",
                  })
                  .to(q(".itimg2"), { opacity: 1, display: "inline-block" })
                  .to(q(".itimg3"), { opacity: 1, display: "inline-block" });
              });
          }}
        />
      </div>

      <div className="ic-img" ref={el}>
        <img
          src={swi1}
          alt=""
          style={{ width: "90px", opacity: 0, display: "none" }}
          className="itimg1"
        />
        <img
          src={swi2}
          alt=""
          style={{ width: "120px", opacity: 0, display: "none" }}
          className="itimg2"
        />
        <img
          src={swi3}
          alt=""
          style={{ width: "70px", opacity: 0, display: "none" }}
          className="itimg3"
        />
        <img
          src={swi4}
          alt=""
          style={{ width: "115px", opacity: 0, display: "none" }}
          className="itimg4"
        />
        <img
          src={swi5}
          alt=""
          style={{ width: "200px", opacity: 0, display: "none" }}
          className="itimg5"
        />
        <img
          src={swi6}
          alt=""
          style={{ width: "150px", opacity: 0, display: "none" }}
          className="itimg6"
        />
        <img
          src={swi7}
          alt=""
          style={{ width: "100px", opacity: 0, display: "none" }}
          className="itimg7"
        />
        <img
          src={swi8}
          alt=""
          style={{ width: "150px", opacity: 0, display: "none" }}
          className="itimg8"
        />
      </div>

      <div className="ic-desc">
        <Typewriter
          options={{ delay: 50 }}
          onInit={(typewriter) => {
            typewriter
              .pauseFor(2500)
              .typeString(`React.js와 Firebase를 바탕으로,`)
              .callFunction(() => {
                tl.current = gsap.timeline().to(q(".itimg4"), {
                  opacity: 1,
                  display: "inline-block",
                });
              })
              .typeString(`FullCalendar.js를 활용한 일정 관리 페이지와<br />`)
              .callFunction(() => {
                tl.current = gsap.timeline().to(q(".itimg5"), {
                  opacity: 1,
                  display: "inline-block",
                });
              })
              .typeString(
                `Firestore Database의 데이터를 실시간으로 주고 받으며 채팅 페이지를 제작하였고,<br />`
              )
              .callFunction(() => {
                tl.current = gsap
                  .timeline()
                  .to(q(".itimg6"), {
                    opacity: 1,
                    display: "inline-block",
                  })
                  .to(q(".itimg7"), {
                    opacity: 1,
                    display: "inline-block",
                  });
              })
              .typeString(
                `Material UI와 Ant Design의 UI Framework를 사용하여<br />헤더 영역과 메뉴, 버튼, 테이블등 레이아웃을 구성하였고,<br />`
              )
              .callFunction(() => {
                tl.current = gsap.timeline().to(q(".itimg8"), {
                  opacity: 1,
                  display: "inline-block",
                });
              })
              .typeString(
                `GASP의 timeline과 typing effect를 활용하여 animation 효과를 주었습니다.<br /><br />`
              )
              .typeString(
                `<h1 style="font-family: serif; font-size: 2rem; font-weight: bold; text-align: center">감사합니다 !</h1>`
              )
              .start();
          }}
        />
      </div>
    </div>
  );
};

export default Introduce;
