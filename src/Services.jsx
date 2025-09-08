import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function Initiatives() {
  // Hero section refs
  const heroLinesRef = useRef(null);

  // Main content refs
  const tagRef = useRef(null);
  const contentRef = useRef(null);

  // Flowchart refs
  const flowHeadingRef = useRef(null);
  const flowRef = useRef(null);
  const svgRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const stepRefs = useRef(Array.from({ length: 7 }, () => React.createRef())).current;

  // Programs and Add-ons refs
  const subheadRef = useRef(null);
  const progARef = useRef(null);
  const progBRef = useRef(null);
  const newSubheadRef = useRef(null);
  const newContentRef = useRef(null);
  const addonSubheadRef = useRef(null);
  const aspirantRef = useRef(null);
  const raiderzRef = useRef(null);

  // Refs for auto-scrolling logic
  const autoScrollIntervalRef = useRef(null);
  const currentStepIndexRef = useRef(0);
  const scrollSetupDone = useRef(false);

  // Trigger redraw of connectors when layout changes
  const [drawTick, setDrawTick] = useState(0);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Master scroll reveal effect
  useEffect(() => {
    const elementsToReveal = [
      { element: tagRef.current, threshold: 0.3 },
      { element: contentRef.current, threshold: 0.3 },
      { element: flowHeadingRef.current, threshold: 0.4 },
      { element: flowRef.current, threshold: 0.4, callback: () => setTimeout(() => setDrawTick(t => t + 1), 350) },
      { element: subheadRef.current, threshold: 0.4 },
      { element: progARef.current, threshold: 0.4 },
      { element: progBRef.current, threshold: 0.4 },
      { element: newSubheadRef.current, threshold: 0.4 },
      { element: newContentRef.current, threshold: 0.4 },
      { element: addonSubheadRef.current, threshold: 0.4 },
      { element: aspirantRef.current, threshold: 0.4 },
      { element: raiderzRef.current, threshold: 0.4 },
    ].filter(item => item.element);

    let observer = null;
    let currentIndex = 0;

    const setupObserver = () => {
      if (currentIndex >= elementsToReveal.length) {
        observer?.disconnect();
        return;
      }
      const { element, threshold, callback } = elementsToReveal[currentIndex];
      observer?.disconnect();
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("show");
              if (callback) callback();
              currentIndex++;
              setupObserver();
            }
          });
        },
        { root: null, rootMargin: "0px", threshold }
      );
      observer.observe(element);
    };

    setupObserver();
    return () => observer?.disconnect();
  }, []);

  // Timeline auto-scroll logic
  useEffect(() => {
    if (flowRef.current?.classList.contains("show") && !scrollSetupDone.current) {
      const scrollContainer = scrollContainerRef.current;
      if (!scrollContainer) return;
      const steps = stepRefs.map((ref) => ref.current).filter(Boolean);
      if (steps.length === 0) return;

      const startAutoScroll = () => {
        if (autoScrollIntervalRef.current) return;
        autoScrollIntervalRef.current = setInterval(() => {
          currentStepIndexRef.current = (currentStepIndexRef.current + 1) % steps.length;
          const nextStep = steps[currentStepIndexRef.current];
          if (nextStep) {
            const containerWidth = scrollContainer.offsetWidth;
            const stepWidth = nextStep.offsetWidth;
            const scrollLeft = nextStep.offsetLeft - containerWidth / 2 + stepWidth / 2;
            scrollContainer.scrollTo({ left: scrollLeft, behavior: "smooth" });
          }
        }, 4000);
      };
      const stopAutoScroll = () => {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      };

      scrollContainer.addEventListener("pointerenter", stopAutoScroll);
      scrollContainer.addEventListener("wheel", stopAutoScroll, { passive: true });
      scrollContainer.addEventListener("touchstart", stopAutoScroll, { passive: true });
      scrollContainer.addEventListener("pointerleave", startAutoScroll);

      startAutoScroll();
      scrollSetupDone.current = true;

      return () => {
        stopAutoScroll();
        if (scrollContainer) {
          scrollContainer.removeEventListener("pointerenter", stopAutoScroll);
          scrollContainer.removeEventListener("wheel", stopAutoScroll);
          scrollContainer.removeEventListener("touchstart", stopAutoScroll);
          scrollContainer.removeEventListener("pointerleave", startAutoScroll);
        }
      };
    }
  }, [drawTick, stepRefs]);

  // Draw SVG serpentine path
  useLayoutEffect(() => {
    const svg = svgRef.current;
    const flow = flowRef.current;
    if (!svg || !flow) return;
    const grid = flow.querySelector(".flow-steps");
    if (!grid) return;
    const rows = stepRefs.map((r) => r.current).filter(Boolean);
    if (rows.length < 2) return;

    const draw = () => {
      const gridRect = grid.getBoundingClientRect();
      if (gridRect.width < 5 || gridRect.height < 5) return;

      svg.setAttribute("width", gridRect.width);
      svg.setAttribute("height", gridRect.height);
      svg.setAttribute("viewBox", `0 0 ${gridRect.width} ${gridRect.height}`);

      while (svg.firstChild) svg.removeChild(svg.firstChild);

      const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
      const lg = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
      lg.setAttribute("id", "flowGrad");
      lg.setAttribute("x1", "0"); lg.setAttribute("y1", "0"); lg.setAttribute("x2", "1"); lg.setAttribute("y2", "0");
      const s1 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      s1.setAttribute("offset", "0%"); s1.setAttribute("stop-color", "rgba(127,247,234,0.7)");
      const s2 = document.createElementNS("http://www.w3.org/2000/svg", "stop");
      s2.setAttribute("offset", "100%"); s2.setAttribute("stop-color", "rgba(18,231,207,0.4)");
      lg.appendChild(s1); lg.appendChild(s2); defs.appendChild(lg); svg.appendChild(defs);

      const midY = (el) => {
        const r = el.getBoundingClientRect();
        return r.top + r.height / 2 - gridRect.top;
      };
      const leftX = (el) => el.getBoundingClientRect().left - gridRect.left;
      const rightX = (el) => el.getBoundingClientRect().right - gridRect.left;

      for (let i = 0; i < rows.length - 1; i++) {
        const from = rows[i];
        const to = rows[i + 1];
        const isRight = i % 2 === 0;

        const x1 = isRight ? rightX(from) : leftX(from);
        const y1 = midY(from);
        const x2 = isRight ? rightX(to) : leftX(to);
        const y2 = midY(to);

        const h = Math.max(60, Math.abs(x2 - x1) * 0.25);
        const v = Math.max(50, Math.abs(y2 - y1) * 0.6);

        const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("d", `M ${x1} ${y1} C ${isRight ? x1 + h : x1 - h} ${y1 + v}, ${isRight ? x2 + h : x2 - h} ${y2 - v}, ${x2} ${y2}`);
        p.setAttribute("fill", "none");
        p.setAttribute("stroke", "url(#flowGrad)");
        p.setAttribute("stroke-width", "3");
        p.setAttribute("stroke-linecap", "round");
        p.setAttribute("opacity", "0.9");
        svg.appendChild(p);

        const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        dot.setAttribute("cx", x2);
        dot.setAttribute("cy", y2);
        dot.setAttribute("r", "4");
        dot.setAttribute("fill", "rgba(127,247,234,0.9)");
        svg.appendChild(dot);
      }
    };

    draw();
    requestAnimationFrame(draw);

    const ro = new ResizeObserver(() => draw());
    ro.observe(grid);

    const onLoad = () => draw();
    window.addEventListener("load", onLoad);

    return () => {
      ro.disconnect();
      window.removeEventListener("load", onLoad);
    };
  }, [drawTick, stepRefs]);

  // Redraw connectors on viewport resize
  useEffect(() => {
    const onResize = () => setDrawTick((t) => t + 1);
    window.addEventListener("resize", onResize);
    const t1 = setTimeout(onResize, 200);
    const t2 = setTimeout(onResize, 800);
    return () => { window.removeEventListener("resize", onResize); clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <main className="initiatives-root">
      <header className="initiatives-hero">
        {/* Decorative dollars */}
        <span className="dollar dollar-right show" aria-hidden="true">$</span>
        <span className="dollar dollar-left show" aria-hidden="true">$</span>
        <span className="dollar dollar-far-1 show" aria-hidden="true">$</span>
        <span className="dollar dollar-far-2 show" aria-hidden="true">$</span>
        <span className="dollar dollar-far-3 show" aria-hidden="true">$</span>

        <div className="container hero-title-wrap">
          {/* Original title */}
          <h1 ref={heroLinesRef} className="hero-title show">
            <span className="reveal">
              <span className="line">Our</span>
              <span className="line">Initiatives</span>
            </span>
          </h1>

          {/* Overlay fallback title (always on top). Hidden if original is clearly visible */}
          <h1 className="hero-title-overlay" aria-hidden="true">
            Our<br/>Initiatives
          </h1>
        </div>
      </header>

      {/* Tagline and content section */}
      <section className="writeup container">
        <p ref={tagRef} className="tagline fade-stage">
          <strong>No fake hype, No guessing.</strong> <span className="muted">Controlled growth through discipline.</span>
        </p>
        <p ref={contentRef} className="bodycopy fade-stage">
          Silent Equity lives by the belief that “a better trader is a better person”, because true trading success begins
          with personal growth, emotional control, and discipline. Instead of chasing short-term profits, Silent Equity
          focuses on cultivating patience, consistency, and strong risk management—qualities that not only improve trading
          outcomes but also shape character in everyday life. By prioritising discipline over profits and quality over
          quantity, Silent Equity empowers traders to grow sustainably, ensuring that each decision made in the market
          reflects clarity, responsibility, and long-term vision rather than impulsive gain.
        </p>
      </section>

      {/* Flow heading */}
      <section className="container flow-heading">
        <h2 ref={flowHeadingRef} className="subhead subhead-line fade-stage">How we activate your “Silent Potential”?</h2>
      </section>

      {/* Flowchart */}
      <section ref={flowRef} className="flow container fade-stage">
        <div
          ref={scrollContainerRef}
          className="flow-steps"
          style={{
            display: "flex",
            flexWrap: "nowrap",
            gap: "clamp(28px, 4.5vh, 44px)",
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingLeft: "20vw",
            paddingRight: "20vw",
            scrollBehavior: "smooth",
            position: "relative",
          }}
        >
          <svg
            ref={svgRef}
            className="flow-svg"
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
          />
          {stepRefs.map((ref, idx) => {
            const align = idx % 2 === 0 ? "right" : "left";
            const titles = [
              "Beginner Confusion → Clear Pathway",
              "Backtest Success → Real‑Money Doubt",
              "Losing Phase → Consistency Building",
              "False Expectations → Realistic Profits",
              "Discipline & Challenges → Competitive Edge",
              "Journaling & Growth → Structured Progress",
              "Scaling the Right Way → Funded or Live",
            ];
            const descriptions = [
              "You were taught trading but panic or get confused at execution time. Beginner‑friendly recordings and weekly Q&As build clarity and confidence.",
              "Strategy works in backtests, but emotions break live trades. Training focuses on emotional control and mechanical, disciplined execution.",
              "Trading “not to lose” isn’t a plan. A roadmap to profitability shows how to build consistency and scale responsibly.",
              "No quick‑rich illusions. The focus is realistic, steady returns grounded in risk management and process.",
              "Discipline is tested by the market. Community challenges build habits, routines, and resilience versus institutional players.",
              "Journaling without structure stalls progress. A proper system tracks improvements and sharpens edge.",
              "Unsure of live vs. funded? Start small, grow consistently, then scale into funded accounts with a clear plan.",
            ];

            return (
              <div
                key={idx}
                ref={stepRefs[idx]}
                className={`flow-row ${align}`}
                style={{ scrollSnapAlign: "center", flex: "0 0 auto", cursor: "default", userSelect: "text" }}
              >
                <span className="badge">{idx + 1}</span>
                <div className="row-content">
                  <h3>{titles[idx]}</h3>
                  <p>{descriptions[idx]}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Programs Offered */}
      <section className="programs container">
        <h2 ref={subheadRef} className="subhead subhead-line fade-stage">Programs Offered</h2>

        <article ref={progARef} className="prog-card fade-stage">
          <div className="prog-head">
            <h3>Code of Consistency</h3>
            <span className="price">$249</span>
          </div>
          <ul className="prog-points">
            <li>Full access to the Silent Equity program, including pre-recorded classes and comprehensive study materials.</li>
            <li>Learn realistic backtesting, forward testing, and develop a disciplined trading roadmap tailored to your capital.</li>
            <li>Gain emotional control and market discipline with live trading support and exclusive Discord community access.</li>
            <li>Participate in regular Q&A sessions to enhance continuous learning and trader self-awareness.</li>
          </ul>
        </article>

        <article ref={progBRef} className="prog-card fade-stage">
          <div className="prog-head">
            <h3>The Guaranteed Edge</h3>
            <span className="price">$149</span>
          </div>
          <ul className="prog-points">
            <li>Mathematically Structured: Based on a robust mathematical model using an Excel framework—no predictions or complex analysis required.</li>
            <li>Minimal Time Commitment: Demands only about 10 minutes of attention per day.</li>
            <li>Suitable for : Working professionals.</li>
            <li>Cyclic Profit Booking: Each structured cycle finishes with locked-in gains before the next cycle begins.</li>
            <li>Consisteny : 10% per month profit assurance.</li>
          </ul>
        </article>
      </section>

      {/* What else can we do for you? */}
      <section className="writeup container new-section">
        <h2 ref={newSubheadRef} className="subhead subhead-line fade-stage">What else can we do for you?</h2>
        <p ref={newContentRef} className="bodycopy fade-stage">
          We understand that trading can feel overwhelming, especially when progress seems stuck. That’s why we are here — not just as guides, but as a community built to walk this journey with you. Through weekly webinars, everyday community support, and live trading access, we create an environment where you’re never left alone with your doubts. Beyond learning, we want you to experience trading with clarity and confidence. For those who wish to take it further, we also work alongside professionals to responsibly grow their capital — not with empty promises, but with a disciplined approach that aims to set a real standard of returns. At the heart of it, everything we do is about helping you live a better, more secure life through proper guidance, honest insights, and collective growth.
        </p>
      </section>

      {/* Add-ons */}
      <section className="programs container addons-section">
        <h2 ref={addonSubheadRef} className="subhead no-line fade-stage">Add-ons</h2>

        <article ref={aspirantRef} className="prog-card fade-stage">
          <div className="prog-head">
            <h3>Aspirants Entrygate</h3>
            <span className="price">$13</span>
          </div>
          <p className="prog-desc">
            Access the Silent Equity Discord server's exclusive supports for a month.
          </p>
        </article>

        <article ref={raiderzRef} className="prog-card fade-stage">
          <div className="prog-head">
            <h3>Raiderz</h3>
            <span className="price">$13</span>
          </div>
          <p className="prog-desc">
            Too unwilling to learn or busy? Hold on, we got your back. Join as our Raider and get access to exclusive callouts of forex markets and investment insights.
          </p>
        </article>
      </section>

      <style>{`
        :root{
          --bg:#0d161c; --fg:#eafdfd; --teal:#7ff7ea;
          --usd-base:#c8fff4; --usd-mid:#76e8da; --usd-dark:#0b2f2a; --usd-glow:#12e7cf;
          --accent:#12e7cf; --accent2:#7ff7ea; --muted:#bfe9e6;
          --panel:#0f1923; --panel2:#0b1319; --border:rgba(122,255,244,.22);
          --path:#58e9da;
        }
        .initiatives-root{ min-height:100vh; background:var(--bg); color:var(--fg); }
        .container{ max-width:1100px; margin:0 auto; padding:0 6vw; }

        .initiatives-hero{
          position:relative; overflow:hidden;
          padding:clamp(36px,18vh,160px) 6vw clamp(28px,10vh,90px);
          background:
            radial-gradient(80vw 80vh at 78% 28%, rgba(26,200,180,.12), transparent 60%),
            radial-gradient(70vw 70vh at 18% 72%, rgba(26,200,180,.06), transparent 58%),
            #0e171d;
          isolation:isolate; /* local stacking context for predictable layering */
        }

        /* Ensure original title layers above decor */
        .hero-title-wrap{ position:relative; z-index:3; }
        .hero-title{
          position:relative; z-index:4;
          margin:0;
          font-family:'Orbitron','Space Grotesk',Poppins,system-ui,sans-serif;
          font-weight:900; letter-spacing:.6px;
          font-size:clamp(1.8rem,8vw,3rem); line-height:1.05;
          text-align:left; color:#eafdfd;
        }
        @media (max-width: 768px){ .hero-title { text-align:center; } }

        /* Fallback overlay title: sits exactly above the original location */
        /* Fallback overlay title: shifted right with page load-only animation */
.hero-title-overlay{
  position:absolute; inset:auto auto auto 0;
  left: clamp(8%, 12vw, 15%); /* moved more to the right */
  top:0;
  transform: translateY(0);
  width:100%;
  text-align:left;
  pointer-events:none;
  color:#eafdfd;
  font-family:'Orbitron','Space Grotesk',Poppins,system-ui,sans-serif;
  font-weight:900; letter-spacing:.6px;
  font-size:clamp(1.8rem,8vw,3rem); line-height:1.05;
  z-index:5; /* above dollars */
  
  /* Page load-only animation */
  opacity:0;
  transform: translateX(-20px) translateY(10) scale(0.95);
  animation: heroTitleLoad 1200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 300ms forwards;
}

@media (max-width:768px){ 
  .hero-title-overlay{ 
    left: 50%; 
    transform: translateX(-50%) translateY(-15px) scale(0.95);
    text-align:center;
    animation: heroTitleLoadMobile 1200ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 300ms forwards;
  } 
}

@keyframes heroTitleLoad{
  0%{ 
    opacity:0; 
    transform: translateX(-30px) translateY(0) scale(0.95);
    filter: blur(2px);
  }
  60%{ 
    opacity:0.8; 
    transform: translateX(5px) translateY(0) scale(1.02);
    filter: blur(0.5px);
  }
  100%{ 
    opacity:1; 
    transform: translateX(0) translateY(0) scale(1);
    filter: blur(0px);
  }
}

@keyframes heroTitleLoadMobile{
  0%{ 
    opacity:0; 
    transform: translateX(-50%) translateY(-15px) scale(0.95);
    filter: blur(2px);
  }
  60%{ 
    opacity:0.8; 
    transform: translateX(-50%) translateY(2px) scale(1.02);
    filter: blur(0.5px);
  }
  100%{ 
    opacity:1; 
    transform: translateX(-50%) translateY(0) scale(1);
    filter: blur(0px);
  }
}

/* Disable animation for reduced motion preference */
@media (prefers-reduced-motion:reduce){
  .hero-title-overlay{ 
    animation:none !important; 
    opacity:1 !important; 
    transform: translateX(0) translateY(0) scale(1) !important;
    filter: none !important;
  }
}

        @media (max-width:768px){ .hero-title-overlay{ text-align:center; } }

        /* Dollars */
        .dollar{
          position:absolute; z-index:1; inset:auto;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, 'Space Grotesk', sans-serif;
          font-weight:900; letter-spacing:.5px; color:transparent;
          -webkit-text-stroke:1px rgba(18,231,207,.35);
          text-shadow:0 0 18px rgba(18,231,207,.15), 0 8px 28px rgba(0,0,0,.45);
          background: radial-gradient(120% 120% at 20% 20%, rgba(63,63,63,.9), transparent 35%), linear-gradient(135deg, var(--usd-base), var(--usd-mid) 45%, var(--usd-dark) 90%);
          -webkit-background-clip:text; background-clip:text;
          pointer-events:none; user-select:none;
          filter: drop-shadow(0 8px 22px rgba(0,0,0,.45));
          opacity:0; transform:translateY(10px) scale(.94) rotate(var(--rot,0deg));
          animation:dollarIn .8s cubic-bezier(.2,.9,.2,1) forwards;
        }
        .dollar-right{ top:8%; right:6%; font-size:clamp(48px,10vw,140px); --rot:-10deg; animation: dollarIn .8s cubic-bezier(.2,.9,.2,1) 120ms forwards, glowPulse 4.5s ease-in-out 1200ms infinite; }
        .dollar-left{ top:4%; left:6%; font-size:clamp(36px,8vw,110px); --rot:12deg; opacity:.55; animation-delay:320ms; }
        .dollar-far-1{ top:24%; left:18%; font-size:clamp(28px,6vw,80px); --rot:-6deg; opacity:.22; filter:blur(1.5px) drop-shadow(0 6px 16px rgba(0,0,0,.35)); animation-delay:520ms; }
        .dollar-far-2{ top:40%; right:16%; font-size:clamp(24px,5.5vw,72px); --rot:8deg; opacity:.18; filter:blur(2px) drop-shadow(0 6px 16px rgba(0,0,0,.35)); animation-delay:700ms; }
        .dollar-far-3{ bottom:12%; left:10%; font-size:clamp(20px,5vw,64px); --rot:18deg; opacity:.14; filter:blur(2.5px) drop-shadow(0 6px 16px rgba(0,0,0,.35)); animation-delay:860ms; }
        @keyframes dollarIn{ 0%{opacity:0;transform:translateY(10px) scale(.94) rotate(var(--rot,0deg));filter:blur(3px)} 60%{transform:translateY(-2px);opacity:1;transform:translateY(-2px) scale(1.02) rotate(var(--rot,0deg));filter:blur(.5px)} 100%{transform:translateY(0);opacity:1;transform:translateY(0) scale(1) rotate(var(--rot,0deg))}}
        @keyframes glowPulse{0%,100%{text-shadow:0 0 18px rgba(18,231,207,.15),0 8px 28px rgba(0,0,0,.45)}50%{text-shadow:0 0 26px rgba(18,231,207,.22),0 10px 32px rgba(0,0,0,.5)}}

        /* Reveal sweep is translucent so text is never hidden */
        .reveal{ display:inline-block; position:relative; overflow:hidden; }
        .reveal::before{
          content:""; position:absolute; inset:0;
          background: linear-gradient(115deg, transparent 0%, rgba(127,247,234,.12) 18%, transparent 42%);
          transform: translateX(-130%); filter: blur(1px);
          animation: sweep 1200ms ease-out 180ms forwards;
          mix-blend-mode: screen; opacity:.35; pointer-events:none;
        }
        .line{ display:block; transform: translateY(24px); opacity:0; animation: lineUp 700ms cubic-bezier(.2,.9,.2,1) forwards; }
        .line:nth-child(1){ animation-delay:120ms } .line:nth-child(2){ animation-delay:280ms }
        @keyframes lineUp{0%{transform:translateY(24px);opacity:0}60%{transform:translateY(-2px);opacity:1}100%{transform:translateY(0);opacity:1}}
        @keyframes sweep{0%{transform:translateX(-120%);opacity:0}40%{opacity:.9}100%{transform:translateX(120%);opacity:0}}

        /* Mobile: remove overlapping decor to guarantee heading visibility */
        @media (max-width: 768px) {
          .dollar{ display:none; }
          .initiatives-hero{ padding: clamp(28px, 14vh, 120px) 6vw clamp(22px, 10vh, 70px); }
        }

        .writeup{ padding: clamp(22px, 6vh, 60px) 0 clamp(40px, 10vh, 90px); }
        @media (max-width: 768px) { .writeup { padding: 40px 0; } .tagline { font-size: 1rem; padding: 10px 12px; text-align: center; } }
        .fade-stage{ opacity:0; transform: translateY(10px); transition: opacity .5s ease, transform .5s ease; }
        .show.fade-stage { opacity: 1 !important; transform: translateY(0) !important; }

        .tagline{ margin:0; font-family:'Orbitron','Space Grotesk',Poppins,system-ui,sans-serif; font-weight:900; letter-spacing:.3px; font-size: clamp(1rem, 2.6vw, 1.25rem); color: var(--fg); background: linear-gradient(90deg, rgba(18,231,207,.18), rgba(127,247,234,.08) 60%, transparent); border:1px solid rgba(127,247,234,.28); padding:12px 14px; border-radius:12px; box-shadow:0 18px 36px rgba(0,0,0,.36); }
        .tagline .muted{ color: var(--muted); }
        .bodycopy{ margin:16px 0 0; color: var(--muted); line-height:1.8; font-size: clamp(.95rem, 2.2vw, 1.02rem); background: linear-gradient(180deg, rgba(255,255,255,.02), transparent 40%); padding: 8px 2px 0; }
        @media (max-width: 768px) { .bodycopy { font-size: .92rem; text-align: center; } }

        .flow-heading{ padding: clamp(18px, 4vh, 26px) 0 8px; }
        .subhead{
          margin: 0 0 10px; font-family:'Orbitron','Space Grotesk',Poppins,system-ui,sans-serif;
          font-weight:700; letter-spacing:.3px; font-size:clamp(1.05rem, 4.2vw, 1.3rem); color:var(--fg);
          position:relative; width:max-content;
        }
        .subhead-line::after{
          content:""; position:absolute; left:0; right:-6px; bottom:-8px; height:2px; border-radius:2px;
          background: linear-gradient(90deg, rgba(127,247,234,.38), rgba(127,247,234,.12) 60%, transparent);
          box-shadow: 0 8px 24px rgba(0,0,0,.35);
        }
        @media (max-width: 768px) {
          .subhead { text-align: center; width: 100%; }
          .subhead-line::after { left: 50%; transform: translateX(-50%); width: 80%; }
        }

        .flow-steps{
          position:relative;
          gap: clamp(24px, 4.5vh, 44px);
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-left: 20vw;
          padding-right: 20vw;
          scroll-behavior: smooth;
          opacity:0; transform: translateY(10px); transition: opacity .5s ease, transform .5s ease;
        }
        .flow{ padding: clamp(22px, 6vh, 56px) 0 clamp(30px, 10vh, 72px); }
        .flow.show .flow-steps, .flow.show{ opacity:1; transform: translateY(0); }
        .flow-svg{ position:absolute; inset:0; width:100%; height:100%; pointer-events:none; z-index:0; filter: drop-shadow(0 8px 18px rgba(0,0,0,.35)); }
        .flow-row{ position:relative; z-index:1; display:flex; align-items:flex-start; gap:14px; padding: 0 6px; transition: transform .15s ease; }
        .flow-row:hover{ transform: translateY(-1px); }
        .flow-row .badge{ flex:0 0 auto; width:32px; height:32px; border-radius:999px; background: radial-gradient(circle at 40% 40%, #7ff7ea, #12e7cf); color:#012326; font-weight:900; font-family:'Orbitron','Space Grotesk',Poppins,system-ui,sans-serif; display:flex; align-items:center; justify-content:center; box-shadow:0 10px 22px rgba(0,0,0,.35); }
        .row-content h3{ margin:0 0 6px; font-weight:800; font-family:'Orbitron','Space Grotesk',Poppins,system-ui,sans-serif; letter-spacing:.2px; font-size: clamp(0.98rem, 3.2vw, 1.12rem); color:var(--fg); }
        .row-content p{ margin:0; color: var(--muted); line-height:1.7; max-width: 980px; }
        .flow-row.right .row-content{ margin-left: 2px; }
        .flow-row.left  .row-content{ margin-left: 2px; }

        @media (max-width: 768px) {
          .flow-steps { padding-left: 10vw; padding-right: 10vw; gap: 20px; }
          .flow-row { flex-direction: column; align-items: center; text-align: center; min-width: 220px; padding: 0 8px; }
          .flow-row.right .row-content, .flow-row.left .row-content { margin-left: 0; }
          .flow-row .badge { margin-bottom: 8px; }
        }

        .programs{ padding: clamp(16px, 6vh, 60px) 0 clamp(36px, 10vh, 90px); display:grid; gap:18px; }
        .programs .subhead{ opacity:0; transform: translateY(8px); transition: opacity .4s ease, transform .4s ease; }
        .programs .subhead.show{ opacity:1; transform: translateY(0); }

        .prog-card{ display:flex; gap:16px; align-items:flex-start; background: linear-gradient(180deg, var(--panel), var(--panel2)); border:1px solid var(--border); border-radius:16px; padding:16px 18px; box-shadow: 0 28px 60px rgba(0,0,0,.38); transform: translateY(8px); opacity:0; transition: opacity .4s ease, transform .4s ease; }
        .prog-card.show{ opacity:1; transform: translateY(0); }
        .prog-head{ flex:1 1 100%; display:flex; flex-direction:column; gap:8px; }
        .prog-head h3{ margin:0; font-family:'Orbitron','Space Grotesk',Poppins,system-ui,sans-serif; font-weight:800; letter-spacing:.2px; font-size: clamp(1rem, 3.2vw, 1.25rem); color:var(--fg); }
        .prog-points{ margin:0; padding-left:1.1rem; color:var(--muted); display:grid; gap:.5rem; line-height:1.6; }
        .prog-desc{ margin:0; color:var(--muted); line-height:1.6; }

        .new-section{ padding: clamp(22px, 6vh, 60px) 0 clamp(40px, 10vh, 90px); }
        @media (max-width: 768px) { .new-section .bodycopy { text-align: center; } }

        .addons-section{ padding-top: 0; display:grid; gap:20px; }
        @media (min-width: 768px){ .addons-section{ grid-template-columns: 1fr 1fr; } }
        .addons-section .subhead{ margin-bottom: 24px; width:100%; }
        .addons-section .subhead.no-line::after{ content: none; }
        .addons-section .prog-card{ flex-direction: column; gap: 12px; }
        .addons-section .prog-head{ flex-direction:row; justify-content:space-between; align-items:flex-start; }

        .price{ font-family:'Orbitron','Space Grotesk',Poppins,system-ui,sans-serif; font-weight:700; font-size:1.1rem; color:var(--accent); white-space:nowrap; }

        @media (prefers-reduced-motion:reduce){
          .fade-stage{ opacity:1 !important; transform:none !important; transition:none !important; }
          .flow-steps{ opacity:1 !important; transform:none !important; }
        }
      `}</style>
    </main>
  );
}