const visitorCount = document.getElementById("visitorCount");
const bbsForm = document.getElementById("bbsForm");
const bbsName = document.getElementById("bbsName");
const bbsMessage = document.getElementById("bbsMessage");
const bbsList = document.getElementById("bbsList");
const ownerMemo = document.getElementById("ownerMemo");
const saveMemoButton = document.getElementById("saveMemoButton");
const memoStatus = document.getElementById("memoStatus");
const bbsTitle = document.getElementById("bbsTitle");

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
    .map((post, index) => {
      return `
        <article class="bbs-item">
          <h3 class="bbs-item-title">
            <span class="bbs-item-number">No.${posts.length - index}</span>
            ${escapeHtml(post.title || "無題")}
          </h3>

          <div class="bbs-item-meta">
            投稿者：${escapeHtml(post.name)} / ${escapeHtml(post.date)}
          </div>

          <p>${escapeHtml(post.message)}</p>
        </article>
      `;
    })
    .join("");
}
function addBbsPost(name, title, message) {
  const posts = getBbsPosts();

  const newPost = {
    name,
    title: title || "無題",
    message,
    date: new Date().toLocaleString("ja-JP")
  };

  posts.unshift(newPost);

  const limitedPosts = posts.slice(0, 20);
  saveBbsPosts(limitedPosts);
  renderBbsPosts();
}
function setupBbs() {
  if (!bbsForm || !bbsName || !bbsMessage) return;

  bbsForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = bbsName.value.trim() || "通りすがり";
    const title = bbsTitle ? bbsTitle.value.trim() : "無題";
    const message = bbsMessage.value.trim();

    if (!message) {
      alert("メッセージを書いてね");
      return;
    }

    addBbsPost(name, title, message);

    bbsName.value = "";

    if (bbsTitle) {
      bbsTitle.value = "";
    }

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
  showRandomClapMessage();

  if (clapIcon) {
    clapIcon.classList.remove("pop");
    void clapIcon.offsetWidth;
    clapIcon.classList.add("pop");
  }

  clapButton.textContent = "👏 ありがとう！";
  setTimeout(() => {
    clapButton.textContent = "👏 拍手する";
  }, 1000);
});

  renderClapCount();
}

setupMailForm();
setupClapButton();

const clapThanksText = document.getElementById("clapThanksText");
const clapRandomMessage = document.getElementById("clapRandomMessage");
const clapIcon = document.querySelector(".clap-icon");

const clapMessages = [
  "拍手ありがとう。管理人が元気になりました。",
  "見てくれてありがとう。ゆっくりしていってね。",
  "その1クリックで、このサイトは今日も生きています。",
  "平成の空気を感じてくれてありがとう。",
  "また遊びに来てね。キリ番も狙っていいよ。"
];

