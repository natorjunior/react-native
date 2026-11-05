// O mesmo objeto atravessa todas as camadas e os dois aparelhos.
export function createMessage({ senderId, receiverId, content }) {
  const suffix = Math.random().toString(36).slice(2);
  return {
    id: `${senderId}-${Date.now()}-${suffix}`,
    senderId,
    receiverId,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };
}

export function isMessage(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    ['id', 'senderId', 'receiverId', 'content', 'createdAt'].every(
      (key) => typeof value[key] === 'string' && value[key].trim().length > 0
    ) &&
    Number.isFinite(Date.parse(value.createdAt))
  );
}
