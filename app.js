const visitorCount = document.getElementById("visitorCount");

function createFakeCounter() {
  const base = 123;
  const savedCount = localStorage.getItem("zeroRoomVisitorCount");

  if (savedCount) {
    return Number(savedCount);
  }

  const randomAdd = Math.floor(Math.random() * 30);
  const firstCount = base + randomAdd;

  localStorage.setItem("zeroRoomVisitorCount", String(firstCount));
  return firstCount;
}

function formatCounter(number) {
  return String(number).padStart(6, "0");
}

const count = createFakeCounter();

if (visitorCount) {
  visitorCount.textContent = formatCounter(count);
}
