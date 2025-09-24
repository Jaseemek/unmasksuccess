import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Story from "./Story";
import Initiatives from "./Services";
import Form from "./form";

/* ---------- useReveal hook (No changes needed here) ---------- */
function useReveal(selector = ".reveal", options = { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(selector));
    if (!("IntersectionObserver" in window) || els.length === 0) {
      els.forEach((el) => el.classList.add("reveal-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-in");
          io.unobserve(entry.target);
        }
      });
    }, options);
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [selector, options]);
}

/* ---------- Navigation Component (No changes needed here) ---------- */
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setIsMobileMenuOpen(false), [location]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/story", label: "Our Story" },
    { path: "/initiatives", label: "Programs" },
  ];

  return (
    <nav className={`navigation ${isScrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          <span className="logo-text">Silent Equity</span>
          <span className="logo-accent">.</span>
        </Link>
        <ul className="nav-links desktop-nav">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link to={link.path} className={`nav-link ${location.pathname === link.path ? "active" : ""}`}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="nav-cta desktop-nav">
          <Link to="/form" className="cta-nav-button" aria-label="Take Position">
            Take Position💰
          </Link>
        </div>
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className={`hamburger-line ${isMobileMenuOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${isMobileMenuOpen ? "open" : ""}`} />
          <span className={`hamburger-line ${isMobileMenuOpen ? "open" : ""}`} />
        </button>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
        <ul className="mobile-nav-links">
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link to={link.path} className={`mobile-nav-link ${location.pathname === link.path ? "active" : ""}`} onClick={() => setIsMobileMenuOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <Link to="/form" className="mobile-cta-button" onClick={() => setIsMobileMenuOpen(false)}>
              Take Position💰
            </Link>
          </li>
        </ul>
      </div>

      {isMobileMenuOpen && <div className="mobile-menu-backdrop" onClick={() => setIsMobileMenuOpen(false)} />}
    </nav>
  );
}

/* ---------- ScrollToTop Component (Updated: conditional smooth/instant + fade-in) ---------- */
function ScrollToTop() {
  const { pathname } = useLocation();
  const timeoutRef = useRef();

  useLayoutEffect(() => {
    // Force scroll to top for both document and window
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    document.body.classList.add("page-fade-in");
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      document.body.classList.remove("page-fade-in");
    }, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      document.body.classList.remove("page-fade-in");
    };
  }, [pathname]);

  return null;
}

/* ---------- ForexTicker Component (No changes needed here) ---------- */
function ForexTicker() {
  const pairs = useMemo(() => [
    "EUR/USD 1.1023",
    "USD/JPY 145.88",
    "GBP/USD 1.2765",
    "AUD/USD 0.6627",
    "USD/CAD 1.3421",
    "NZD/USD 0.6104",
    "USD/CHF 0.9312",
    "EUR/JPY 160.92",
  ], []);
  const items = [...pairs, ...pairs, ...pairs];
  return (
    <div className="ticker-wrap mobile-ticker">
      <div className="ticker mobile-responsive-ticker">
        {items.map((t, i) => (
          <span key={i} className="ticker-item">{t}</span>
        ))}
      </div>
    </div>
  );
}

/* ---------- NebulaLayer Component (No changes needed here) ---------- */
function NebulaLayer() {
  return (
    <div className="nebula-layer mobile-nebula" aria-hidden="true">
      <div className="nebula-cloud n1" />
      <div className="nebula-cloud n2" />
      <div className="nebula-noise" />
    </div>
  );
}

/* ---------- VideoModal Component (No changes needed here) ---------- */
const VideoModal = ({ videoId, onClose }) => {
  if (!videoId) return null;
  const youtubeEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
  return (
    <div className="video-modal-overlay mobile-modal-overlay" onClick={onClose}>
      <div className="video-modal-content mobile-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="video-modal-close mobile-modal-close" onClick={onClose}>&times;</button>
        <iframe width="100%" height="100%" src={youtubeEmbedUrl} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="What is Silent Equity?" className="mobile-responsive-iframe" />
      </div>
    </div>
  );
};

/* ---------- Hero Components (No changes needed here) ---------- */
function HeroBackground() {
  useEffect(() => {
    const root = document.documentElement;
    const onMouse = (e) => {
      root.style.setProperty("--tilt-x", ((e.clientX / window.innerWidth - 0.5) * 2).toFixed(3));
      root.style.setProperty("--tilt-y", ((e.clientY / window.innerHeight - 0.5) * 2).toFixed(3));
    };
    const onScroll = () => root.style.setProperty("--hero-scroll", String(window.scrollY * 0.02));
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return (
    <div className="hero-bg mobile-hero-bg" aria-hidden="true">
      <div className="hero-orb o1 mobile-orb" />
      <div className="hero-orb o2 mobile-orb" />
      <div className="hero-grid mobile-grid" />
      <div className="hero-arc a1 mobile-arc" />
    </div>
  );
}

function HeroParticles() {
  const N = 24;
  return (
    <div className="hero-particles mobile-particles" aria-hidden="true">
      {Array.from({ length: N }).map((_, i) => (
        <span key={i} className="hp mobile-hp" />
      ))}
      <span className="hp-streak s1 mobile-streak" />
      <span className="hp-streak s2 mobile-streak" />
    </div>
  );
}

function Hero({ onShowVideo }) {
  useReveal();
  return (
    <header className="hero section mobile-hero">
      <HeroBackground />
      <HeroParticles />
      <div className="hero-content container mobile-hero-content">
        <h1 className="reveal line mobile-hero-title">NO FAKE HYPE</h1>
        <h1 className="reveal line mobile-hero-title">NO GUESSING</h1>
        <p className="subtle reveal line mobile-hero-subtitle">A focused community— Controlled growth through discipline.</p>
        <button className="cta-button-video reveal line mobile-video-button" onClick={onShowVideo} aria-label="What is Silent Equity?" style={{ marginTop: "189px" }}>
          <span className="play-icon mobile-play-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="mobile-button-text">What is Silent Equity?</span>
        </button>
      </div>
    </header>
  );
}

/* ---------- WorkingProfessionalHook Section with Money Icons (No changes needed here) ---------- */
function WorkingProfessionalHook() {
  const problems = useMemo(() => [
    "No time to watch charts all day",
    "Emotional decisions kill profits",
    "Inconsistent results frustrate you",
    "Side income dreams stay dreams",
  ], []);

  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [index, setIndex] = useState(0);

  useReveal();

  useEffect(() => {
    let timeout;
    const currentText = problems[index];

    if (isTyping) {
      if (displayText.length < currentText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length + 1));
        }, 105); // Typing speed
      } else {
        setIsTyping(false);
        timeout = setTimeout(() => {
          setIsTyping(true);
          setIndex((prevIndex) => (prevIndex + 1) % problems.length);
          setDisplayText('');
        }, 1200); // Wait after typing
      }
    } else {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(currentText.slice(0, displayText.length - 1));
        }, 70); // Deleting speed
      } else {
        setIsTyping(true);
        setIndex((prevIndex) => (prevIndex + 1) % problems.length);
      }
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, index, problems]);

  // Flying emojis logic
  const flyingMoneySymbols = useMemo(() => ["💰", "💸"], []);
  const [positions, setPositions] = useState([]);

  useEffect(() => {
    setPositions(
      Array.from({ length: 15 }).map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        speed: 0.05 + Math.random() * 0.15,
        symbol: flyingMoneySymbols[Math.floor(Math.random() * flyingMoneySymbols.length)],
        size: 14 + Math.random() * 18,
        delay: Math.random() * 10,
      }))
    );
  }, [flyingMoneySymbols]);

  useEffect(() => {
    let animationFrame;
    const animate = () => {
      setPositions((pos) =>
        pos.map(({ x, y, speed, symbol, size, delay }) => {
          let newY = y - speed;
          if (newY < -10) newY = 110;
          return { x, y: newY, speed, symbol, size, delay };
        })
      );
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <section className="hook section">
      <div className="flying-money-container" aria-hidden="true">
        {positions.map(({ x, y, symbol, size, delay }, i) => (
          <span
            key={i}
            className="flying-money-symbol"
            style={{ left: `${x}%`, top: `${y}%`, fontSize: `${size}px`, animationDelay: `${delay}s`, opacity: 0.05 }}
          >
            {symbol}
          </span>
        ))}
      </div>

      <div className="hook-content container">
        <h2 className="reveal">Working 9-5 But Want Trading Income?</h2>
        <div className="problem-box reveal">
          <p className="typed-text">{displayText}<span className="cursor">|</span></p>
        </div>
        <div className="solution reveal">
          <h3>
            What if trading could be <span className="highlight">mechanical, not emotional?</span>
          </h3>
          <p>Introducing <strong>Silent Edge</strong> – The mathematical approach for working professionals</p>
        </div>
        <Link to="/form" className="cta-wrapper reveal">
          <button className="cta-button">Discover Silent Edge</button>
        </Link>
      </div>
    </section>
  );
}

/* ---------- CorePoints Component (No changes needed here) ---------- */
function CorePoints() {
  const points = useMemo(() => [
    {
      title: "MECHANICAL TRADING",
      description: "Remove emotions from trading—follow a proven system.",
      icon: "⚙️"
    },
    {
      title: "RISK-FIRST MINDSET",
      description: "Protect capital first—master position sizing and risk control.",
      icon: "🛡️"
    },
    {
      title: "TIME-EFFICIENT STRATEGIES",
      description: "Trade smart with minimal screen time using clear rules.",
      icon: "⏰"
    },
    {
      title: "DATA-DRIVEN DECISIONS",
      description: "Base every trade on backtested stats, not gut feeling.",
      icon: "📊"
    }
  ], []);

  useReveal(".card-item");

    return (
    <section className="core-points-section">
      <div className="cards-container">
        {points.map((point, index) => (
<div key={index} className="card-item reveal">
  <div className="card-shooting-stars">
    {Array.from({ length: 8 }).map((_, i) => (
      <span key={i} className="shooting-star" />
    ))}
  </div>
  <div className="card-content">
    <span className="card-icon">{point.icon}</span>
    <h3>{point.title}</h3>
    <p>{point.description}</p>
  </div>
</div>

        ))}
      </div>
    </section>
  );
}

/* ---------- FloatingCTA Component (No changes needed here) ---------- */
function FloatingCTA() {
  const [position, setPosition] = useState({ y: window.innerHeight * 0.6 });

  useEffect(() => {
    const paddingTop = 100;
    const paddingBottom = 150;
    let y = window.innerHeight * 0.5;
    let vy = 0.3;
    let raf;

    const step = () => {
      const h = window.innerHeight;
      y += vy;
      if (y < paddingTop) {
        y = paddingTop;
        vy = Math.abs(vy);
      }
      if (y > h - paddingBottom) {
        y = h - paddingBottom;
        vy = -Math.abs(vy);
      }
      setPosition({ y });
      raf = requestAnimationFrame(step);
    };

    const onScroll = () => {
      y += (window.scrollY - y) * 0.0002;
    };

    raf = requestAnimationFrame(step);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const goToDiscord = () => {
    window.location.href = "https://discord.gg/7gg93JBK";
  };

  return (
    <div className="floating-cta mobile-floating-cta" style={{ position: "fixed", right: "20px", top: `${position.y}px`, zIndex: 9999, pointerEvents: "auto" }}>
      <button
        onClick={goToDiscord}
        className="mobile-discord-button"
        style={{
          background: "linear-gradient(135deg,rgb(0, 101, 121) 0%,rgb(2, 74, 83) 100%)",
          border: "none",
          borderRadius: "50px",
          padding: "9px 9px",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "7px",
          fontSize: "10px",
          boxShadow: "0 4px 16px rgba(10, 69, 136, 0.3)",
          transition: "all 0.3s ease"
        }}
      >
        <svg width="20" height="16" viewBox="0 0 24 24" fill="currentColor" className="mobile-discord-icon">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.a.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419-.0189 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1568 2.4189Z"/>
        </svg>
        JOIN DISCORD
      </button>
    </div>
  );
}

/* ---------- BlogsPage Component (Corrected for card styling) ---------- */

function BlogsPage() {
  const allBlogs = [
    { title: "What Is Trading? 📈", slug: "what-is-trading" },
    { title: "Understanding the Forex Market 🌍", slug: "understanding-the-forex-market" },
    { title: "What is a broker and their types?👔 ", slug: "what-is-a-broker" },
    { title: "Particpants of Forex Market", slug: "participants-of-forex" },
    { title: "Impact of News Events 🗞️", slug: "impact-of-news-events" },
    { title: "George Soros- SCAM‼️", slug: "george-soros-scam" },
    { title: "NAV-Trader📉", slug: "navtrader-scam" },
    { title: "Satoshi Nakomoto-₿", slug: "satoshi" },
    { title: "Broker-SCAMS🚨", slug: "scams" },
  ];

  const [movedCards, setMovedCards] = useState(
    Array(allBlogs.length).fill(false)
  );

  useEffect(() => {
    allBlogs.forEach((_, i) => {
      setTimeout(() => {
        setMovedCards((prev) => {
          const copy = [...prev];
          copy[i] = true;
          return copy;
        });
      }, i * 250);
    });
  }, []);

  useReveal(".blog-post");

  return (
    <div className="blogs-page-container section">
      <h2 className="blogs-page-title">All Blogs</h2>
      <div className="blogs-grid">
        {allBlogs.map((blog, index) => (
          <Link
            key={index}
            to={`/blogs/${blog.slug}`}
            className={`blog-post ${movedCards[index] ? "moved" : "stacked"}`}
            style={{ "--card-index": index }}
          >
            <h3>{blog.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
}


/* ---------- Blogs Section on Home Page (No changes needed here) ---------- */
function BlogsSection() {
  const blogs = [
    { title: "What Is Trading? 📈", slug: "what-is-trading", cardClass: "trading-card" },
    { title: "Understanding the Forex Market 🌍", slug: "understanding-the-forex-market", cardClass: "forex-card" },
  ];

  useReveal();

  return (
    <section className="blogs-section section">
      <div className="blogs-container container">
        <h2 className="blogs-title reveal">Latest Blogs</h2>
        <div className="blogs-grid">
          {blogs.map((blog, index) => (
            <Link key={index} to={`/blogs/${blog.slug}`} className={`blog-post reveal ${blog.cardClass}`}>
              <h3>{blog.title}</h3>
            </Link>
          ))}
        </div>
        <div className="blogs-cta reveal">
          <Link to="/blogs" className="cta-button-blogs">
            Read More Blogs
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- Blog Pages (No changes needed here) ---------- */
function WhatIsTradingBlog() {
  return (
    <div className="full-blog-page section">
      <div className="container blog-content">
        <h2>What Is Trading? 📈</h2>
        <p>Trading is the act of buying and selling financial assets, such as stocks, currencies, or commodities, with the goal of profiting from short-term price movements. Unlike long-term investing, which focuses on gradual wealth building over years, trading is a more active approach aimed at capitalizing on market fluctuations over shorter time frames.</p>
        
        <hr />
        
        <h3>What is Positional Trading?</h3>
        <p>Positional trading is a strategy where traders hold positions for a medium to long-term period, typically weeks to months, or even longer. It's often compared to investing but differs in its objective. While an investor aims to build wealth over a very long period, a positional trader seeks to profit from a major trend or price shift. They often use a combination of fundamental and technical analysis to identify these trends and are less concerned with the day-to-day noise of the market.</p>
        
        <h3>What is Swing Trading?</h3>
        <p>Swing trading is a strategy that focuses on capturing "swings" in the market. Traders hold a position for more than a single day, but usually no longer than a few weeks. The goal is to profit from short- to medium-term price movements. Swing traders often rely on technical analysis, using indicators and chart patterns to identify potential entry and exit points.</p>
        
        <h3>What is Scalping?</h3>
        <p>Scalping is a high-frequency trading strategy where traders aim to profit from small price changes. Scalpers make a large number of trades, sometimes hundreds in a single day, each with a very small profit margin. This strategy requires extreme discipline and quick execution, as positions are typically held for only seconds or minutes. The idea is that these tiny profits, compounded over many trades, can lead to significant gains.</p>
        
        <h3>How can we differentiate between Trading and Investment?</h3>
        <p>The key differences between trading and investing lie in their time horizon, risk profile, and analytical approach:</p>
        <ul>
          <li>Time Horizon: Investing is long-term (years or decades), while trading is short-term (minutes to months).</li>
          <li>Goal:Investing focuses on gradual wealth building through compounding. Trading aims for frequent, smaller profits from market volatility.</li>
          <li>Risk:Trading generally involves higher risk due to short-term volatility and leverage. Investing is considered lower risk over the long run, although not without risk.</li>
          <li>Analysis:Investors primarily use fundamental analysis (company financials, market health). Traders heavily rely on technical analysis (charts, patterns, indicators).</li>
        </ul>
        
        <h3>What is Short Selling with an example?</h3>
        <p>Short selling is a trading strategy that allows you to profit from a decline in an asset's price. It's essentially betting against a stock or currency. The process involves three main steps:</p>
        <ol>
          <li>Borrowing: A trader borrows an asset (e.g., a stock) they don't own from their broker.</li>
          <li>Selling: They immediately sell the borrowed asset at its current, higher market price.</li>
          <li>Repurchasing (Covering): They wait for the price to drop, then buy the same number of shares back at the new, lower price to "cover" their position and return the borrowed shares to the broker. The profit is the difference between the initial selling price and the lower repurchase price.</li>
        </ol>
        <p>For example, imagine you believe a company's stock, currently at $100 per share, will drop. You borrow 10 shares and sell them for $1,000. If the price falls to $80, you buy back the 10 shares for $800. You return the shares to your broker and keep the $200 profit (minus any fees).</p>
      </div>
    </div>
  );
}

function UnderstandingForexBlog() {
  return (
    <div className="full-blog-page section">
      <div className="container blog-content">
        <h2>Understanding the Forex Market 🌍</h2>
        <p>The forex market is the world's largest and most liquid financial market, operating 24 hours a day, five days a week. It's a global, decentralized marketplace where currencies are exchanged. Forex trading is the act of buying one currency and simultaneously selling another to profit from fluctuations in their exchange rates. The value of an individual currency is always relative to another, which is why currencies are traded in pairs. A currency pair, such as EUR/USD, consists of a base currency (EUR) and a quote currency (USD). The price of a currency pair tells you how much of the quote currency you need to buy one unit of the base currency. There are eight major currencies that most traders focus on: USD, EUR, JPY, GBP, AUD, CAD, CHF, and NZD.</p>

        <hr />
        
        <h3>1. Base and Quote in a Currency Pair</h3>
        <p>In a currency pair, the base currency is the currency on the left, and the quote currency is the one on the right. The base currency is the asset you are buying or selling, while the quote currency is what you are using to make that transaction. The price of a currency pair tells you how much of the quote currency you need to buy one unit of the base currency.</p>
        <p>Example: In the EUR/USD currency pair, EUR is the base currency and USD is the quote currency. If the exchange rate is 1.1500, it means you need $1.15 to buy 1 euro.</p>
        <p>Market Fluctuations: When the base currency strengthens against the quote currency, the market price of the pair rises. Conversely, when the base currency weakens against the quote currency, the market price of the pair falls.</p>

        <h3>2. Major Currency Pairs</h3>
        <p>Major currency pairs are any currency pairs that include the US dollar (USD) as either the base or the quote currency. They are the most frequently traded pairs in the forex market and are known for their high liquidity.</p>
        <p>Here is a list of major currency pairs:</p>
        <ul>
            <li>EUR/USD (Euro vs. US Dollar)</li>
            <li>USD/JPY (US Dollar vs. Japanese Yen)</li>
            <li>GBP/USD (British Pound vs. US Dollar)</li>
            <li>AUD/USD (Australian Dollar vs. US Dollar)</li>
            <li>USD/CHF (US Dollar vs. Swiss Franc)</li>
            <li>USD/CAD (US Dollar vs. Canadian Dollar)</li>
            <li>NZD/USD (New Zealand Dollar vs. US Dollar)</li>
        </ul>

        <h3>3. What is Spread?</h3>
        <p>The spread is the difference between the bid (selling) and ask (buying) price of a currency pair. It is essentially the transaction cost you pay to your broker to execute a trade. A smaller or "tighter" spread is more favorable for traders, as it means lower trading costs. Spreads can be fixed or variable, changing based on market volatility and liquidity.</p>

        <h3>4. Lots and Lot Types</h3>
        <p>A lot is a standardized unit of measurement used in forex trading to represent a specific number of currency units. It helps traders manage their position sizes.</p>
        <p>There are three main types of lots:</p>
        <ul>
            <li>Standard Lots: A standard lot is 100,000 units of the base currency.</li>
            <li>Mini Lots: A mini lot is 10,000 units of the base currency, which is one-tenth of a standard lot.</li>
            <li>Micro Lots: A micro lot is 1,000 units of the base currency, which is one-hundredth of a standard lot.</li>
        </ul>

        <h3>5. What is Swap?</h3>
        <p>A swap is an overnight interest rate that is either paid or received by a trader for holding a position open overnight. The swap rate is determined by the interest rate differential between the two currencies in a pair. If the interest rate of the base currency is higher than the quote currency, you may earn a positive swap. Conversely, if the base currency's interest rate is lower, you will likely pay a negative swap.</p>

        <h3>6. What is Leverage?</h3>
        <p> Leverage is a tool that allows traders to control a larger position in the market with a smaller amount of capital. It involves borrowing funds from a broker to amplify the size of a trade. While leverage can magnify potential profits, it also significantly increases the risk of losses. For example, with 1:100 leverage, a trader can control a $100,000 position with just $1,000 of their own capital.</p>

      </div>
    </div>
  );
}
function WhatIsBrokerBlog() {
  return (
    <div className="full-blog-page section">
      <div className="container blog-content">
        <h2>What Is a Broker? </h2>
        <p>
          A Forex broker is an intermediary or a firm that connects individual traders and institutions to the foreign exchange market, allowing them to buy and sell currencies. Brokers provide access to trading platforms, leverage, market data, and other tools, acting as a middleman by facilitating trades and providing liquidity in the global over-the-counter (OTC) forex market.
        </p>
        <h2>Types Of Brokers</h2>
        <h3>STP (Straight Through Processing) Brokers</h3>
        <p><strong>How they work:</strong> Your trade orders are sent directly to a network of external liquidity providers (such as banks) who execute them at their best available prices.</p>
        <p><strong>Profit model:</strong> The broker adds a markup to the spread received from the liquidity provider, generating their profit from this difference.</p>
        <p><strong>Transparency:</strong> There is no direct dealing desk, but you don't see the full order book.</p>
        <p><strong>Cost:</strong> Often no separate commission; the cost is built into the variable spread.</p>
        <p><strong>Best for:</strong> Traders who want a straightforward, non-dealing desk execution and don't mind potential variable spreads.</p>

        <h3>ECN (Electronic Communication Network) Brokers</h3>
        <p><strong>How they work:</strong> They use an electronic network to match your buy and sell orders directly with other participants in the market, including other traders and interbank institutions.</p>
        <p><strong>Profit model:</strong> ECN brokers charge a commission on each trade, providing clients with the raw, lowest possible spreads from the liquidity providers.</p>
        <p><strong>Transparency:</strong> Offers full visibility of the market's order book, leading to high transparency.</p>
      </div>
    </div>
  );
}
function ForexMarketParticipantsBlog() {
  return (
    <div className="full-blog-page section">
      <div className="container blog-content">
        <h2>Forex Market Participants 🌐</h2>
        <p>
          Participants in the forex market include Central Banks, Commercial Banks, Corporations, Investment Funds (Hedge Funds, Pension Funds), Brokers, and Retail Traders. These players interact through the market for various reasons, such as managing currency risk, facilitating international trade, speculating on currency movements, or managing foreign reserves.
        </p>

        <h3>Central Banks</h3>
        <p>
          Act to manage their domestic currency's value through monetary policy and direct intervention. They also manage foreign exchange reserves.
        </p>

        <h3>Commercial Banks</h3>
        <p>
          The largest and most influential participants, they trade currencies for their own accounts and to meet client demands for foreign exchange. They act as liquidity providers, ensuring smooth trading.
        </p>

        <h3>Corporations</h3>
        <p>
          Businesses involved in international trade use the forex market to hedge against currency fluctuations and to make payments in foreign currencies.
        </p>

        <h3>Investment Funds</h3>
        <p>
          This category includes hedge funds, pension funds, and asset managers who trade currencies to generate profits or to manage international investments.
        </p>

        <h3>Brokers</h3>
        <p>
          Facilitate transactions between buyers and sellers, connecting various market participants and providing access to trading platforms.
        </p>

        <h3>Retail Traders/Speculators</h3>
        <p>
          Individuals who buy and sell currencies to profit from short-term price changes.
        </p>
      </div>
    </div>
  );
}
function ImpactOfNewsEventsBlog() {
  return (
    <div className="full-blog-page section">
      <div className="container blog-content">
        <h2>The Impact of News Events in Forex Markets</h2>
        <p>
          News events have a profound and often immediate impact on the foreign exchange (forex) market. They are a cornerstone of fundamental analysis, as they provide insights into the health of an economy, which in turn influences a country’s currency value. Traders and investors closely monitor a wide range of economic, political, and even geopolitical events to anticipate market movements. The key to understanding this impact is the concept of market expectations.
        </p>
        <p>
          Before a major news release, the market has already priced in a certain outcome. The real market-moving power comes from the deviation between the expected figure and the actual reported number.
        </p>

        <h3>Positive Surprise</h3>
        <p>
          If the actual number is better than expected, it can lead to a rapid appreciation of the country’s currency. A strong economic indicator suggests a healthy economy, attracting foreign investment and potentially leading to higher interest rates.
        </p>

        <h3>Negative Surprise</h3>
        <p>
          Conversely, if the actual number is worse than expected, the currency is likely to depreciate. This signals economic weakness, causing investors to lose confidence and triggering capital outflow.
        </p>

        <h3>High Volatility</h3>
        <p>
          News events, especially high-impact releases, often cause significant volatility. This presents both profit opportunities and risks. Experienced traders may wait for initial volatility to subside and a clear trend to emerge before entering a position.
        </p>

        <h3>Key Event Types</h3>
        <ul>
          <li><strong>Interest Rate Decisions:</strong> Central bank decisions are a primary driver. A rate hike can strengthen a currency by making assets more attractive to foreign investors.</li>
          <li><strong>Employment Data:</strong> A strong job market signals economic health, which can lead to increased consumer spending and inflation, prompting rate hikes.</li>
          <li><strong>Inflation Reports:</strong> Rising inflation data may trigger rate hikes to cool the economy, boosting the currency.</li>
          <li><strong>Gross Domestic Product (GDP):</strong> GDP measures economic output. A strong report indicates growth and can lead to currency appreciation.</li>
        </ul>

        <h2>Key Economic Indicators Explained</h2>

        <h3>1. Federal Open Market Committee (FOMC)</h3>
        <p>
          The FOMC sets the federal funds rate and monetary policy tools. Its decisions and statements are the most important news for the U.S. dollar.
        </p>
        <p>
          <strong>Hawkish Stance:</strong> Prefers tighter policy (rate hikes), strengthening the USD.  
          <strong>Dovish Stance:</strong> Prefers looser policy (rate cuts), weakening the USD.
        </p>

        <h3>2. Non-Farm Payrolls (NFP)</h3>
        <p>
          The NFP report measures monthly employment changes excluding farming and government.  
          <strong>Higher-than-expected NFP:</strong> Signals job growth, may lead to rate hikes, strengthening the USD.  
          <strong>Lower-than-expected NFP:</strong> Signals weakening labor market, may weaken the USD.
        </p>

        <h3>3. Unemployment Claims</h3>
        <p>
          Weekly claims measure initial filings for benefits.  
          <strong>Lower claims:</strong> Indicates a strong job market, positive for the USD.  
          <strong>Higher claims:</strong> Signals weakening labor market, negative for the USD.
        </p>

        <h3>4. Consumer Price Index (CPI)</h3>
        <p>
          CPI tracks urban consumer price changes.  
          <strong>Higher-than-expected CPI:</strong> May prompt rate hikes, strengthening the currency.  
          <strong>Lower-than-expected CPI:</strong> May lead to rate cuts, weakening the currency.
        </p>

        <h3>5. Gross Domestic Product (GDP)</h3>
        <p>
          GDP is the total value of goods and services produced.  
          <strong>Strong GDP:</strong> Indicates growth, leading to currency appreciation.  
          <strong>Weak GDP:</strong> Signals slowdown, leading to currency depreciation.
        </p>
      </div>
    </div>
  );
}
function GeorgeSorosBlog() {
  return (
    <div className="full-blog-page section">
      <div className="container blog-content">
        <h2>George Soros: The Trader, the Billionaire, and the Controversies</h2>
        
        <img
  src="https://iili.io/KcDdAzB.webp"
  alt="George Soros"
  style={{ width: "240px", float: "right", marginLeft: "20px", marginBottom: "20px", borderRadius: "8px" }}
/>

        <p>
          George Soros is a legendary investor and philanthropist, but his name is also synonymous with some of the most dramatic financial events of the last century. He is often referred to as "The Man Who Broke the Bank of England," a title he earned not through illegal scams, but through a highly calculated and high-stakes speculative trade.
        </p>
        <p>
          The key to understanding these events is to separate the sensational headlines from the actual financial mechanics. Soros's strategy often involved identifying what he believed were fundamental mispricings in the market and betting massive amounts of capital on his analysis.
        </p>
        
        <h3>Black Wednesday: The Bet Against the British Pound</h3>
        <p><strong>The Context:</strong> At the time, the British pound (GBP) was part of the European Exchange Rate Mechanism (ERM), a system designed to stabilize exchange rates between European currencies. The UK's government had pegged the pound to the German mark (DEM) at a rate that many economists, including Soros, believed was unsustainable. The British economy was struggling with high inflation and a recession, while Germany's economy was strong. The high interest rates required to maintain the pound's value in the ERM were crippling Britain's economy.</p>
        <p><strong>Soros's "Scam" (The Trade):</strong> Soros, through his Quantum Fund, made a colossal bet against the pound. This was a "short-selling" strategy:</p>
        <ul>
          <li>He borrowed billions of pounds.</li>
          <li>He sold these borrowed pounds on the open market for other currencies, primarily German marks.</li>
        </ul>
        <p>This massive selling pressure—combined with similar actions by other speculators—created a huge supply of pounds, driving its value down.</p>
        <p>The Bank of England tried to defend the pound's value by buying it back on the market and raising interest rates. However, Soros and the other speculators had more capital than the Bank of England had foreign reserves.</p>
        <p>The government eventually capitulated. Faced with the prospect of exhausting its reserves and still failing to prop up the currency, the UK pulled the pound from the ERM and let its value float freely. The pound immediately devalued.</p>
        <p>Soros profited handsomely. He bought back the devalued pounds at a much lower price to repay his loan, pocketing a profit of over $1 billion.</p>

        <h3>The Controversy and the "Scam" Label</h3>
        <p>Was this a scam? From a legal standpoint, no. Soros used a standard financial tool (short selling) to profit from a market imbalance. His critics, however, would argue that he deliberately created a currency crisis for personal gain, causing economic harm to the UK. The devaluation hurt ordinary citizens, as it made imports more expensive and reduced the value of their savings.</p>
        <p>Soros, for his part, has always maintained that he didn't create the crisis; he simply exploited a flaw that was already there. He saw a government trying to maintain an economically unsound policy, and he bet against it, just as a trader would bet against an overvalued stock. He argued his actions were a form of "market discipline."</p>

        <h3>The Asian Financial Crisis (1997)</h3>
        <p>Soros was also accused of being a "highwayman of the global economy" by Malaysian Prime Minister Mahathir Mohamad during the 1997 Asian financial crisis. Mahathir blamed Soros for the collapse of the Malaysian currency (the ringgit).</p>
        <p>While Soros's fund did engage in currency speculation in Southeast Asia, many economists argue that the crisis was caused by a combination of factors, including weak financial regulations and over-leveraged economies in the region. There is no evidence that Soros single-handedly caused the collapse. His actions may have accelerated a crisis that was already brewing, but they were not the sole cause.</p>

        <h3>The Verdict for Your Blog Post</h3>
        <ul>
          <li>Start with the sensational nickname: "The Man Who Broke the Bank of England."</li>
          <li>Explain the financial context: Talk about the ERM and why the British pound was vulnerable.</li>
          <li>Detail the "scam" (the trade): Describe the process of short-selling in simple terms.</li>
          <li>Present both sides of the debate: Was Soros a genius who spotted an inevitable market correction, or a ruthless speculator who caused economic hardship for millions?</li>
          <li>Conclude with the broader impact: Soros's actions in 1992 and 1997 sparked a global debate about the power of hedge funds and the regulation of speculative capital.</li>
        </ul>
      </div>
    </div>
  );
}
function NavinderSaraoBlog() {
  return (
    <div className="full-blog-page section">
      <div className="container blog-content">
        <h2>The Man Who Traded from a Bedroom and "Crashed" the Market</h2>
        
        <img 
          src="https://iili.io/KcDYhga.jpg" 
          alt="Navinder Singh Sarao" 
          style={{ width: "240px", float: "right", marginLeft: "20px", marginBottom: "20px", borderRadius: "8px" }}
        />
        
        <p>
          The name "Nav Trader" may not be as well-known as Wall Street giants, but his real name, Navinder Singh Sarao, is etched into the history of financial crime. Operating not from a gleaming skyscraper, but from his parents' home in a London suburb, Sarao was accused of playing a significant role in one of the most mysterious and rapid market plunges in history: the 2010 "Flash Crash."
          This story isn't about a traditional Ponzi scheme or a fake investment platform. It's about a highly specific, and now illegal, form of market manipulation known as "spoofing."
        </p>

        <h3>The "Scam": What is Spoofing?</h3>
        <p>
          Spoofing is a deceptive practice where a trader places large orders on a trading exchange with the intention of canceling them before they are ever executed. The goal is not to actually buy or sell the asset, but to manipulate the perception of supply and demand in the market.
        </p>
        <p>
          Here's how Navinder Sarao allegedly used this technique:
        </p>
        <ul>
          <li><strong>Creating False Demand (or Supply):</strong> Sarao would use an automated trading program to place thousands of large sell orders on the E-mini S&P 500 futures market. These orders were placed at various price points, creating a "wall" of apparent supply.</li>
          <li><strong>Tricking Other Traders:</strong> Other automated trading systems, often run by large financial institutions, would see this massive sell wall. Thinking that a huge number of sellers were entering the market, these systems would react by driving down the price of the futures contracts.</li>
          <li><strong>Profiting from the Manipulation:</strong> As the price dropped, Sarao would cancel his large, fake sell orders. He would then buy the now-cheaper contracts at the lower price. He would then sell them for a small profit when the price rebounded. He repeated this process thousands of times a day.</li>
        </ul>
        <p>
          This may sound like a small-scale operation, but the sheer volume and speed of his trades allowed him to make millions of dollars. The U.S. government charged that he profited over $40 million between 2010 and 2014 from this manipulation.
        </p>

        <h3>The "Flash Crash" Connection</h3>
        <p>
          On May 6, 2010, the U.S. stock market experienced a historic "Flash Crash." In just a few minutes, the Dow Jones Industrial Average plummeted by over 600 points before recovering. The cause was initially a mystery.
        </p>
        <p>
          When Navinder Sarao was arrested in 2015, authorities alleged that his "dynamic layering" and spoofing activities had significantly contributed to the instability that triggered the Flash Crash. While he wasn't the sole cause (a large, automated sell order from a mutual fund was also a major factor), his persistent manipulative behavior was seen as a key accelerant that turned a sharp sell-off into a full-blown crash.
        </p>

        <h3>The Arrest and Aftermath</h3>
        <p>
          Sarao, who lived a modest life despite his wealth, was arrested in London. He was charged with a slew of crimes, including wire fraud, commodities fraud, and spoofing, which carried a potential sentence of over 300 years in prison. He was eventually extradited to the U.S.
        </p>
        <p>
          In 2016, Sarao pleaded guilty to one count of wire fraud and one count of spoofing. As part of his plea deal, he agreed to forfeit a significant portion of his ill-gotten gains and became a key cooperating witness for the U.S. Department of Justice. The fact that a single trader, working from a home office, could allegedly contribute to a massive market event, sent shockwaves through the financial world and highlighted the need for new regulations to combat high-frequency trading manipulation.
        </p>

        <h3>Conclusion for Blog</h3>
        <p>
          The story of Navinder Singh Sarao is a perfect example of how the landscape of financial scams has evolved. It's no longer just about elaborate cons or false promises. With the rise of technology and automated trading, a single individual with a clever algorithm can legally operate within the system while using deceptive tactics that have a ripple effect on global markets. His story serves as a powerful reminder that "scams" in the modern era can be far more complex and subtle than they appear.
        </p>
      </div>
    </div>
  );
}

function SatoshiNakamotoBlog() {
  return (
    <div className="full-blog-page section">
      <div className="container blog-content">
        <h2>The Final Mystery of Satoshi Nakamoto: Was the Creator an Old-School Cypherpunk Who Took the Secret to the Grave?</h2>

        <img 
          src="https://iili.io/KcDyu1a.webp" 
          alt="Hal Finney" 
          style={{ width: "240px", float: "right", marginLeft: "20px", marginBottom: "20px", borderRadius: "8px" }}
        />

        <p>
          The search for Satoshi Nakamoto, the anonymous creator of Bitcoin, has become one of the great online mysteries. While many people have been accused of being Satoshi, and some have even made the claim themselves, one of the most compelling and poignant theories centers on a man named Hal Finney. This is not a story of a hidden identity in plain sight, but a theory that suggests the secret may be gone forever.
        </p>

        <h3>The Clues: A Digital Friendship</h3>
        <p>
          Hal Finney was a legendary figure in the cypherpunk community, a group of activists and programmers who advocated for privacy and cryptography long before Bitcoin existed. He had been working on his own digital cash system, called RPOW (Reusable Proofs of Work), and was a perfect person for Satoshi to connect with.
        </p>

        <p>The First Transaction: On January 12, 2009, just days after the Bitcoin network went live, Satoshi Nakamoto sent the very first Bitcoin transaction to Hal Finney. This act alone shows the trust and collaboration between the two. Finney was the second person to run the Bitcoin software and was in regular communication with Satoshi.</p>

        <p>The Writing Style: A journalist hired a writing analysis firm to compare Finney's known writings to Satoshi's. The analysis found that Finney's style was a closer match than any other candidate they had tested. This suggests a deep connection, perhaps even a shared voice.</p>

        <p>A Shared Neighborhood: In a bizarre twist of fate, Finney lived just a few blocks away from a man named Dorian Satoshi Nakamoto in Temple City, California. This man, whose birth name was Satoshi Nakamoto, was mistakenly identified by a major news magazine as the creator of Bitcoin, leading to a media firestorm. It seems incredibly unlikely to be a mere coincidence that Finney, an early Bitcoin collaborator, lived so close to a man with the exact same name as the creator. This led to speculation that Finney may have used his neighbor’s name as a pseudonym.</p>

        <h3>The Tragic Conclusion</h3>
        <p>
          The most compelling piece of the puzzle, however, is a deeply human one. Satoshi's final communication with the Bitcoin community was in April 2011. After that, the trail went cold. Satoshi disappeared.
        </p>

        <p>
          It was around this same time that Hal Finney's health began to decline. He had been diagnosed with Amyotrophic Lateral Sclerosis (ALS), a progressive and fatal neurodegenerative disease that gradually robs a person of their ability to move and communicate. Finney's last public statement on a Bitcoin forum was in 2013, where he wrote about his battle with the disease.
        </p>

        <p>
          He passed away in August 2014. The fact that Satoshi Nakamoto's communication ceased right when Finney’s health was failing has led many to a somber conclusion: Satoshi was Hal Finney, or at least a part of the team. The reason the bitcoins mined by Satoshi have never been moved is that the private keys went with him.
        </p>

        <p>
          This theory offers a satisfying and bittersweet answer to the mystery. It's not about a person hiding from the world out of fear of their wealth or fame, but a person whose time simply ran out. If true, it means that the secret of Satoshi Nakamoto's identity is not a locked door, but a secret that died with its creator, a story buried with a true pioneer of cryptography.
        </p>
      </div>
    </div>
  );
}
function FakeBrokerAndForexScamsBlog() {
  return (
    <div className="full-blog-page section">
      <div className="container blog-content">
        <h2>The "Fake Broker" and Unregistered Firms, and Other Forex Scams</h2>

        <img 
          src="https://iili.io/KcbYi9j.png" 
          alt="Fake Broker Scam" 
          style={{ width: "240px", float: "right", marginLeft: "20px", marginBottom: "20px", borderRadius: "8px" }}
        />

        <h3>1. The "Fake Broker" and Unregistered Firms</h3>
        <p>
          This is perhaps the most straightforward scam, yet it’s surprisingly effective. Fraudsters set up fake websites that mimic legitimate brokerage firms, often with professional-looking logos, contact information, and promises of high returns. These entities are not registered with any recognized financial regulatory body, such as the Financial Conduct Authority (FCA) in the UK or the Commodity Futures Trading Commission (CFTC) in the U.S. They will take a client’s deposit but never actually execute any trades. When the client tries to withdraw their funds, they’re met with endless excuses, additional fees, or simply no response.
        </p>
        <h4>How to Spot and Avoid It:</h4>
        <ul>
          <li>Verify Regulation: Always verify a broker's regulatory status. Use official regulatory websites to confirm registration and license number.</li>
          <li>Check for Clones: Be wary of "clone firms" which copy legitimate firms but use their own details.</li>
          <li>Beware of Unsolicited Offers: Legitimate brokers rarely cold-call or pressure with high-sales tactics.</li>
        </ul>

        <h3>2. High-Yield Investment Programs (HYIPs) and Ponzi Schemes</h3>
        <p>
          Scammers posing as brokers or fund managers promise incredibly high, guaranteed returns with little risk. They use fake account statements to show "success." The money from new investors pays off older investors, creating illusion. When new money stops, the scheme collapses and scammers disappear.
        </p>
        <h4>How to Spot and Avoid It:</h4>
        <ul>
          <li>Unrealistic Promises: Guaranteed monthly returns of 10% or more are almost always scams.</li>
          <li>Focus on Recruitment: Emphasis on recruiting new members over investment quality is a red flag.</li>
        </ul>

        <h3>3. Automated Trading and "Robot" Scams 🤖</h3>
        <p>
          Fraudsters sell automated trading systems ("bots") promising consistent profits with no human involvement. Slick marketing and fake testimonials lure victims, but the systems typically lose money or are designed to do so.
        </p>
        <h4>How to Spot and Avoid It:</h4>
        <ul>
          <li>Lack of Verifiable Track Record: Legitimate systems provide third-party audited track records.</li>
          <li>Exorbitant Prices: High fees are suspicious, especially without proof of results.</li>
          <li>Beware of Complexity: Confusing jargon can hide the truth.</li>
        </ul>

        <h3>4. Spreads and Slippage Manipulation</h3>
        <p>
          Some brokers manipulate spreads and slippage to reduce trader profits. Artificially widened spreads and excessive slippage cause client losses.
        </p>
        <h4>How to Spot and Avoid It:</h4>
        <ul>
          <li>Read Reviews: Look for complaints about wide spreads or slippage.</li>
          <li>Check Trading Conditions: Reputable brokers are transparent about spreads and fees.</li>
        </ul>

        <h3>Protecting Yourself in the Forex Market</h3>
        <p>
          The best defense is skepticism and due diligence. Always verify broker regulation, read independent reviews, test demo accounts, and start trading with small amounts to test withdrawal and transparency.
        </p>
      </div>
    </div>
  );
}


/* ---------- PrivacyPolicy Component ---------- */
function PrivacyPolicy() {
  useReveal();

  return (
    <div className="privacy-policy-page section">
      <div className="container">
        <div className="privacy-content">
          <h1 className="reveal">Privacy Policy</h1>
          <p className="last-updated reveal">Last updated: September 24, 2025</p>

          <div className="privacy-section reveal">
            <p>
              Silent Equity ("we", "our", or "us") values your privacy. This Privacy Policy explains how we collect, use, share, and protect your information when you use our services, website, or applications ("Service"). By using our Service, you agree to this Privacy Policy.
            </p>
          </div>

          <div className="privacy-section reveal">
            <h2>1. Interpretation & Definitions</h2>
            <ul>
              <li><strong>Account:</strong> A unique account created to access our Service.</li>
              <li><strong>Affiliate:</strong> Any entity controlled by, controlling, or under common control with Silent Equity.</li>
              <li><strong>Company:</strong> Silent Equity, registered at 11 Regent Street, Leeds, United Kingdom.</li>
              <li><strong>Device:</strong> Any computer, smartphone, or tablet used to access our Service.</li>
              <li><strong>Personal Data:</strong> Any information that identifies an individual.</li>
              <li><strong>Service:</strong> All products, websites, platforms, and training offered by Silent Equity.</li>
              <li><strong>Service Provider:</strong> Third parties assisting Silent Equity in delivering services.</li>
              <li><strong>Usage Data:</strong> Information collected automatically, such as IP address, browser, or device details.</li>
              <li><strong>You:</strong> The individual or entity using our Service.</li>
            </ul>
          </div>

          <div className="privacy-section reveal">
            <h2>2. Data We Collect</h2>
            <ul>
              <li><strong>Personal Data:</strong> Name, email, phone number, billing information, profile details.</li>
              <li><strong>Usage Data:</strong> IP address, browser type, pages visited, session times, device info.</li>
              <li><strong>Mobile Device Data (with permission):</strong> Location, contacts, photos, camera access.</li>
            </ul>
          </div>

          <div className="privacy-section reveal">
            <h2>3. How We Use Your Data</h2>
            <ul>
              <li>To provide and maintain our Service</li>
              <li>To communicate updates, support, and promotions</li>
              <li>To process payments and deliver training</li>
              <li>For analytics and service improvement</li>
              <li>To comply with legal obligations</li>
            </ul>
            <p>
              We may also collect and process specific data related to enrollment in our <strong>Guarantee Edge Course</strong> and our <strong>Code of Consistency Course</strong> (progress records, mentorship details, assignments, and evaluations). This is to ensure structured learning, mentorship quality, and certification standards.
            </p>
          </div>

          <div className="privacy-section reveal">
            <h2>4. Data Sharing</h2>
            <p>We may share data with:</p>
            <ul>
              <li>Service Providers (payment, analytics, hosting)</li>
              <li>Affiliates under this same policy</li>
              <li>Business transfers (merger, acquisition)</li>
              <li>Legal authorities when required</li>
              <li>With your consent</li>
            </ul>
          </div>

          <div className="privacy-section reveal">
            <h2>5. Data Retention</h2>
            <p>
              We keep Personal Data only as long as necessary for the purposes stated. You may request deletion or correction of your data at any time (subject to legal obligations).
            </p>
          </div>

          <div className="privacy-section reveal">
            <h2>6. Data Transfer</h2>
            <p>
              Your data may be stored outside your country. Silent Equity ensures adequate protection measures for all transfers.
            </p>
          </div>

          <div className="privacy-section reveal">
            <h2>7. Your Rights</h2>
            <ul>
              <li>Request access, correction, or deletion of your data</li>
              <li>Withdraw consent for optional data processing</li>
              <li>Restrict or object to certain processing activities</li>
            </ul>
          </div>

          <div className="privacy-section reveal">
            <h2>8. Security</h2>
            <p>
              We use standard security practices to protect your information, though no method is 100% secure.
            </p>
          </div>

          <div className="privacy-section reveal">
            <h2>9. Children's Privacy</h2>
            <p>
              Silent Equity does not knowingly collect information from individuals under 13. If we discover such data, we will delete it immediately.
            </p>
          </div>

          <div className="privacy-section reveal">
            <h2>10. Changes to Policy</h2>
            <p>
              We may update this Privacy Policy. Updates will be posted here with a new "Last updated" date.
            </p>
          </div>

          <div className="privacy-section reveal">
            <h2>11. Contact Us</h2>
            <p>
              <strong>Email:</strong> <a href="mailto:unmask@thesilentequity.com">unmask@thesilentequity.com</a><br/>
              <strong>Address:</strong> 11 Regent Street, Leeds, United Kingdom
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ---------- TermsConditions Component ---------- */
function TermsConditions() {
  useReveal();

  return (
    <div className="terms-conditions-page section">
      <div className="container">
        <div className="terms-content">
          <h1 className="reveal">Terms & Conditions</h1>
          <p className="last-updated reveal">Last updated: September 24, 2025</p>

          <div className="terms-section reveal">
            <p>
              These Terms and Conditions ("Terms") govern your use of Silent Equity's services, training, and website ("Service"). By accessing or using the Service, you agree to be bound by these Terms.
            </p>
          </div>

          <div className="terms-section reveal">
            <h2>1. Eligibility</h2>
            <ul>
              <li>Users under 18 must have parental/guardian consent.</li>
              <li>By using Silent Equity, you confirm legal capacity to enter this agreement.</li>
            </ul>
          </div>

          <div className="terms-section reveal">
            <h2>2. Service Access</h2>
            <ul>
              <li>Access to courses, platforms, and training is provided upon enrollment.</li>
              <li>Access may be time-limited based on your package or subscription.</li>
            </ul>
          </div>

          <div className="terms-section reveal">
            <h2>3. Fees & Payments</h2>
            <ul>
              <li>All fees must be paid upfront through approved methods.</li>
              <li>Fees are non-refundable under all circumstances.</li>
            </ul>
          </div>

          <div className="terms-section reveal">
            <h2>4. User Responsibilities</h2>
            <ul>
              <li>Attend sessions, complete assignments, and respect course timelines.</li>
              <li>Maintain confidentiality of shared content and materials.</li>
              <li>Do not reproduce or distribute Silent Equity intellectual property.</li>
              <li>Ensure reliable internet/device access for online training.</li>
            </ul>
          </div>

          <div className="terms-section reveal">
            <h2>5. Silent Equity's Responsibilities</h2>
            <ul>
              <li>Deliver course content as scheduled.</li>
              <li>Provide qualified trainers and resources.</li>
              <li>Maintain secure systems and protect user data.</li>
            </ul>
          </div>

          <div className="terms-section reveal">
            <h2>6. Intellectual Property</h2>
            <p>
              All materials, branding, and content are the property of Silent Equity. Unauthorized reproduction, sharing, or resale is prohibited.
            </p>
          </div>

          <div className="terms-section reveal">
            <h2>7. Confidentiality</h2>
            <p>
              Any confidential information provided must not be disclosed without Silent Equity's consent. Obligations remain valid even after course completion.
            </p>
          </div>

          <div className="terms-section reveal">
            <h2>8. Limitation of Liability</h2>
            <p>
              Silent Equity is not liable for financial losses, damages, or outcomes arising from use of our Service. Trading results are not guaranteed.
            </p>
          </div>

          <div className="terms-section reveal">
            <h2>9. Termination</h2>
            <ul>
              <li>Silent Equity may suspend or terminate your access if Terms are breached.</li>
              <li>Users may terminate enrollment at any time, but fees remain non-refundable.</li>
            </ul>
          </div>

          <div className="terms-section reveal">
            <h2>10. Governing Law</h2>
            <p>
              These Terms are governed by the laws of United Kingdom. Any disputes shall be resolved in courts located in Leeds, United Kingdom.
            </p>
          </div>

          <div className="terms-section reveal">
            <h2>11. Force Majeure</h2>
            <p>
              Silent Equity will not be held responsible for delays or failure due to events beyond reasonable control (e.g., natural disasters, strikes, technical failures).
            </p>
          </div>

          <div className="terms-section reveal">
            <h2>12. Entire Agreement</h2>
            <p>
              These Terms represent the full agreement between you and Silent Equity and supersede all prior communications.
            </p>
          </div>

          <div className="terms-section reveal">
            <h2>13. Guarantee Edge Course Policy</h2>
            <ul>
              <li>Access is granted only upon full fee payment.</li>
              <li>Students must follow structured learning and mentorship tasks.</li>
              <li>Fees are non-refundable regardless of completion or results.</li>
              <li>Materials are the exclusive property of Silent Equity.</li>
              <li>Certification is issued only after meeting course requirements.</li>
              <li>The Guarantee Edge Course ensures mentorship and discipline, but no profit guarantee.</li>
            </ul>
          </div>

          <div className="terms-section reveal">
            <h2>14. Code of Consistency Course Policy</h2>
            <ul>
              <li>This is Silent Equity's <strong>main structured course</strong>, designed as a one-year program for traders seeking consistent results.</li>
              <li>Access includes scheduled classes, mentorship, structured modules, assignments, and evaluations across the year.</li>
              <li>Students must commit to the full program timeline for maximum benefit.</li>
              <li>Certification is issued upon successful completion of course requirements.</li>
              <li>The Code of Consistency Course is designed to guarantee a <strong>structured trading journey with discipline</strong>, but does not guarantee profits.</li>
              <li>All course materials remain property of Silent Equity.</li>
            </ul>
          </div>

          <div className="terms-section reveal">
            <h2>Contact</h2>
            <p>
              <strong>Email:</strong> <a href="mailto:unmask@thesilentequity.com">unmask@thesilentequity.com</a><br/>
              <strong>Address:</strong> 11 Regent Street, Leeds, United Kingdom
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
/* ---------- ContactUs Component ---------- */
function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState('');

  useReveal();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate form submission - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(''), 5000);
    }
  };

  return (
    <div className="contact-us-page section">
      <div className="container">
        <div className="contact-content">
          <div className="contact-header">
            <h1 className="reveal">Contact Us</h1>
            <p className="reveal">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </div>

          <div className="contact-main">
            <div className="contact-info reveal">
              <div className="contact-info-card">
                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                    </svg>
                  </div>
                  <div>
                    <h3>Email</h3>
                    <p><a href="mailto:unmask@thesilentequity.com">unmask@thesilentequity.com</a></p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                  </div>
                  <div>
                    <h3>Address</h3>
                    <p>11 Regent Street<br/>Leeds, United Kingdom</p>
                  </div>
                </div>

                <div className="contact-info-item">
                  <div className="contact-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56-.35-.12-.74-.03-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z"/>
                    </svg>
                  </div>
                  <div>
                    <h3>Response Time</h3>
                    <p>We typically respond within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="contact-form reveal" onSubmit={handleSubmit}>
              {submitStatus === 'success' && (
                <div className="form-message success">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Thank you! Your message has been sent successfully.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="form-message error">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                  </svg>
                  There was an error sending your message. Please try again.
                </div>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="course-inquiry">Course Inquiry</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="billing">Billing Question</option>
                    <option value="partnership">Partnership</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows="6"
                  placeholder="Tell us how we can help you..."
                />
              </div>

              <button 
                type="submit" 
                className="contact-submit-btn" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner"></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                    </svg>
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Home Component (No changes needed here) ---------- */
function Home() {
  const [showVideoModal, setShowVideoModal] = useState(false);
  const youtubeVideoId = "3aDXQZ5MKAs";

  return (
    <>
      <ForexTicker />
      <NebulaLayer />
      <Hero onShowVideo={() => setShowVideoModal(true)} />
      <WorkingProfessionalHook />
      <CorePoints />
      <BlogsSection />
      <FloatingCTA />
      {showVideoModal && (
        <VideoModal videoId={youtubeVideoId} onClose={() => setShowVideoModal(false)} />
      )}
    </>
  );
}

/* ---------- Footer Component (No changes needed here) ---------- */
function Footer() {
const socialLinks = useMemo(() => [
  { name: "X", url: "https://x.com/silent_equity?s=21", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.21-6.839L4.936 21.75H1.629l7.762-10.236L1.875 2.25H9.19L14.4 9.093 18.244 2.25zm-2.825 15l-1.381-1.815-4.832-6.326L4.417 4.5h2.953l4.934 6.462 1.381 1.815 4.832 6.326h-2.953z"/></svg>},
  { name: "Instagram", url: "https://www.instagram.com/thesilentequity?igsh=MW15eGZ6NWZqanNpdA==", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4c0 3.2-2.6 5.8-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2zM7.6 4a3.6 3.6 0 00-3.6 3.6v8.8a3.6 3.6 0 003.6 3.6h8.8a3.6 3.6 0 003.6-3.6V7.6a3.6 3.6 0 00-3.6-3.6zM12 7.2a4.8 4.8 0 100 9.6 4.8 4.8 0 000-9.6zm0 1.6a3.2 3.2 0 110 6.4 3.2 3.2 0 010-6.4zm5.8-1.5a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"/></svg>},
  { name: "Youtube", url: "https://www.youtube.com/@SilentEquity10", icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.5v-9l6 4.5-6 4.5z"/></svg>},
], []);

  const footerNavLinks = useMemo(() => [
    { path: "/", label: "Home" },
    { path: "/story", label: "Our Story" },
    { path: "/blogs", label: "Blogs" },
    { path: "/contact", label: "Contact Us" },
    { path: "/privacy", label: "Privacy Policy" },
    { path: "/terms", label: "Terms & Conditions" }
  ], []);

  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <div className="footer-logo-section">
            <Link to="/" className="nav-logo">
              <span className="logo-text">Silent Equity</span>
              <span className="logo-accent">.</span>
            </Link>
            <p className="copyright-text">
              © {currentYear} Silent Equity. All Rights Reserved.
            </p>
          </div>
          <nav className="footer-nav">
            <ul className="footer-nav-list">
              {footerNavLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.path} className="footer-nav-link">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="footer-right">
          <div className="social-links-container">
            {socialLinks.map((social) => (
              <a 
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit Silent Equity on ${social.name}`}
                className="social-link-icon"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ---------- App Component ---------- */
export default function App() {
  // location isn't used for a key anymore (we handle scroll/fade via ScrollToTop)
  const location = useLocation();

  return (
    <>
      <Navigation />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/story" element={<Story />} />
        <Route path="/initiatives" element={<Initiatives />} />
        <Route path="/form" element={<Form />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/what-is-trading" element={<WhatIsTradingBlog />} />
        <Route path="/blogs/understanding-the-forex-market" element={<UnderstandingForexBlog />} />
        <Route path="/blogs/participants-of-forex" element={<ForexMarketParticipantsBlog />} />  {/* ← New route */}
        <Route path="/blogs/george-soros-scam" element={< GeorgeSorosBlog />} />
        <Route path="/blogs/what-is-a-broker" element={<WhatIsBrokerBlog />} />    {/* ← New route */}
        <Route path="/blogs/impact-of-news-events" element={<ImpactOfNewsEventsBlog />} />
        <Route path="/blogs/navtrader-scam" element={<NavinderSaraoBlog />} />
        <Route path="/blogs/satoshi" element={<SatoshiNakamotoBlog />} />
        <Route path ="/blogs/Scams" element ={<FakeBrokerAndForexScamsBlog />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />  {/* Add this line */}
        <Route path="/terms" element={<TermsConditions />} />  {/* Add this line */}
        <Route path="/contact" element={<ContactUs />} />  {/* Add this line */}
</Routes>
      <Footer />
    </>
  );
}
