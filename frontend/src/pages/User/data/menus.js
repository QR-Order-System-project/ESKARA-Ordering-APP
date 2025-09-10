import egg from "../assets/001.png";
import photo from "../assets/002.png";
import erase from "../assets/003.png";
import ice from "../assets/004.png";
import spicy from "../assets/005.png";
import wing from "../assets/006.png";
import tupu from "../assets/007.png";
import toast from "../assets/008.png";
import icecream from "../assets/009.png";
import taco from "../assets/010.png";
import fruit from "../assets/011.png";
import rice from "../assets/012.png";
import msg from "../assets/013.png";
import water from "../assets/014.png";


export const menus = {
  event: [
    { id: 1, name: "두근두근, 사랑은 계란을 타고...", price: 0, desc: "일단 울지 말고 말해봐", img: egg },
    { id: 2, name: "포토존 인스타 스토리 인증", price: 0, desc: "인스타 스토리 올리면 음료 하나 제공!", img: photo },
    { id: 3, name: "세신실의 지우개 때밀기", price: 0, desc: "본 이벤트는 세신실에서 참여 가능합니다.", img: erase },
    { id: 4, name: "아이스방 찾아가는 이벤트", price: 0, desc: "잠시 후 직원이 여러분을 찾아갑니다!", img: ice }
  ],
  main: [
    { id: 5, name: "불가마 짬뽕탕", price: 11900, desc: "안녕하세요 짬뽕탕입니다. 저 맛있습니다.", img: spicy },
    { id: 6, name: "참숯가마 버팔로윙", price: 11900, desc: "솦융대&유대 회장 PICK! 짭쪼름한 닭날개", img: wing },
    { id: 7, name: "황토방 두부김치", price: 11900, desc: "두부두부두부 으쌰으쌰으쌰으쌰", img: tupu }
  ],
  side: [
    { id: 8, name: "찜질베개 토스트", price: 7900, desc: "딱딱한 찜질베개는 가라! 폭신폭신 찜질베개", img: toast },
    { id: 9, name: "소프트 아이스크림과 뻥튀기", price: 7900, desc: "이건 첫 번째 레슨, 아이스크림 먹기", img: icecream },
    { id: 10, name: "도리토스 타코", price: 7900, desc: "아무도 안 시켜서 메뉴판에 나타나기로 한 나", img: taco },
    { id: 11, name: "모듬 후르츠", price: 7900, desc: "숙취해소 +20 혈당스파이크 +10", img: fruit }
  ],
  drink: [
    { id: 12, name: "찜질방 식혜", price: 3000, desc: "밥알까지 사랑해줘야 진짜 식혜 매니아", img: rice },
    { id: 13, name: "주전자 미숫가루", price: 3000, desc: "주전자 인생 30년... 이런 맛 처음이야", img: msg },
    { id: 14, name: "시원한 물 1L", price: 3000, desc: "이제 메뉴 설명 적기도 귀찮다  - 개발자", img: water },
  ],
};
