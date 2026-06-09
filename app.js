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


const mailForm = document.getElementById("mailForm");
const mailName = document.getElementById("mailName");
const mailType = document.getElementById("mailType");
const mailMessage = document.getElementById("mailMessage");
const mailStatus = document.getElementById("mailStatus");
const mailLogList = document.getElementById("mailLogList");
const clapButton = document.getElementById("clapButton");
const clapCountText = document.getElementById("clapCountText");

const MAIL_LOG_KEY = "zeroRoomMailLog";
const CLAP_COUNT_KEY = "zeroRoomClapCount";

function getMailLogs() {
  const logsJson = localStorage.getItem(MAIL_LOG_KEY);

  if (!logsJson) {
    return [];
  }

  try {
    return JSON.parse(logsJson);
  } catch {
    return [];
  }
}

function saveMailLogs(logs) {
  localStorage.setItem(MAIL_LOG_KEY, JSON.stringify(logs));
}

function renderMailLogs() {
  if (!mailLogList) return;

  const logs = getMailLogs();

  if (logs.length === 0) {
    mailLogList.innerHTML = `<p class="small">まだメッセージはありません。</p>`;
    return;
  }

  mailLogList.innerHTML = logs
    .map((log) => {
      return `
        <article class="mail-log-item">
          <div class="mail-log-header">
            <span>${escapeHtml(log.name)}</span>
            <time>${escapeHtml(log.date)}</time>
          </div>
          <span class="mail-log-type">${escapeHtml(log.type)}</span>
          <p>${escapeHtml(log.message)}</p>
        </article>
      `;
    })
    .join("");
}

function setupMailForm() {
  if (!mailForm || !mailName || !mailType || !mailMessage) return;

  mailForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = mailName.value.trim() || "通りすがり";
    const type = mailType.value;
    const message = mailMessage.value.trim();

    if (!message) {
      alert("メッセージを書いてね");
      return;
    }

    const logs = getMailLogs();

    logs.unshift({
      name,
      type,
      message,
      date: new Date().toLocaleString("ja-JP")
    });

    saveMailLogs(logs.slice(0, 20));
    renderMailLogs();

    mailName.value = "";
    mailMessage.value = "";

    if (mailStatus) {
      mailStatus.textContent = "送信した風に保存しました。";
    }
  });

  renderMailLogs();
}

function getClapCount() {
  return Number(localStorage.getItem(CLAP_COUNT_KEY) || "0");
}

function renderClapCount() {
  if (!clapCountText) return;

  const count = getClapCount();
  clapCountText.textContent = `拍手：${count}回`;
}

function setupClapButton() {
  if (!clapButton) return;

  clapButton.addEventListener("click", () => {
    const nextCount = getClapCount() + 1;
    localStorage.setItem(CLAP_COUNT_KEY, String(nextCount));
    renderClapCount();

    clapButton.textContent = "👏 ありがとう！";
    setTimeout(() => {
      clapButton.textContent = "👏 拍手する";
    }, 1000);
  });

  renderClapCount();
}

setupMailForm();
setupClapButton();

const voteButtons = document.querySelectorAll(".vote-button");
const rankingList = document.getElementById("rankingList");
const voteStatus = document.getElementById("voteStatus");

const VOTE_KEY = "zeroRoomVotes";

function getVotes() {
  const votesJson = localStorage.getItem(VOTE_KEY);

  if (!votesJson) {
    return {
      HOME: 0,
      DIARY: 0,
      GALLERY: 0,
      LINK: 0,
      MAIL: 0
    };
  }

  try {
    return JSON.parse(votesJson);
  } catch {
    return {
      HOME: 0,
      DIARY: 0,
      GALLERY: 0,
      LINK: 0,
      MAIL: 0
    };
  }
}

function saveVotes(votes) {
  localStorage.setItem(VOTE_KEY, JSON.stringify(votes));
}

function renderRanking() {
  if (!rankingList) return;

  const votes = getVotes();

  const ranking = Object.entries(votes)
    .sort((a, b) => b[1] - a[1]);

  rankingList.innerHTML = ranking
    .map(([name, count], index) => {
      return `
        <div class="ranking-item">
          <div class="ranking-item-rank">${index + 1}</div>
          <div class="ranking-item-name">${escapeHtml(name)}</div>
          <div class="ranking-item-count">${count}票</div>
        </div>
      `;
    })
    .join("");
}

