/* 오늘의 생필품 핫딜 — deals.json 하나만 고치면 화면이 그대로 바뀝니다. */
(function () {
  "use strict";

  var DATA_URL = "deals.json";
  var state = { data: null, category: "all" };

  var won = function (n) {
    return Number(n).toLocaleString("ko-KR");
  };

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    return node;
  }

  function setText(id, value) {
    var node = document.getElementById(id);
    if (node && value) node.textContent = value;
  }

  /* ---------- header / notices ---------- */
  function paintMeta(data) {
    var site = data.site || {};
    setText("site-title", site.title);
    setText("site-tagline", site.tagline);
    setText("update-date", site.display_date);
    setText("footer-date", site.display_date);
    setText("footer-owner", site.owner);
    setText("price-notice", data.notice);
    setText("disclosure-text", data.disclosure);
    setText("footer-disclosure", data.disclosure);
    setText("intro-title", data.intro && data.intro.title);
    setText("intro-text", data.intro && data.intro.body);

    var count = (data.deals || []).length;
    var timeLabel = (site.price_checked_at || "").split(" ").pop();
    setText("update-time", (timeLabel ? timeLabel + " 기준 · " : "") + count + "개");

    var actions = document.getElementById("intro-actions");
    if (actions) {
      actions.textContent = "";
      [
        [site.blog_url, "블로그에서 보기"],
        [site.threads_url, "스레드에서 보기"]
      ].forEach(function (pair) {
        if (!pair[0]) return;
        var a = el("a", null, pair[1]);
        a.href = pair[0];
        a.target = "_blank";
        a.rel = "noopener";
        actions.appendChild(a);
      });
      if (!actions.children.length) actions.remove();
    }
  }

  /* ---------- tabs ---------- */
  function paintTabs(data) {
    var tabs = document.getElementById("tabs");
    if (!tabs) return;
    tabs.textContent = "";
    var deals = data.deals || [];
    var cats = (data.categories || [{ id: "all", label: "전체" }]).map(function (cat) {
      var n = cat.id === "all" ? deals.length : deals.filter(function (d) { return d.category === cat.id; }).length;
      return { id: cat.id, label: cat.label, count: n };
    });

    cats.forEach(function (cat) {
      var btn = el("button", "tab");
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.dataset.category = cat.id;
      btn.setAttribute("aria-selected", String(cat.id === state.category));
      btn.appendChild(document.createTextNode(cat.label));
      btn.appendChild(el("span", "count", String(cat.count)));
      btn.addEventListener("click", function () {
        state.category = cat.id;
        Array.prototype.forEach.call(tabs.children, function (node) {
          node.setAttribute("aria-selected", String(node === btn));
        });
        paintCards(data);
      });
      tabs.appendChild(btn);
    });
  }

  /* ---------- cards ---------- */
  function categoryLabel(id) {
    var cats = (state.data && state.data.categories) || [];
    for (var i = 0; i < cats.length; i++) {
      if (cats[i].id === id && id !== "all") return cats[i].label;
    }
    return "";
  }

  function buildCard(deal) {
    var card = el("article", "card");
    card.id = "deal-" + deal.id;

    var media = el("div", "card-media");
    var img = el("img");
    img.src = deal.image;
    img.alt = deal.image_alt || deal.name;
    img.loading = "lazy";
    img.decoding = "async";
    img.addEventListener("error", function () {
      img.classList.add("is-broken");
      media.classList.add("no-img");
    });
    media.appendChild(img);
    media.appendChild(el("span", "fallback", "🧺"));
    if (deal.discount_rate) media.appendChild(el("span", "badge", deal.discount_rate + "%"));
    if (deal.store) media.appendChild(el("span", "store-chip", deal.store));
    card.appendChild(media);

    var body = el("div", "card-body");

    var brandRow = el("div", "brand-row");
    brandRow.appendChild(el("span", "brand-name", deal.brand || ""));
    var catLabel = categoryLabel(deal.category);
    if (catLabel) {
      brandRow.appendChild(el("span", "dot", "·"));
      brandRow.appendChild(el("span", null, catLabel));
    }
    body.appendChild(brandRow);

    body.appendChild(el("h3", "name", deal.name));

    var priceRow = el("div", "price-row");
    var price = el("span", "price", won(deal.price));
    price.appendChild(el("small", null, "원"));
    priceRow.appendChild(price);
    if (deal.list_price && Number(deal.list_price) > Number(deal.price)) {
      priceRow.appendChild(el("span", "list-price", won(deal.list_price) + "원"));
    }
    body.appendChild(priceRow);
    if (deal.unit_price) body.appendChild(el("p", "unit-price", deal.unit_price));
    if (deal.point) body.appendChild(el("p", "point", deal.point));

    var actions = el("div", "card-actions");
    var link = (deal.shopping_connect_url || "").trim();
    if (link) {
      var cta = el("a", "cta", "최저가 보러가기 →");
      cta.href = link;
      cta.target = "_blank";
      cta.rel = "sponsored noopener noreferrer";
      actions.appendChild(cta);
    } else {
      var pending = el("span", "cta pending", "최저가 링크 준비 중");
      pending.setAttribute("aria-disabled", "true");
      actions.appendChild(pending);
      if (deal.url) {
        var infoLink = el("a", "source-link", "상품 정보 원문 보기 ↗");
        infoLink.href = deal.url;
        infoLink.target = "_blank";
        infoLink.rel = "noopener noreferrer nofollow";
        actions.appendChild(infoLink);
      }
    }
    body.appendChild(actions);

    card.appendChild(body);
    return card;
  }

  function paintCards(data) {
    var grid = document.getElementById("deal-grid");
    var empty = document.getElementById("empty-state");
    if (!grid) return;
    var deals = (data.deals || []).filter(function (deal) {
      return state.category === "all" || deal.category === state.category;
    });
    deals.sort(function (a, b) { return (b.discount_rate || 0) - (a.discount_rate || 0); });

    grid.textContent = "";
    deals.forEach(function (deal) { grid.appendChild(buildCard(deal)); });
    if (empty) empty.hidden = deals.length > 0;
  }

  function fail() {
    var grid = document.getElementById("deal-grid");
    if (!grid) return;
    var local = location.protocol === "file:";
    var box = el("div", "empty");
    box.appendChild(el("p", null, local
      ? "상품 목록(deals.json)을 브라우저 보안 정책 때문에 읽지 못했어요. 이 폴더에서 터미널을 열고 python3 -m http.server 를 실행한 뒤 http://localhost:8000 으로 열어 주세요."
      : "상품 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요."));
    if (!local) {
      var retry = el("button", "tab", "다시 불러오기");
      retry.type = "button";
      retry.style.marginTop = "10px";
      retry.addEventListener("click", function () { location.reload(); });
      box.appendChild(retry);
    }
    grid.appendChild(box);
    var time = document.getElementById("update-time");
    if (time) time.textContent = "";
  }

  fetch(DATA_URL, { cache: "no-cache" })
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (data) {
      state.data = data;
      paintMeta(data);
      paintTabs(data);
      paintCards(data);
    })
    .catch(function () {
      fail();
    });
})();
