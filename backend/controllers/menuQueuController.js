const { addOrderToDB, finalizeAndClearOrder } = require('../utils/dbUtils');

// 윗 부분 수정정



// 메뉴 큐 업데이트 (dbUtils.js 에서 추가)
const queueRef = db.collection('menuQueue');
for (const [menu, count]  of Object.entries(items)) {
    const menuRef = queueRef.doc(menu);
    const doc = await menuRef.get();
    let queue = doc.exists ? doc.data().queue : [];
    for (let i = 0; i < count; i++) {
      queue.push(tableNumber);
    }
    await menuRef.set({ queue });
}


// 요리 완료 시 메뉴큐에서 삭제
const removeTableFromMenu = async (menu, tableNumber) => {
    const menuRef = db.collection('menuQueue').doc(menu);
    const doc = await menuRef.get();
    if (doc.exists) {
      let queue = doc.data().queue || [];
      const index = queue.indexOf(tableNumber);
      if (index !== -1) {
        queue.splice(index, 1);
        await menuRef.set({ queue });
      }
    }
  };