function setupVoting() {
  if (!voteButtons.length) return;

  voteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const voteName = button.dataset.vote;
      const votes = getVotes();

      if (!voteName) return;

      votes[voteName] = (votes[voteName] || 0) + 1;
      saveVotes(votes);
      renderRanking();

      if (voteStatus) {
        voteStatus.textContent = `${voteName}に投票した風です。`;
      }
    });
  });

  renderRanking();
}

setupVoting();

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const searchStatus = document.getElementById("searchStatus");

const sitePages = [
  {
    title: "本館",
    url: "home.html",
    description: "ZERO'S ROOMのメインページ。更新履歴、BBS、ギャラリー入口があります。",
    tags: ["HOME", "本館", "更新履歴", "BBS", "平成"]
  },
  {
    title: "はじめに",
    url: "first.html",
    description: "このサイトについて、注意事項、閲覧環境を書いたページです。",
    tags: ["FIRST", "はじめに", "注意", "説明"]
  },
  {
    title: "プロフィール",
    url: "profile.html",
    description: "管理人ゼロのプロフィールページです。",
    tags: ["PROFILE", "プロフィール", "管理人", "ゼロ"]
  },
  {
    title: "日記",
    url: "diary.html",
    description: "管理人の日記ログです。月別にゆるく記録しています。",
    tags: ["DIARY", "日記", "ログ", "気分"]
  },
  {
    title: "ギャラリー",
    url: "gallery.html",
    description: "イラスト、バナー、制作物を置く作品部屋です。",
    tags: ["GALLERY", "ギャラリー", "イラスト", "作品", "バナー"]
  },
  {
    title: "リンク集",
    url: "link.html",
    description: "リンクフリー、相互リンク、88×31風バナーのページです。",
    tags: ["LINK", "リンク", "相互リンク", "バナー"]
  },
  {
    title: "メール",
    url: "mail.html",
    description: "管理人にメール風、Web拍手風のページです。",
    tags: ["MAIL", "メール", "拍手", "Web拍手"]
  },
  {
    title: "ランキング",
    url: "ranking.html",
    description: "平成サイトにありがちなランキング参加中っぽいページです。",
    tags: ["RANKING", "ランキング", "投票", "応援"]
  },

  {
  title: "更新履歴",
  url: "history.html",
  description: "ZERO'S ROOMの更新履歴ページです。サイトの増築記録をまとめています。",
  tags: ["HISTORY", "更新履歴", "更新", "ログ", "増築"]
},

  {
  title: "素材",
  url: "sozai.html",
  description: "背景、ライン、アイコン、バナー素材風のページです。",
  tags: ["SOZAI", "素材", "背景", "バナー", "アイコン"]
}
];

function renderSearchResults(results) {
  if (!searchResults) return;

  if (results.length === 0) {
    searchResults.innerHTML = `<p class="small">該当するページは見つかりませんでした。</p>`;
    return;
  }

  searchResults.innerHTML = results
    .map((page) => {
      return `
        <article class="search-result-card">
          <h3><a href="${page.url}">${escapeHtml(page.title)}</a></h3>
          <p>${escapeHtml(page.description)}</p>
          <div class="search-tags">
            ${page.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}
          </div>
        </article>
      `;
    })
    .join("");
}

function searchSitePages(keyword) {
  const normalizedKeyword = keyword.trim().toLowerCase();

  if (!normalizedKeyword) {
    return sitePages;
  }

  return sitePages.filter((page) => {
    const text = [
      page.title,
      page.url,
      page.description,
      ...page.tags
    ].join(" ").toLowerCase();

    return text.includes(normalizedKeyword);
  });
}

function setupSiteSearch() {
  if (!searchForm || !searchInput) return;

  renderSearchResults(sitePages);

  searchForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const keyword = searchInput.value;
    const results = searchSitePages(keyword);

    renderSearchResults(results);

    if (searchStatus) {
      const label = keyword.trim() || "全件";
      searchStatus.textContent = `「${label}」の検索結果：${results.length}件`;
    }
  });
}

setupSiteSearch();