function showRandomClapMessage() {
  const index = Math.floor(Math.random() * clapMessages.length);
  const message = clapMessages[index];

  if (clapThanksText) {
    clapThanksText.textContent = message;
  }

  if (clapRandomMessage) {
    clapRandomMessage.textContent = message;
  }
}



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
  title: "サイト内検索",
  url: "search.html",
  description: "ZERO'S ROOMのサイト内検索風ページです。登録ページをキーワードで探せます。",
  tags: ["SEARCH", "検索", "サイト内検索", "ページ一覧"]
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
},

  {
  title: "別館",
  url: "annex.html",
  description: "本館に置ききれない雑メモ、倉庫、ミニ企画を置く別館ページです。",
  tags: ["ANNEX", "別館", "倉庫", "雑メモ", "ミニ企画"]
},

  {
  title: "倉庫",
  url: "warehouse.html",
  description: "古いバナー、没ページ案、謎メモ、がらくたを置く倉庫ページです。",
  tags: ["WAREHOUSE", "倉庫", "没", "古いバナー", "がらくた"]
},

  {
  title: "占い",
  url: "fortune.html",
  description: "おみくじ、ラッキーアイテム、今日のひとことを表示する占いページです。",
  tags: ["FORTUNE", "占い", "おみくじ", "ラッキーアイテム"]
},

  {
  title: "同盟",
  url: "union.html",
  description: "好きなものをバナーで主張する、平成サイト風の同盟ページです。",
  tags: ["UNION", "同盟", "バナー", "主張", "平成"]
},
  
  {
  title: "100の質問",
  url: "question.html",
  description: "管理人への100の質問風ページです。基本、サイト、好きなもの、自由回答があります。",
  tags: ["QUESTION", "質問", "100の質問", "管理人", "プロフィール"]
},

  {
  title: "ミニゲーム",
  url: "game.html",
  description: "星を集めるだけの平成サイト風ミニゲームページです。",
  tags: ["GAME", "ゲーム", "ミニゲーム", "星", "スコア"]
},

  {
  title: "掲示板",
  url: "bbs.html",
  description: "平成サイト風の掲示板ページです。名前、タイトル、メッセージを書き込めます。",
  tags: ["BBS", "掲示板", "書き込み", "交流", "平成"]
},

  {
  title: "Web拍手",
  url: "clap.html",
  description: "管理人に拍手を送る風の平成サイト風Web拍手ページです。",
  tags: ["CLAP", "Web拍手", "拍手", "応援", "平成"]
},
  {
  title: "ありがとう",
  url: "thanks.html",
  description: "来てくれてありがとう、拍手ありがとうを伝えるお礼ページです。",
  tags: ["THANKS", "ありがとう", "お礼", "拍手", "来訪"]
},
  {
  title: "好きなもの",
  url: "favorite.html",
  description: "管理人の好きな飲み物、創作、サイト文化、好きな言葉をまとめたページです。",
  tags: ["FAVORITE", "好きなもの", "紅茶", "創作", "個人サイト"]
},
  {
  title: "夢と予定",
  url: "dream.html",
  description: "管理人のやりたいこと、制作予定、目標をまとめたページです。",
  tags: ["DREAM", "夢", "予定", "目標", "制作予定", "やりたいこと"]
},
  {
  title: "サイトマップ",
  url: "map.html",
  description: "増えすぎたページをまとめた案内板です。各ページへ移動できます。",
  tags: ["MAP", "サイトマップ", "案内", "ページ一覧", "迷子"]
},
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

const luckyWord = document.getElementById("luckyWord");
const luckyButton = document.getElementById("luckyButton");

const luckyWords = [
  "キリ番",
  "相互リンク",
  "直リンク禁止",
  "素材お借りしました",
  "別館",
  "隠しページ",
  "Web拍手",
  "掲示板",
  "工事中",
  "管理人多忙"
];

function showLuckyWord() {
  if (!luckyWord) return;

  const index = Math.floor(Math.random() * luckyWords.length);
  luckyWord.textContent = `今日のワード：${luckyWords[index]}`;
}

function setupLuckyWord() {
  if (!luckyButton) return;

  luckyButton.addEventListener("click", showLuckyWord);
  showLuckyWord();
}

setupLuckyWord();

const fortuneButton = document.getElementById("fortuneButton");
const fortuneResult = document.getElementById("fortuneResult");
const fortuneText = document.getElementById("fortuneText");
const luckyColor = document.getElementById("luckyColor");
const luckyItem = document.getElementById("luckyItem");
const luckyPhrase = document.getElementById("luckyPhrase");
const fortuneComment = document.getElementById("fortuneComment");

const fortunes = [
  {
    result: "大吉",
    text: "今日は勢いで進むと良い日。やりたいことを増築しよう。",
    color: "ピンク",
    item: "紅茶",
    phrase: "平成の風",
    comment: "ノリで始めたことが一番楽しい日です。"
  },
  {
    result: "中吉",
    text: "ほどよく良い日。無理せず、好きなページをひとつ増やそう。",
    color: "水色",
    item: "お気に入りの画像",
    phrase: "相互リンク",
    comment: "地味な作業ほど、あとで効いてきます。"
  },
  {
    result: "小吉",
    text: "小さな更新が似合う日。CSSを少し足すくらいがちょうどいい。",
    color: "黄色",
    item: "メモ帳",
    phrase: "工事中",
    comment: "完成してなくても、置いてあるだけで味です。"
  },
  {
    result: "吉",
    text: "普通に良い日。迷ったら本館に戻りましょう。",
    color: "白",
    item: "バナー",
    phrase: "直リンク禁止",
    comment: "今日もサイトはちゃんと生きています。"
  },
  {
    result: "凶",
    text: "リンク切れに注意。でも404ページがあるから大丈夫。",
    color: "紫",
    item: "隠しページ",
    phrase: "管理人多忙",
    comment: "凶でも平成サイトならネタになります。"
  },

  {
  title: "同盟",
  url: "union.html",
  description: "好きなものをバナーで主張する、平成サイト風の同盟ページです。",
  tags: ["UNION", "同盟", "バナー", "主張", "平成"]
},

  {
  title: "足あと帳",
  url: "guestbook.html",
  description: "来訪記念に名前、サイトURL、ひとことを残す足あと帳ページです。",
  tags: ["GUESTBOOK", "足あと", "足あと帳", "来訪記念", "ゲストブック"]
},
  
];

