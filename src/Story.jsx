import React, { useEffect, useMemo, useState, useRef } from "react";

export default function Story() {
  // Constrained symbol field centered near the title
  const COUNT = 26;
  const SIZE_MIN = 12, SIZE_MAX = 28;
  const DURATION_MIN = 14, DURATION_MAX = 26;

  // Load-only entrance trigger (title)
  const [entered, setEntered] = useState(false);
  // Title word-by-word load animation flags
  const [titleStep, setTitleStep] = useState(0); // 0 none, 1 line1 word1, 2 line1 word2, 3 line2 word1, 4 line2 word2

  // Scroll-reveal refs
  const whoRef = useRef(null);
  const [whoVisible, setWhoVisible] = useState(false);
  const captionRef = useRef(null);
  const [captionVisible, setCaptionVisible] = useState(false);
  const postRef = useRef(null);
  const [postVisible, setPostVisible] = useState(false);
  const diagCtaRef = useRef(null);
  const [diagCtaVisible, setDiagCtaVisible] = useState(false);

  // Sprites for floating currency signs
  const sprites = useMemo(() => {
    const arr = [];
    for (let i = 0; i < COUNT; i++) {
      const isDollar = Math.random() > 0.5;
      const size = Math.floor(Math.random() * (SIZE_MAX - SIZE_MIN + 1)) + SIZE_MIN;
      const angle = Math.random() * Math.PI * 2;
      const r = Math.sqrt(Math.random());
      const dur = (Math.random() * (DURATION_MAX - DURATION_MIN) + DURATION_MIN).toFixed(1);
      const blur = Math.random() < 0.35 ? Math.floor(Math.random() * 3) + 1 : 0;
      const opacity = blur ? (Math.random() * 0.28 + 0.18).toFixed(2) : (Math.random() * 0.42 + 0.38).toFixed(2);
      const ampX = (Math.random() * 0.18 + 0.10).toFixed(3);
      const ampY = (Math.random() * 0.18 + 0.10).toFixed(3);
      const dir = Math.random() > 0.5 ? 1 : -1;
      arr.push({ id: i, char: isDollar ? "$" : "€", size, angle, r, dur, blur, opacity, ampX, ampY, dir });
    }
    return arr;
  }, []);

  // Reduced motion + title sequencing
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    document.documentElement.classList.toggle("no-float", mq.matches);
    const onChange = e => document.documentElement.classList.toggle("no-float", e.matches);
    mq.addEventListener?.("change", onChange);

    if (!mq.matches) {
      const timers = [];
      timers.push(setTimeout(() => setEntered(true), 10));
      timers.push(setTimeout(() => setTitleStep(1), 180));
      timers.push(setTimeout(() => setTitleStep(2), 420));
      timers.push(setTimeout(() => setTitleStep(3), 680));
      timers.push(setTimeout(() => setTitleStep(4), 920));
      return () => {
        mq.removeEventListener?.("change", onChange);
        timers.forEach(clearTimeout);
      };
    } else {
      setEntered(true);
      setTitleStep(4);
    }
  }, []);

  // Intersection observers for sections + scroll line-by-line fade
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const whoEl = whoRef.current;
    const captionEl = captionRef.current;
    const postEl = postRef.current;
    const diagCtaEl = diagCtaRef.current;
    let whoObs, captionObs, postObs, diagCtaObs, linesObs;

    if (whoEl) {
      whoObs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setWhoVisible(true);
          whoObs.disconnect();
          if (captionEl) {
            captionObs = new IntersectionObserver(([e]) => {
              if (e.isIntersecting) {
                setCaptionVisible(true);
                captionObs.disconnect();
              }
            }, { threshold: 0.15 });
            captionObs.observe(captionEl);
          }
        }
      }, { threshold: 0.2 });
      whoObs.observe(whoEl);
    }
    if (postEl) {
      postObs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setPostVisible(true);
          postObs.disconnect();
        }
      }, { threshold: 0.15 });
      postObs.observe(postEl);
    }
    if (diagCtaEl) {
      diagCtaObs = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setDiagCtaVisible(true);
          diagCtaObs.disconnect();
        }
      }, { threshold: 0.15 });
      diagCtaObs.observe(diagCtaEl);
    }
    if (!mq.matches) {
      const lines = document.querySelectorAll(".scroll-line");
      linesObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) e.target.classList.add("show-line");
        });
      }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });
      lines.forEach(el => linesObs.observe(el));
    } else {
      document.querySelectorAll(".scroll-line").forEach(el => el.classList.add("show-line"));
    }
    return () => {
      whoObs?.disconnect();
      captionObs?.disconnect();
      postObs?.disconnect();
      diagCtaObs?.disconnect();
      linesObs?.disconnect();
    };
  }, []);

  // CTA click handler (navigate to choose-track section of form.jsx route)
  const goToTracks = () => {
    // Adjust this href to your actual route/anchor if different
    window.location.href = "/form#choose-track";
  };

  return (
    <main className="story-hero">
      <div className="title-area">
        {/* Floating currency symbols */}
        <div className="field" aria-hidden="true">
          {sprites.map(s => {
            const startX = Math.cos(s.angle) * s.r;
            const startY = Math.sin(s.angle) * s.r;
            const style = {
              animationDuration: `${s.dur}s`,
              filter: s.blur ? `blur(${s.blur}px)` : "none",
              opacity: s.opacity,
              fontSize: `${s.size}px`,
            };
            style["--start-x"] = `${startX}`;
            style["--start-y"] = `${startY}`;
            style["--amp-x"] = `${s.ampX}`;
            style["--amp-y"] = `${s.ampY}`;
            style["--dir"] = `${s.dir}`;
            return (
              <span key={s.id} className="dot" style={style}>
                {s.char}
              </span>
            );
          })}
        </div>

        {/* Title with word-by-word load animation */}
        <h1 className={`title ${entered ? "entered" : ""}`}>
          <span className="line1">
            <span className={`w ${titleStep >= 1 ? "word-in" : ""}`}>SILENT</span>
            <span className="sp" />
            <span className={`w ${titleStep >= 2 ? "word-in" : ""}`}>REVOLUTION</span>
          </span>
          <span className="line2">
            <span className={`w ${titleStep >= 3 ? "word-in" : ""}`}>BY</span>
            <span className="sp" />
            <span className={`w ${titleStep >= 4 ? "word-in" : ""}`}>TRADERS</span>
          </span>
        </h1>
      </div>

      {/* Who we are — kept clean, no background; sits farther down for clarity */}
      <section ref={whoRef} className={`who ${whoVisible ? "show" : ""}`}>
        <h2 className="who-title scroll-line">Who we are?</h2>
        <p className="who-text scroll-line">
          We’ve been where you are—excited yet uncertain, celebrating green trades and panicking at red ones. Silent Equity was built by traders with one vision: to shape disciplined, consistent, and resilient participants. For us, trading is more than charts—it’s a craft, a mirror of the mind, and built in silence. While others sell dreams, we offer what truly lasts: discipline and consistency, tailored from our own journey so you can grow the right way.
        </p>
      </section>

      {/* Caption above video */}
      <div ref={captionRef} className={`video-caption ${captionVisible ? "show" : ""}`}>
        <p className="scroll-line">
          “WE TURNED YEARS OF FAILURE INTO A FOUNDATION FOR SILENT EQUITY.<br />
          THIS IS HOW WE DID IT. WATCH OUR STORY.”
        </p>
      </div>

      {/* Video */}
      <div className="video-frame">
        <div className="video-aspect">
          <iframe
            className="video-iframe"
            src="https://www.youtube-nocookie.com/embed/3aDXQZ5MKAs?rel=0&modestbranding=1&controls=1&playsinline=1&color=white"
            title="Silent Equity"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      </div>

      {/* Post-video glass content */}
      <section ref={postRef} className={`post ${postVisible ? "show" : ""}`}>
        <div className="glass-one">
          <p className="para scroll-line" style={{ "--delay": "0ms" }}>
            <strong>Forex is the largest financial market in the world, offering endless opportunities but also hidden risks.</strong> Many enter it with hopes of quick profits, yet most end up struggling without understanding the craft behind it.
          </p>
          <p className="para scroll-line strong" style={{ "--delay": "120ms" }}>
            The sad reality is that countless traders fail — not because the market is unbeatable, but because they lack discipline, emotional balance, and a structured approach. Silent Equity was born from living through those same struggles.
          </p>
          <p className="para scroll-line" style={{ "--delay": "240ms" }}>
            We believe growth comes from strong, routine-based foundations. At Silent Equity, we guide traders step by step with tested routines, strict discipline, and a clear path to consistent improvement.
          </p>
          <p className="para scroll-line strong" style={{ "--delay": "360ms" }}>
            Every student is different, so our approach is personal from day one. With mentorship, community, and resources under one roof, Silent Equity is a one-stop space for everything a trader truly needs.
          </p>
        </div>
      </section>

      {/* Core Values — DO NOT CHANGE ANIMATION OR CONTENT BELOW THIS LINE */}
      <section className="core-values" aria-labelledby="cv-title">
        <h2 id="cv-title" className="cv-heading scroll-line">Core Values</h2>
        <p className="cv-intro-text scroll-line">
          At Silent Equity, our core values are the backbone of everything we do. They reflect our journey from struggle to consistency and guide us in shaping disciplined, resilient, and empowered traders who grow not just in skills, but in mindset and character.
        </p>
        <div className="cv-viewport" role="region" aria-label="Core Values timeline">
          <div className="cv-particles" aria-hidden="true">
            {Array.from({ length: 40 }).map((_, i) => (
              <span
                key={i}
                className="cv-dot"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDuration: `${8 + Math.random() * 10}s`,
                  opacity: 0.15 + Math.random() * 0.2
                }}
              />
            ))}
          </div>
          <div className="cv-track">
            <div className="cv-line" aria-hidden="true" />
            {[
              { k: "Discipline", d: "Building habits and routines that make consistent trading possible." },
              { k: "Resilience", d: "Turning failures into stepping stones and never giving up." },
              { k: "Transparency", d: "Sharing the real struggles of trading, not selling false dreams." },
              { k: "Community", d: "Growing together through support, accountability, and shared learning." },
              { k: "Personalization", d: "Understanding every trader’s unique journey from day one." },
              { k: "Excellence", d: "Striving for mastery in both mindset and skill to create lasting impact." },
            ].map((item, idx) => (
              <div key={item.k} className="cv-stop">
                <div className="cv-node-wrapper"><div className="cv-node" /></div>
                <article className="cv-card scroll-line" style={{ "--delay": `${idx * 100}ms` }}>
                  <h3 className="cv-key">{item.k}</h3>
                  <p className="cv-desc">{item.d}</p>
                </article>
              </div>
            ))}
            <div className="cv-walker" aria-hidden="true">
              <div className="man">
                <span className="head" />
                <span className="body" />
                <span className="arm arm-l" />
                <span className="arm arm-r" />
                <span className="leg leg-l" />
                <span className="leg leg-r" />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END core values block (untouched animation/content) */}

      {/* Diagnostic chips + CTA */}
      <section className="diag-section" aria-labelledby="diag-title">
        <div className="diag-head">
          <h2 id="diag-title" className="diag-heading scroll-line">Does this sound like you?</h2>
          <p className="diag-sub scroll-line">
            “If even 2 or 3 of these feel familiar, you’re not alone. We’ve faced them too — and that’s exactly why Silent Equity was built: to help traders break the cycle and grow with discipline.”
          </p>
        </div>
        <div className="diag-grid">
          {[
            "Tired of fake traders and fake results.",
            "Backtests pass; live trades fail.",
            "Trading to avoid loss, not to win.",
            "Unsure when to start live trading.",
            "Repeating the same mistakes.",
            "No clear view of realistic returns.",
            "Panic when a trade turns red.",
            "Chasing ‘perfect consistency’ is burning you out.",
          ].map((t, i) => (
            <button
              key={i}
              className="diag-chip scroll-line"
              style={{ "--d": `${i * 40}ms` }}
              type="button"
              aria-label={t}
            >
              <span className="diag-dot" aria-hidden="true" />
              <span className="txt">{t}</span>
            </button>
          ))}
        </div>
        {/* Centered program line + CTA */}
        <div ref={diagCtaRef} className={`diag-cta ${diagCtaVisible ? "show" : ""}`}>
          <p className="diag-cta-text">
            If this felt like your story, our program is your next chapter. Start building the trader you’re meant to be — click the button below to begin.
          </p>
          <button className="cta-activate" type="button" onClick={goToTracks}>
            Activate Your Silent Potential
          </button>
        </div>
      </section>

      {/* Styles */}
      <style>{`
        :root{
          --cta-teal: #00f0d0;
          --cta-teal-strong: #10ffe0;
          --cta-teal-dim: rgba(0,240,208,.18);
        }

        .story-hero{
          position:relative; min-height:100vh; overflow:hidden;
          display:flex; align-items:flex-start; justify-content:center;
          flex-direction: column;
          padding: clamp(60px, 12vh, 190px) 6vw clamp(40px, 8vh, 90px);
          color:#d9efec;
        }

        .title-area{
          position:relative;
          margin-top: clamp(20px, 4vh, 60px);
          width: min(1200px, 100%);
          --field-radius: clamp(140px, 20vw, 260px);
          margin-inline: auto;
        }

        .field{
          position:absolute;
          top:50%; left:50%;
          transform: translate(-50%, -55%);
          width: calc(var(--field-radius) * 2);
          height: calc(var(--field-radius) * 2);
          pointer-events:none;
          z-index:0;
        }

        .dot{
          position:absolute;
          left: calc(50% + var(--start-x) * var(--field-radius));
          top:  calc(50% + var(--start-y) * var(--field-radius));
          transform: translate(-50%, -50%);
          color: #7fc7c0;
          text-shadow: 0 0 8px rgba(0,0,0,.28);
          user-select:none;
          animation: wander var(--dur, 20s) ease-in-out infinite alternate;
          animation-duration: inherit;
          will-change: transform;
        }

        @keyframes wander{
          0%   { transform: translate(calc(-50% + var(--dir) * var(--amp-x) * var(--field-radius) * -0.22),
                                      calc(-50% + var(--amp-y) * var(--field-radius) *  0.22)); }
          25%  { transform: translate(calc(-50% + var(--dir) * var(--amp-x) * var(--field-radius) *  0.14),
                                      calc(-50% + var(--amp-y) * var(--field-radius) *  0.04)); }
          50%  { transform: translate(calc(-50% + var(--dir) * var(--amp-x) * var(--field-radius) *  0.26),
                                      calc(-50% + var(--amp-y) * var(--field-radius) * -0.26)); }
          75%  { transform: translate(calc(-50% + var(--dir) * var(--amp-x) * var(--field-radius) * -0.10),
                                      calc(-50% + var(--amp-y) * var(--field-radius) * -0.08)); }
          100% { transform: translate(calc(-50% + var(--dir) * var(--amp-x) * var(--field-radius) * -0.22),
                                      calc(-50% + var(--amp-y) * var(--field-radius) *  0.22)); }
        }

        html.no-float .dot{ animation: none !important; }

        .title{
          position:relative; z-index:1; margin:0; text-align:center; line-height:0.8;
          font-family:'Orbitron','Space Grotesk',Poppins,system-ui,-apple-system,Segoe UI,Roboto,sans-serif;
          font-weight:505; text-transform:uppercase; letter-spacing:.6px;
          font-size: clamp(2.4rem, 8vw, 4rem);
          color:#e6f4f2; text-shadow: 0 8px 32px rgb(2, 141, 141);
          animation: titleFloat 6s ease-in-out infinite, titleGlow 5.5s ease-in-out infinite;
          opacity: 0; transform: translateY(16px);
          padding-inline: 6px;
        }
        .title.entered{
          opacity: 1; transform: translateY(0);
          transition: opacity 740ms ease, transform 750ms ease;
        }
        .line1, .line2{ display:block; white-space:nowrap; }
        .line2{ margin-top: clamp(8px, 1.6vw, 21px); }
        .sp{ display:inline-block; width: clamp(10px, 1.6vw, 40px); }
        .title .w{
          display:inline-block; opacity:0; transform: translateY(8px);
          transition: opacity 420ms ease, transform 420ms ease;
        }
        .title .w.word-in{ opacity:1; transform: translateY(0); }
        @keyframes titleFloat{ 0%{ transform: translateY(0); } 50%{ transform: translateY(-6px); } 100%{ transform: translateY(0); } }
        @keyframes titleGlow{
          0%{ text-shadow: 0 8px 28px rgba(2,141,141,.75); }
          50%{ text-shadow: 0 10px 42px rgba(2,141,141,.95); }
          100%{ text-shadow: 0 8px 28px rgba(2,141,141,.75); }
        }

        /* Scroll line-by-line reveal */
        .scroll-line{ opacity:0; transform: translateY(10px); transition: opacity 520ms ease, transform 520ms ease; }
        .scroll-line.show-line{ opacity:1; transform: translateY(0); }

        /* Who we are */
        .who{
          width: min(1000px, 100%);
          margin: clamp(200px, 12vh, 220px) auto 0;
          text-align: left;
          opacity: 0; transform: translateY(18px);
          transition: opacity 600ms ease, transform 600ms ease;
          padding-inline: clamp(12px, 3vw, 0);
        }
        .who.show{ opacity:1; transform:translateY(0); }
        .who-title{
          font-family:'Space Grotesk', Poppins, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          font-weight: 900; font-size: clamp(1.05rem, 3.6vw, 1.8rem);
          letter-spacing: .4px; margin: 0 0 10px 0; color: #e8f6f4;
        }
        .who-text{
          font-family: Poppins, system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
          font-weight: 400; line-height: 1.75;
          font-size: clamp(0.98rem, 2.6vw, 1.02rem);
          color: #cfe8e4; max-width: 72ch;
        }

        .video-caption{
          width: min(1000px, 100%);
          margin: clamp(80px, 8vh, 140px) auto 12px;
          opacity: 0; transform: translateY(14px);
          transition: opacity 520ms ease, transform 520ms ease; text-align: center;
          padding-inline: clamp(12px, 3vw, 0);
        }
        .video-caption.show{ opacity:1; transform:translateY(0); }
        .video-caption p{ margin: 0; font-size: clamp(0.95rem, 3.4vw, 1.13rem); font-weight: 750; line-height: 1.9; color:rgb(201, 251, 250); }

        .video-frame{ width: min(1000px, 100%); margin: 12px auto 0; padding-inline: clamp(12px, 3vw, 0); }
        .video-aspect{ position: relative; width: 100%; aspect-ratio: 16 / 9; background: #0b1316; border-radius: 10px; overflow: hidden; }
        .video-iframe{ position:absolute; inset:0; width:100%; height:100%; border:0; }

        .post{ width: min(1000px, 100%); margin: clamp(48px, 10vh, 120px) auto 0;
          opacity: 0; transform: translateY(18px); transition: opacity 650ms ease, transform 650ms ease; text-align: left;
          padding-inline: clamp(12px, 3vw, 0);
        }
        .post.show{ opacity:1; transform:translateY(0); }
        .glass-one{
          background: linear-gradient(180deg, rgba(70, 69, 69, 0.34), rgba(34, 34, 34, 0.22));
          border: 1px solid rgba(2, 255, 230, 0.64); border-radius: 16px;
          backdrop-filter: blur(10px) saturate(110%); -webkit-backdrop-filter: blur(10px) saturate(110%);
          box-shadow: 0 18px 40px rgba(0,0,0,0.28), inset 0 0 0 1px rgba(255,255,255,0.05), 0 1px 0 rgba(208,186,186,0.05);
          padding: clamp(14px, 3.6vw, 24px);
        }
        .post p{ margin: 0 0 14px 0; line-height: 1.8; font-size: clamp(0.95rem, 3vw, 1.06rem); color: #d8efec; font-weight: 350; }
        .post p.strong{ font-weight: 800; color: #eafdfb; }

        /* Core Values (UNCHANGED animation/content) */
        .core-values{ width: 100%; margin-top: clamp(80px, 16vh, 200px); position: relative; }
        .cv-heading{ width: min(1000px, 100%); margin: 0 auto clamp(12px, 3vh, 24px);
          font-size: clamp(1.1rem, 4.2vw, 2rem); font-weight: 950; letter-spacing: .4px; color: #e6f4f2;
          text-align: left; position: relative; z-index: 10; display: flex; flex-direction: column; align-items: flex-start;
          transform: translateX(0); padding-inline: clamp(12px, 3vw, 0);
        }
        .cv-intro-text{ width: min(800px, 100%); margin: 0 auto; text-align: left; line-height: 1.7;
          font-size: clamp(0.9rem, 3.2vw, 1rem); color: rgba(207,231,228,0.85); margin-top: 1px; transform: translateX(0);
          padding-inline: clamp(12px, 3vw, 0);
        }
        .cv-viewport{ position: relative; width: 100%; overflow: hidden; }
        .cv-particles{ position:absolute; inset:0; overflow:hidden; }
        .cv-dot{ position:absolute; width:4px; height:4px; background:#7fc7c0; border-radius:40%; filter: blur(0.9px);
          animation: cvFloat var(--dur, 12s) linear infinite; }
        @keyframes cvFloat{ 0%{transform:translateY(0)} 50%{transform:translateY(-10px)} 100%{transform:translateY(0)} }
        .cv-track{ position: relative; height: 100%; width: calc(6 * 520px + 50vw); display: flex; align-items: flex-start;
          gap: clamp(48px, 8vw, 140px); padding: 0 clamp(12px, 4vw, 48px); padding-top: clamp(80px, 16vh, 200px);
          animation: cvPan 36s linear infinite; transform: translateX(-50vw);
        }
        @keyframes cvPan{
          0%{ transform: translateX(0); } 13%{ transform: translateX(0); }
          16%{ transform: translateX(-16%); } 29%{ transform: translateX(-16%); }
          32%{ transform: translateX(-32%); } 45%{ transform: translateX(-32%); }
          48%{ transform: translateX(-48%); } 61%{ transform: translateX(-48%); }
          64%{ transform: translateX(-64%); } 77%{ transform: translateX(-64%); }
          80%{ transform: translateX(-80%); } 93%{ transform: translateX(-80%); }
          100%{ transform: translateX(0); }
        }
        html.no-float .cv-track{ animation:none; }
        .cv-line{ position:absolute; left: 0; right: 0; top: 50%; height: 2px;
          background: linear-gradient(90deg, rgba(127,199,192,.25), rgba(127,199,192,.06));
          box-shadow: 0 0 12px rgba(2,141,141,.25); }
        .cv-stop{ position: relative; flex: 0 0 clamp(280px, 80vw, 520px); display: flex; flex-direction: column; align-items: center; height: 100%; }
        .cv-node-wrapper{ position: relative; width: 14px; height: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 12px; }
        .cv-node{ width: 14px; height: 14px; border-radius: 50%; background: rgba(0,255,230,0.9);
          box-shadow: 0 0 10px rgba(0,255,230,0.9), 0 0 26px rgba(0,255,230,0.5); z-index: 2; }
        .cv-card{ position: relative; background: linear-gradient(180deg, rgba(12,24,28,0.34), rgba(12,24,28,0.22));
          border: 1px solid rgba(180,255,248,0.18); border-radius: 14px; padding: clamp(10px, 4vw, 18px) clamp(12px, 5vw, 22px);
          box-shadow: 0 10px 24px rgba(0,0,0,.25), inset 0 0 0 1px rgba(255,255,255,.04);
          backdrop-filter: blur(8px) saturate(108%); -webkit-backdrop-filter: blur(8px) saturate(108%); color: #eaf8f6; width: 100%; }
        .cv-key{ margin:0 0 6px 0; font-size: clamp(1rem, 4.4vw, 1.25rem); font-weight: 600; color:#eafffb; }
        .cv-desc{ margin:0; line-height:1.7; font-size: clamp(.9rem, 4vw, 1.05rem); color:#cfe7e4; }
        .cv-walker{ position:absolute; top: 50%; left: 0; transform: translate(-50%, -50%); width: 32px; height: 48px; animation: cvWalkerMove 36s linear infinite; }
        @keyframes cvWalkerMove{
          0%{ left: 0%; } 13%{ left: 0%; } 16%{ left: 16%; } 29%{ left: 16%; } 32%{ left: 32%; } 45%{ left: 32%; }
          48%{ left: 48%; } 61%{ left: 48%; } 64%{ left: 64%; } 77%{ left: 64%; } 80%{ left: 80%; } 93%{ left: 80%; } 100%{ left: 0%; }
        }
        html.no-float .cv-walker{ animation:none; }

        /* Diagnostic grid */
        .diag-section{ width:100%; margin: clamp(80px,14vh,140px) 0 0; padding-inline: clamp(12px, 3vw, 0); }
        .diag-head{ width:min(1100px,100%); margin:0 auto clamp(18px,3vh,28px); text-align:left; }
        .diag-heading{ margin:0 0 10px 0; font-size: clamp(1.2rem,5vw,2rem); font-weight:950; letter-spacing:.4px; color:#e6f4f2; }
        .diag-sub{ margin:0; color:rgba(207,231,228,.9); font-size:clamp(.95rem,3.6vw,1.05rem); line-height:1.7; max-width:900px; }
        .diag-grid{ width:min(1200px,100%); margin:0 auto; display:grid; grid-template-columns: repeat(4, 1fr); gap: clamp(10px, 3vw, 18px); }
        @media (max-width: 1100px){ .diag-grid{ grid-template-columns: repeat(3, 1fr);} }
        @media (max-width: 760px){  .diag-grid{ grid-template-columns: repeat(2, 1fr);} }
        @media (max-width: 480px){  .diag-grid{ grid-template-columns: 1fr; } }

        .diag-chip{
          position: relative; isolation: isolate; display:flex; align-items:center; gap:10px;
          background: linear-gradient(180deg, rgba(8,18,22,0.46), rgba(8,18,22,0.32));
          border:1px solid rgba(140,255,246,0.22); border-radius:12px; padding: clamp(10px, 3.2vw, 12px) clamp(12px, 3.6vw, 14px);
          color:#eaf8f6;
          box-shadow: 0 12px 26px rgba(0,0,0,.22), inset 0 0 0 1px rgba(255,255,255,.04);
          backdrop-filter: blur(6px) saturate(108%); -webkit-backdrop-filter: blur(6px) saturate(108%);
          transform: translateY(8px); opacity:0; animation: chipIn 520ms cubic-bezier(.2,.7,.2,1) var(--d,0ms) forwards;
          transition: box-shadow 200ms ease, transform 200ms ease, background 200ms ease, border-color 200ms ease;
          cursor: pointer;
        }
        .diag-chip:focus{ outline: none; }
        .diag-chip::after{
          content:""; position:absolute; inset:-10px; border-radius: 16px;
          background: radial-gradient(140px 90px at 20% 20%, rgba(0,255,230,.12), transparent 60%);
          filter: blur(10px); opacity: 0; z-index: -1; animation: chipPulse 3200ms ease-in-out infinite var(--d,0ms);
        }
        @keyframes chipPulse{ 0%,100%{ opacity:0; } 40%{ opacity:.18; } }
        html.no-float .diag-chip::after{ animation:none; opacity:0; }
        .diag-dot{
          width:10px; height:10px; border-radius:50%; background: rgba(0,255,230,.95);
          box-shadow: 0 0 10px rgba(0,255,230,.9), 0 0 22px rgba(0,255,230,.45);
          flex:0 0 auto; transition: box-shadow 200ms ease, transform 200ms ease;
        }
        .diag-chip .txt{ font-size: clamp(.9rem, 3.6vw, 1.02rem); line-height:1.55; }
        .diag-chip:hover, .diag-chip:focus-visible, .diag-chip:focus-within{
          transform: translateY(-2px);
          box-shadow: 0 18px 34px rgba(0,0,0,.3), 0 0 0 1px rgba(140,255,246,0.28) inset;
          border-color: rgba(140,255,246,0.32);
          background: linear-gradient(180deg, rgba(10,22,26,0.54), rgba(10,22,26,0.38));
        }
        .diag-chip:hover .diag-dot, .diag-chip:focus-visible .diag-dot, .diag-chip:focus-within .diag-dot{
          transform: scale(1.08);
          box-shadow: 0 0 14px rgb(49, 160, 149), 0 0 30px rgba(0,255,230,.7);
        }
        @keyframes chipIn{ 0%{ opacity:0; transform: translateY(8px); } 100%{ opacity:1; transform: translateY(0); } }
        html.no-float .diag-chip{ animation: none; opacity:1; transform:none; }

        /* Centered CTA block under grid */
        .diag-cta{
          margin: clamp(24px, 4vh, 40px) auto 0;
          width: min(900px, 100%);
          text-align: center;
          opacity: 0; transform: translateY(12px);
          transition: opacity 560ms ease, transform 560ms ease;
          padding-inline: clamp(12px, 3vw, 0);
        }
        .diag-cta.show{ opacity: 1; transform: translateY(0); }
        .diag-cta-text{
          margin: 0 0 14px 0;
          font-size: clamp(0.95rem, 3.4vw, 1.1rem);
          line-height: 1.8;
          color:rgb(235, 245, 243);
        }
        .cta-activate{
          border: 0;
          border-radius: 12px;
          padding: clamp(10px, 3vw, 12px) clamp(14px, 4vw, 18px);
          background: linear-gradient(135deg, rgb(15,53,60) 0%, rgb(2,74,83) 100%);
          box-shadow: 0 16px 34px rgba(16, 84, 76, 0.28), 0 0 0 1px rgba(30, 201, 184, 0.28) inset;
          color: #eafffb;
          font-weight: 800;
          letter-spacing: .2px;
          cursor: pointer;
          transition: transform 180ms ease, box-shadow 180ms ease, filter 180ms ease;
          font-size: clamp(0.95rem, 3.4vw, 1rem);
        }
        .cta-activate:hover{
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(16, 84, 76, 0.28), 0 0 0 1px rgba(30, 201, 184, 0.28) inset;
          filter: brightness(1.05);
        }
        .cta-activate:active{ transform: translateY(0); }
        .cta-activate:focus-visible{ outline: 2px solid rgba(13, 228, 206, 0.6); outline-offset: 4px; }

        /* Mobile-specific refinements */
        @media (max-width: 720px){
          .title-area{ --field-radius: clamp(110px, 28vw, 200px); }
          .title{ font-size: clamp(2rem, 10vw, 3rem); }
          .who{ margin-top: clamp(160px, 16vh, 200px); }
        }
        @media (max-width: 420px){
          .title{ font-size: clamp(1.8rem, 11vw, 2.6rem); }
          .sp{ width: clamp(8px, 2.4vw, 16px); }
        }
      `}</style>
    </main>
  );
}
