const addOrderToDB = async ({ tableNumber, items }) => {
  const timeSlot = '20250911';

  const orderRef = db.collection('orders')
    .doc(timeSlot)
    .collection('tables')
    .doc(`table-${tableNumber}`);

  const existing = await orderRef.get();
  let prev = existing.exists ? existing.data().items : [];

  await orderRef.set({
    items: [...prev, ...items],
    updatedAt: new Date().toISOString(),
  });

  const queueRef = db.collection('menuQueue');
  for (const item of items) {
    const menuRef = queueRef.doc(item.menu);
    const doc = await menuRef.get();
    let queue = doc.exists ? doc.data().queue : [];
    queue.push(tableNumber);
    await menuRef.set({ queue });
  }
};

const finalizeAndClearOrder = async (tableNumber) => {
  const timeSlot = '20250911';
  const orderRef = db.collection('orders')
    .doc(timeSlot)
    .collection('tables')
    .doc(`table-${tableNumber}`);

  const snapshot = await orderRef.get();
  if (!snapshot.exists) return;

  const data = snapshot.data();

  await db.collection('archives')
    .doc(timeSlot)
    .collection('tables')
    .doc(`table-${tableNumber}-${Date.now()}`)
    .set(data);

  await orderRef.delete();
};

module.exports = { addOrderToDB, finalizeAndClearOrder };