function setupFortune() {
  if (!fortuneButton) return;

  fortuneButton.addEventListener("click", () => {
    const index = Math.floor(Math.random() * fortunes.length);
    const fortune = fortunes[index];

    if (fortuneResult) fortuneResult.textContent = fortune.result;
    if (fortuneText) fortuneText.textContent = fortune.text;
    if (luckyColor) luckyColor.textContent = fortune.color;
    if (luckyItem) luckyItem.textContent = fortune.item;
    if (luckyPhrase) luckyPhrase.textContent = fortune.phrase;
    if (fortuneComment) fortuneComment.textContent = fortune.comment;
  });
}

setupFortune();

const unionForm = document.getElementById("unionForm");
const unionName = document.getElementById("unionName");
const unionLike = document.getElementById("unionLike");
const unionMemberList = document.getElementById("unionMemberList");

const UNION_MEMBER_KEY = "zeroRoomUnionMembers";

function getUnionMembers() {
  const membersJson = localStorage.getItem(UNION_MEMBER_KEY);

  if (!membersJson) {
    return [];
  }

  try {
    return JSON.parse(membersJson);
  } catch {
    return [];
  }
}

function saveUnionMembers(members) {
  localStorage.setItem(UNION_MEMBER_KEY, JSON.stringify(members));
}

function renderUnionMembers() {
  if (!unionMemberList) return;

  const members = getUnionMembers();

  if (members.length === 0) {
    unionMemberList.innerHTML = `<p class="small">まだ参加者はいません。</p>`;
    return;
  }

  unionMemberList.innerHTML = members
    .map((member) => {
      return `
        <div class="union-member">
          <span><strong>名前：</strong>${escapeHtml(member.name)}</span>
          <span><strong>同盟：</strong>${escapeHtml(member.like)}</span>
        </div>
      `;
    })
    .join("");
}

function setupUnionForm() {
  if (!unionForm || !unionName || !unionLike) return;

  unionForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = unionName.value.trim() || "通りすがり";
    const like = unionLike.value.trim();

    if (!like) {
      alert("参加したい同盟を書いてね");
      return;
    }

    const members = getUnionMembers();

    members.unshift({
      name,
      like
    });

    saveUnionMembers(members.slice(0, 20));
    renderUnionMembers();

    unionName.value = "";
    unionLike.value = "";
  });

  renderUnionMembers();
}

setupUnionForm();

const gameButton = document.getElementById("gameButton");
const gameResetButton = document.getElementById("gameResetButton");
const gameScore = document.getElementById("gameScore");
const gameHighScore = document.getElementById("gameHighScore");
const gameRank = document.getElementById("gameRank");
const gameMessage = document.getElementById("gameMessage");
const gameStar = document.getElementById("gameStar");
const gameTitleText = document.getElementById("gameTitleText");

const GAME_SCORE_KEY = "zeroRoomGameScore";
const GAME_HIGH_SCORE_KEY = "zeroRoomGameHighScore";

function getGameScore() {
  return Number(localStorage.getItem(GAME_SCORE_KEY) || "0");
}

function getGameHighScore() {
  return Number(localStorage.getItem(GAME_HIGH_SCORE_KEY) || "0");
}

function getGameRank(score) {
  if (score >= 300) return "平成の星職人";
  if (score >= 200) return "個人サイトの住人";
  if (score >= 100) return "キリ番ハンター";
  if (score >= 50) return "常連さん";
  if (score >= 20) return "通りすがり卒業";
  return "初心者";
}

