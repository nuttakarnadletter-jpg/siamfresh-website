const ACCESS_PASSWORD = "rp-siamfresh";
const ACCESS_KEY = "siamfresh-design-access";

const designEntryLinks = [
  {
    title: "แบบแรก",
    text: "Original homepage direction",
    href: "index.html",
  },
  {
    title: "Revise",
    text: "Corporate export homepage",
    href: "revise.html",
  },
  {
    title: "Revise V2",
    text: "Second revision workspace",
    href: "revise-v2.html",
  },
];

const buildDesignHome = () => {
  document.querySelector(".design-home")?.remove();

  const home = document.createElement("section");
  home.className = "design-home";
  home.setAttribute("aria-label", "Choose design entrance");
  home.innerHTML = `
    <div class="design-home-card">
      <img src="assets/logo2.svg" alt="Siam Fresh" />
      <p class="design-home-kicker">Preview Home</p>
      <h2>เลือกทางเข้าที่ต้องการ</h2>
      <p>เข้าสู่หน้าดีไซน์ที่ต้องการแก้ไขหรือพรีวิวต่อ</p>
      <div class="design-home-links">
        ${designEntryLinks
          .map(
            (link) => `
              <a href="${link.href}">
                <strong>${link.title}</strong>
                <span>${link.text}</span>
              </a>
            `,
          )
          .join("")}
      </div>
    </div>
  `;

  document.body.appendChild(home);
};

const buildLoginGate = () => {
  const login = document.createElement("section");
  login.className = "design-login";
  login.setAttribute("aria-label", "Design access login");
  login.innerHTML = `
    <div class="design-login-card">
      <img src="assets/logo2.svg" alt="Siam Fresh" />
      <h2>เข้าสู่หน้า Preview</h2>
      <p>กรอกรหัสเข้าชมเพื่อดูดีไซน์ Siam Fresh</p>
      <form class="design-login-form">
        <input type="password" name="password" placeholder="รหัสเข้าชม" autocomplete="current-password" aria-label="รหัสเข้าชม" />
        <button type="submit">เข้าสู่หน้าออกแบบ</button>
        <span class="design-login-error" aria-live="polite"></span>
      </form>
    </div>
  `;

  document.body.appendChild(login);

  const form = login.querySelector("form");
  const input = login.querySelector("input");
  const error = login.querySelector(".design-login-error");

  const unlock = (showHome = false) => {
    sessionStorage.setItem(ACCESS_KEY, "true");
    document.body.classList.remove("auth-pending");
    login.hidden = true;

    if (showHome) {
      buildDesignHome();
    }
  };

  if (sessionStorage.getItem(ACCESS_KEY) === "true") {
    unlock();
    return;
  }

  window.setTimeout(() => input.focus(), 0);

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (input.value.trim() === ACCESS_PASSWORD) {
      unlock(true);
      return;
    }

    error.textContent = "รหัสไม่ถูกต้อง กรุณาลองอีกครั้ง";
    input.select();
  });
};

const buildDesignSwitcher = () => {
  const path = window.location.pathname;
  const isRevise = path.endsWith("revise.html");
  const isReviseV2 = path.endsWith("revise-v2.html");
  const isIndex = !isRevise && !isReviseV2;
  const switcher = document.createElement("nav");
  switcher.className = "design-switcher";
  switcher.setAttribute("aria-label", "Design version switcher");
  switcher.innerHTML = `
    <a href="index.html"${isIndex ? ' class="is-active"' : ""}>แบบแรก</a>
    <a href="revise.html"${isRevise ? ' class="is-active"' : ""}>Revise</a>
    <a href="revise-v2.html"${isReviseV2 ? ' class="is-active"' : ""}>Revise V2</a>
  `;
  document.body.appendChild(switcher);
};

if (document.body.dataset.auth === "off") {
  document.body.classList.remove("auth-pending");
} else {
  buildLoginGate();
}
buildDesignSwitcher();

