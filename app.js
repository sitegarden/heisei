const visitorCount = document.getElementById("visitorCount");
const bbsForm = document.getElementById("bbsForm");
const bbsName = document.getElementById("bbsName");
const bbsMessage = document.getElementById("bbsMessage");
const bbsList = document.getElementById("bbsList");
const ownerMemo = document.getElementById("ownerMemo");
const saveMemoButton = document.getElementById("saveMemoButton");
const memoStatus = document.getElementById("memoStatus");

const COUNTER_KEY = "zeroRoomVisitorCount";
const BBS_KEY = "zeroRoomBbsPosts";
const MEMO_KEY = "zeroRoomOwnerMemo";

function createFakeCounter() {
  const savedCount = localStorage.getItem(COUNTER_KEY);

  if (savedCount) {
    const nextCount = Number(savedCount) + 1;
    localStorage.setItem(COUNTER_KEY, String(nextCount));
    return nextCount;
  }

  const base = 123;
  const randomAdd = Math.floor(Math.random() * 30);
  const firstCount = base + randomAdd;

  localStorage.setItem(COUNTER_KEY, String(firstCount));
  return firstCount;
}

function formatCounter(number) {
  return String(number).padStart(6, "0");
}

function showKiribanMessage(count) {
  if (!visitorCount) return;

  const isKiriban =
    count % 100 === 0 ||
    count % 111 === 0 ||
    String(count).endsWith("777");

  if (!isKiriban) return;

  const message = document.createElement("div");
  message.className = "kiriban-message";
  message.textContent = "キリ番です！スクショして管理人に報告してね★";

  visitorCount.parentElement.appendChild(message);
}

function getBbsPosts() {
  const postsJson = localStorage.getItem(BBS_KEY);

  if (!postsJson) {
    return [];
  }

  try {
    return JSON.parse(postsJson);
  } catch {
    return [];
  }
}

function saveBbsPosts(posts) {
  localStorage.setItem(BBS_KEY, JSON.stringify(posts));
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderBbsPosts() {
  if (!bbsList) return;

  const posts = getBbsPosts();

  if (posts.length === 0) {
    bbsList.innerHTML = `<p class="small">まだ書き込みはありません。</p>`;
    return;
  }

  bbsList.innerHTML = posts
    .map((post) => {
      return `
        <article class="bbs-item">
          <div class="bbs-item-header">
            <span>${escapeHtml(post.name)}</span>
            <time>${escapeHtml(post.date)}</time>
          </div>
          <p>${escapeHtml(post.message)}</p>
        </article>
      `;
    })
    .join("");
}

function addBbsPost(name, message) {
  const posts = getBbsPosts();

  const newPost = {
    name,
    message,
    date: new Date().toLocaleString("ja-JP")
  };

  posts.unshift(newPost);

  const limitedPosts = posts.slice(0, 10);
  saveBbsPosts(limitedPosts);
  renderBbsPosts();
}

function setupBbs() {
  if (!bbsForm || !bbsName || !bbsMessage) return;

  bbsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = bbsName.value.trim() || "通りすがり";
    const message = bbsMessage.value.trim();

    if (!message) {
      alert("ひとことを書いてね");
      return;
    }

    addBbsPost(name, message);

    bbsName.value = "";
    bbsMessage.value = "";
  });

  renderBbsPosts();
}

function setupMemo() {
  if (!ownerMemo || !saveMemoButton) return;

  const savedMemo = localStorage.getItem(MEMO_KEY);

  if (savedMemo) {
    ownerMemo.value = savedMemo;
  }

  saveMemoButton.addEventListener("click", () => {
    localStorage.setItem(MEMO_KEY, ownerMemo.value);

    if (memoStatus) {
      memoStatus.textContent = "保存しました。";
    }
  });
}

const count = createFakeCounter();

if (visitorCount) {
  visitorCount.textContent = formatCounter(count);
  showKiribanMessage(count);
}

setupBbs();
setupMemo();