function getGameMessage(score) {
  if (score >= 300) return "ここまで押すとは、なかなかやるな。";
  if (score >= 200) return "もう完全にこのサイトの住人です。";
  if (score >= 100) return "キリ番を狙う才能があります。";
  if (score >= 50) return "常連感が出てきました。";
  if (score >= 20) return "だんだん楽しくなってきた頃です。";
  return "星を集めよう。";
}

function renderGame() {
  if (!gameScore) return;

  const score = getGameScore();
  const highScore = getGameHighScore();
  const rank = getGameRank(score);

  gameScore.textContent = score;

  if (gameHighScore) {
    gameHighScore.textContent = highScore;
  }

  if (gameRank) {
    gameRank.textContent = rank;
  }

  if (gameTitleText) {
    gameTitleText.textContent = rank;
  }

  if (gameMessage) {
    gameMessage.textContent = getGameMessage(score);
  }
}

function setupGame() {
  if (!gameButton) return;

  gameButton.addEventListener("click", () => {
    const addPoint = Math.random() < 0.1 ? 10 : 1;
    const nextScore = getGameScore() + addPoint;
    const highScore = Math.max(nextScore, getGameHighScore());

    localStorage.setItem(GAME_SCORE_KEY, String(nextScore));
    localStorage.setItem(GAME_HIGH_SCORE_KEY, String(highScore));

    if (gameStar) {
      gameStar.classList.remove("pop");
      void gameStar.offsetWidth;
      gameStar.classList.add("pop");
    }

    if (gameMessage && addPoint === 10) {
      gameMessage.textContent = "ラッキー！ 星が10個増えました。";
    }

    renderGame();
  });

  if (gameResetButton) {
    gameResetButton.addEventListener("click", () => {
      localStorage.setItem(GAME_SCORE_KEY, "0");
      renderGame();
    });
  }

  renderGame();
}

setupGame();

const guestbookForm = document.getElementById("guestbookForm");
const guestName = document.getElementById("guestName");
const guestSite = document.getElementById("guestSite");
const guestMessage = document.getElementById("guestMessage");
const guestbookList = document.getElementById("guestbookList");

const GUESTBOOK_KEY = "zeroRoomGuestbook";

function getGuestbookEntries() {
  const entriesJson = localStorage.getItem(GUESTBOOK_KEY);

  if (!entriesJson) {
    return [];
  }

  try {
    return JSON.parse(entriesJson);
  } catch {
    return [];
  }
}

function saveGuestbookEntries(entries) {
  localStorage.setItem(GUESTBOOK_KEY, JSON.stringify(entries));
}

function renderGuestbook() {
  if (!guestbookList) return;

  const entries = getGuestbookEntries();

  if (entries.length === 0) {
    guestbookList.innerHTML = `<p class="small">まだ足あとはありません。</p>`;
    return;
  }

  guestbookList.innerHTML = entries
    .map((entry) => {
      const siteHtml = entry.site
        ? `<a class="guestbook-site" href="${escapeHtml(entry.site)}">${escapeHtml(entry.site)}</a>`
        : `<span class="guestbook-site">サイトなし</span>`;

      return `
        <article class="guestbook-item">
          <div class="guestbook-item-header">
            <span>${escapeHtml(entry.name)}</span>
            <time>${escapeHtml(entry.date)}</time>
          </div>
          ${siteHtml}
          <p>${escapeHtml(entry.message)}</p>
        </article>
      `;
    })
    .join("");
}

function setupGuestbook() {
  if (!guestbookForm || !guestName || !guestSite || !guestMessage) return;

  guestbookForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = guestName.value.trim() || "通りすがり";
    const site = guestSite.value.trim();
    const message = guestMessage.value.trim() || "来ました。";

    const entries = getGuestbookEntries();

    entries.unshift({
      name,
      site,
      message,
      date: new Date().toLocaleString("ja-JP")
    });

    saveGuestbookEntries(entries.slice(0, 30));
    renderGuestbook();

    guestName.value = "";
    guestSite.value = "";
    guestMessage.value = "";
  });

  renderGuestbook();
}

setupGuestbook();