const CERT_LAYOUT_KEY = "siamfresh-cert-layout";
const CERT_LAYOUT_CLASS_PREFIX = "standards-layout-";
const certLayoutOptions = [
  { id: "logo-strip", label: "แถบเดียว" },
  { id: "split", label: "ซ้าย-ขวา" },
];

const getValidCertLayout = (layout) =>
  certLayoutOptions.some((option) => option.id === layout) ? layout : "split";

const applyCertLayout = (standardsSection, standardsInner, layout) => {
  standardsSection.dataset.certLayout = layout;
  standardsInner.className = `revise-standards-inner ${CERT_LAYOUT_CLASS_PREFIX}${layout}`;
  sessionStorage.setItem(CERT_LAYOUT_KEY, layout);
};

const buildCertLayoutSwitcher = () => {
  const standardsSection = document.querySelector(".revise-standards");
  const standardsInner = standardsSection?.querySelector(".revise-standards-inner");

  if (!standardsSection || !standardsInner || !window.location.pathname.endsWith("revise-v2.html")) {
    return;
  }

  const savedLayout = getValidCertLayout(sessionStorage.getItem(CERT_LAYOUT_KEY));
  applyCertLayout(standardsSection, standardsInner, savedLayout);

  const switcher = document.createElement("nav");
  switcher.className = "cert-layout-switcher";
  switcher.setAttribute("aria-label", "Certification logo layout switcher");
  switcher.innerHTML = `
    <p>ลองจัดวางโลโก้</p>
    <div>
      ${certLayoutOptions
        .map(
          (option) => `
            <button type="button" data-layout="${option.id}"${option.id === savedLayout ? ' class="is-active"' : ""}>
              ${option.label}
            </button>
          `,
        )
        .join("")}
    </div>
  `;

  document.body.appendChild(switcher);

  switcher.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-layout]");

    if (!button) {
      return;
    }

    const layout = getValidCertLayout(button.dataset.layout);
    applyCertLayout(standardsSection, standardsInner, layout);

    switcher.querySelectorAll("button[data-layout]").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });
  });
};

buildCertLayoutSwitcher();

const reviseHeroSlides = document.querySelectorAll(".revise-hero-media img");
const reviseHeroButtons = document.querySelectorAll(".revise-hero-controls button");
const reviseHeroPrev = document.querySelector(".revise-hero-prev");
const reviseHeroNext = document.querySelector(".revise-hero-next");
const reviseHero = document.querySelector(".revise-hero");

if (reviseHeroSlides.length && reviseHeroButtons.length) {
  let currentHeroSlide = 0;

  const showHeroSlide = (index) => {
    currentHeroSlide = (index + reviseHeroSlides.length) % reviseHeroSlides.length;

    reviseHeroSlides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-active", slideIndex === currentHeroSlide);
    });

    reviseHeroButtons.forEach((button, buttonIndex) => {
      button.classList.toggle("is-active", buttonIndex === currentHeroSlide);
    });

    if (reviseHero) {
      reviseHero.dataset.overlay = reviseHeroSlides[currentHeroSlide].dataset.overlay || "fruits";
    }
  };

  reviseHeroButtons.forEach((button, index) => {
    button.addEventListener("click", () => showHeroSlide(index));
  });

  reviseHeroPrev?.addEventListener("click", () => showHeroSlide(currentHeroSlide - 1));
  reviseHeroNext?.addEventListener("click", () => showHeroSlide(currentHeroSlide + 1));

  window.setInterval(() => {
    showHeroSlide(currentHeroSlide + 1);
  }, 6500);
}

const newsTrack = document.querySelector(".news-track");
const newsPrev = document.querySelector(".news-prev");
const newsNext = document.querySelector(".news-next");

