import img1 from "../assets/menuimg1.png";
import img2 from "../assets/menuimg2.png";
import img3 from "../assets/menuimg3.png";
import img4 from "../assets/menuimg4.png";

export const menus = {
  event: [
    { id: 1, name: "두근두근, 사랑은 계란을 타고...", price: 0, desc: "일단 울지 말고 말해봐", img: img1 },
    { id: 2, name: "주점 인증샷 한잔해", price: 0, desc: "포토존에서 사진 찍으면 음료 하나 제공!", img: img2 }
  ],
  main: [
    { id: 3, name: "불가마 어묵탕", price: 10000, desc: "화염저항 +10", img: img3 },
    { id: 4, name: "참숯가마 버팔로윙", price: 15000, desc: "(원)태연 픽! 짭쪼름한 닭날개", img: img4 },
    { id: 5, name: "황토방 두부김치", price: 8000, desc: "두부두부두부 으쌰으쌰으쌰으쌰", img: img1 }
  ],
  side: [
    { id: 6, name: "찜질베개 토스트(안 딱딱함)", price: 5000, desc: "딱딱한 찜질베개는 가라!", img: img2 },
    { id: 7, name: "소프트아이스크림과 뻥튀기", price: 4000, desc: "소프트(웨어)아이스크림과 거짓말튀기", img: img3 },
    { id: 8, name: "도리도리토스뱅크 타코", price: 7000, desc: "이거 먹으면 토스뱅크 취업함", img: img4 },
    { id: 9, name: "모듬 후르츄베릅", price: 8000, desc: "숙취해소 +20", img: img1 }
  ],
  drink: [
    { id: 10, name: "밥알 낭낭한 찜질방 식혜", price: 3000, desc: "밥알 걸러달라고 하지마세요", img: img2 },
    { id: 11, name: "세빠지게 섞은 주전자 미숫가루", price: 5000, desc: "누가 주점 메뉴에 미숫가루 넣자고 했냐", img: img3 },
    { id: 12, name: "에비앙..은 아니고 삼다수", price: 1000, desc: "우리 제주의 물을 사랑합시다", img: img4 },
  ],
};