if (newsTrack && newsPrev && newsNext) {
  const scrollNews = (direction) => {
    const firstCard = newsTrack.querySelector("article");
    const gap = parseFloat(getComputedStyle(newsTrack).columnGap) || 22;
    const cardWidth = firstCard ? firstCard.getBoundingClientRect().width + gap : newsTrack.clientWidth;
    newsTrack.scrollBy({ left: direction * cardWidth, behavior: "smooth" });
  };

  newsPrev.addEventListener("click", () => scrollNews(-1));
  newsNext.addEventListener("click", () => scrollNews(1));
}

const storySection = document.querySelector(".story");

if (storySection) {
  const revealStory = () => storySection.classList.add("is-visible");

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          revealStory();
          observer.disconnect();
        }
      },
      { threshold: 0.28 }
    );

    observer.observe(storySection);
  } else {
    revealStory();
  }
}

const shopTrack = document.querySelector(".shop-track");
const shopPrev = document.querySelector(".shop-prev");
const shopNext = document.querySelector(".shop-next");
const shopFilters = document.querySelectorAll(".shop-filters button");

if (shopTrack && shopPrev && shopNext) {
  const scrollProducts = (direction) => {
    const card = shopTrack.querySelector(".shop-card:not([hidden])");
    const gap = parseFloat(getComputedStyle(shopTrack).columnGap) || 0;
    const amount = card ? (card.getBoundingClientRect().width + gap) * 2 : shopTrack.clientWidth;

    shopTrack.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });
  };

  shopPrev.addEventListener("click", () => scrollProducts(-1));
  shopNext.addEventListener("click", () => scrollProducts(1));

  const matchesShopFilter = (card, filter) => {
    if (filter === "all") return true;
    if (filter === "best") return card.querySelector(".shop-badge")?.textContent.trim() === "Best Seller";
    if (filter === "stock") return Boolean(card.querySelector(".shop-stock"));
    return card.dataset.category === filter;
  };

  shopFilters.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      shopFilters.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle("is-active", isActive);
        item.setAttribute("aria-pressed", String(isActive));
      });

      shopTrack.querySelectorAll(".shop-card").forEach((card) => {
        card.hidden = !matchesShopFilter(card, filter);
      });

      shopTrack.scrollTo({ left: 0, behavior: "smooth" });
    });
  });
}

const articleTrack = document.querySelector(".article-grid");
const articlePrev = document.querySelector(".article-prev");
const articleNext = document.querySelector(".article-next");

if (articleTrack && articlePrev && articleNext) {
  const scrollArticles = (direction) => {
    const card = articleTrack.querySelector(".article-card");
    const gap = parseFloat(getComputedStyle(articleTrack).columnGap) || 0;
    const amount = card ? card.getBoundingClientRect().width + gap : articleTrack.clientWidth;

    articleTrack.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });
  };

  articlePrev.addEventListener("click", () => scrollArticles(-1));
  articleNext.addEventListener("click", () => scrollArticles(1));
}

const csrBanner = document.querySelector(".csr-banner");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (csrBanner && !reduceMotion) {
  let mouseX = 0;
  let frameRequested = false;

  const updateCsrParallax = () => {
    const rect = csrBanner.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollProgress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
    const y = Math.max(-24, Math.min(24, -scrollProgress * 34));
    const x = mouseX * 14;

    csrBanner.style.setProperty("--csr-parallax-x", `${x.toFixed(2)}px`);
    csrBanner.style.setProperty("--csr-parallax-y", `${y.toFixed(2)}px`);
    frameRequested = false;
  };

  const requestParallaxUpdate = () => {
    if (!frameRequested) {
      frameRequested = true;
      window.requestAnimationFrame(updateCsrParallax);
    }
  };

  csrBanner.addEventListener("pointermove", (event) => {
    const rect = csrBanner.getBoundingClientRect();
    mouseX = ((event.clientX - rect.left) / rect.width - 0.5) * -1;
    requestParallaxUpdate();
  });

  csrBanner.addEventListener("pointerleave", () => {
    mouseX = 0;
    requestParallaxUpdate();
  });

  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
  window.addEventListener("resize", requestParallaxUpdate);
  requestParallaxUpdate();
}
