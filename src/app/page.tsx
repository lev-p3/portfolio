"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDownRight, ArrowUpRight, Menu, X } from "lucide-react";
import Link from "next/link";

const services = [
  ["01", "Сайты под ключ", "Web / UX / integrations", "web"],
  ["02", "Дипломы / курсовые", "Structure / research / defence", "paper"],
  ["03", "Презентации", "Narrative / visual system", "slides"],
  ["04", "Документы по ГОСТ", "Logic / editing / layout", "docs"],
  ["05", "Консультации", "A clear next step", "consult"],
  ["06", "Подбор парфюмерии", "Taste / budget / sourcing", "scent"],
] as const;

const stack = [
  ["PostgreSQL", "Работа с данными и сложными связями"],
  ["MSSQL", "Запросы, структура, надёжность"],
  ["Python", "Автоматизация рутинных процессов"],
  ["SQL", "Язык, на котором порядок"],
  ["Docker", "Воспроизводимые окружения"],
  ["Git", "История решений, а не хаос"],
  ["Web", "Сайты, которые работают"],
  ["Automation", "Связать разрозненное в систему"],
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

function Portrait({ className = "" }: { className?: string }) {
  const [missing, setMissing] = useState(false);
  return <div className={`portrait ${className} ${missing ? "portrait-placeholder" : ""}`}>
    {missing ? <><span className="portrait-monogram">LP</span><span className="portrait-caption">PORTRAIT / COMING SOON</span></> :
      // The original portrait is deliberately never substituted with someone else's face.
      // eslint-disable-next-line @next/next/no-img-element
      <img src="/assets/levon-portrait.png" alt="Левон Петросян" onError={() => setMissing(true)} loading={className === "hero-image" ? "eager" : "lazy"} />}
  </div>;
}

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [chapter, setChapter] = useState(1);
  const [scent, setScent] = useState({ style: "Elegant", occasion: "Everyday", budget: "до 10 000" });

  useEffect(() => {
    let frame = 0;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 1001px)");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const hero = document.querySelector<HTMLElement>(".hero");
    const paper = document.querySelector<HTMLElement>(".paper-stack");
    const bottle = document.querySelector<HTMLElement>(".bottle");
    const update = () => {
      setScrolled(window.scrollY > 70);
      const ids = ["top", "about", "services", "work", "perfume", "contact"];
      let current = 1;
      ids.forEach((id, index) => { if ((document.getElementById(id)?.getBoundingClientRect().top ?? Infinity) < window.innerHeight * .5) current = index + 1; });
      setChapter(current);
      // Use the same scroll driver on Safari and desktop, without relying on CSS timeline support.
      const heroProgress = motion.matches ? 0 : Math.min(1, window.scrollY / Math.max(1, hero?.offsetHeight || window.innerHeight));
      hero?.style.setProperty("--hero-progress", String(heroProgress));
      [paper, bottle].forEach(element => {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          const progress = motion.matches ? 0 : Math.max(-1, Math.min(1, (window.innerHeight / 2 - rect.top) / window.innerHeight));
          element.style.setProperty("--drift", `${progress * (desktop.matches ? 50 : 22)}px`);
        }
      });
      document.documentElement.style.setProperty("--page-progress", String(window.scrollY / Math.max(1, document.documentElement.scrollHeight - window.innerHeight)));
      frame = 0;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(update); };
    const onMove = (event: MouseEvent) => {
      if (!motion.matches && finePointer.matches && cursorRef.current) cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    const onOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const label = target.closest("[data-cursor]")?.getAttribute("data-cursor") || "";
      if (cursorRef.current) { cursorRef.current.textContent = label; cursorRef.current.classList.toggle("cursor-active", Boolean(label)); }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMove);
    document.addEventListener("mouseover", onOver);
    window.addEventListener("resize", onScroll);
    motion.addEventListener("change", onScroll);
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add("is-visible"); revealObserver.unobserve(entry.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -8%" });
    document.querySelectorAll(".section-pad, .case-card, .timeline-item, .stack-list > div").forEach((element) => { element.classList.add("reveal-item"); revealObserver.observe(element); });
    const slides = trackRef.current;
    const gallery = galleryRef.current;
    let slideFrame = 0;
    const onGalleryScroll = () => {
      if (!slides || !gallery || motion.matches || slideFrame) return;
      slideFrame = requestAnimationFrame(() => {
        const range = Math.max(1, gallery.offsetHeight - window.innerHeight);
        const progress = Math.max(0, Math.min(1, -gallery.getBoundingClientRect().top / range));
        const visibleWidth = desktop.matches ? window.innerWidth * .86 : window.innerWidth * .86;
        slides.style.transform = `translate3d(${-progress * Math.max(0, slides.scrollWidth - visibleWidth)}px,0,0)`;
        gallery.style.setProperty("--gallery-progress", String(progress));
        slideFrame = 0;
      });
    };
    window.addEventListener("scroll", onGalleryScroll, { passive: true });
    window.addEventListener("resize", onGalleryScroll);
    onGalleryScroll();
    update();
    return () => { cancelAnimationFrame(frame); cancelAnimationFrame(slideFrame); revealObserver.disconnect(); window.removeEventListener("scroll", onScroll); window.removeEventListener("scroll", onGalleryScroll); window.removeEventListener("mousemove", onMove); window.removeEventListener("resize", onScroll); window.removeEventListener("resize", onGalleryScroll); motion.removeEventListener("change", onScroll); document.removeEventListener("mouseover", onOver); };
  }, []);

  return <main className="portfolio">
    <div className="grain" />
    <a className="skip-link" href="#services">Перейти к услугам</a>
    <div ref={cursorRef} className="cursor" aria-hidden="true" />
    <header className={`site-header ${scrolled ? "header-scrolled" : ""}`}>
      <button className="logo" onClick={() => scrollToId("top")} aria-label="В начало">LP<span>.</span></button>
       <nav id="site-navigation" className={menu ? "nav-open" : ""} aria-hidden={!menu && undefined}><button onClick={() => { scrollToId("work"); setMenu(false); }}>WORK</button><button onClick={() => { scrollToId("services"); setMenu(false); }}>SERVICES</button><button onClick={() => { scrollToId("about"); setMenu(false); }}>ABOUT</button><Link href="/contact" onClick={() => setMenu(false)}>CONTACT</Link></nav>
      <button className="menu-button" aria-controls="site-navigation" aria-expanded={menu} onClick={() => setMenu(!menu)} aria-label={menu ? "Закрыть меню" : "Открыть меню"}>{menu ? <X size={19} /> : <Menu size={19} />}</button>
    </header>

    <aside className="progress" aria-label={`Раздел ${chapter} из 6`}><span>0{chapter} / 06</span><i /></aside>
    <section id="top" className="hero">
      <Portrait className="hero-image" />
      <div className="signature-line" aria-hidden="true" />
      <div className="hero-vignette" />
      <div className="hero-meta"><span>55.7558° N / 37.6173° E</span><span>MOSCOW / 2026</span></div>
      <div className="hero-copy"><p className="eyebrow">DIGITAL SOLUTIONS / CREATIVE SERVICES</p><h1>ЛЕВОН<br /><em>ПЕТРОСЯН</em></h1><p className="hero-sub">Создаю цифровые решения и помогаю превращать сложные задачи в понятный результат.</p></div>
      <div className="hero-bottom"><span>SCROLL TO EXPLORE <ArrowDownRight size={15} /></span><span>01 — 06</span></div>
    </section>

    <section id="about" className="intro section-pad">
      <div className="section-index">01 <span>INTRO</span></div>
      <div className="intro-grid"><h2>Я собираю решения,<br />которые должны<br />не просто <span data-cursor="VIEW">выглядеть</span>,<br /><strong data-cursor="EXPLORE">а работать.</strong></h2><div className="intro-note"><p className="eyebrow">LEVON PETROSYAN / MOSCOW</p><p>Работаю с веб-разработкой, автоматизацией, базами данных, документами и визуальной подачей проектов.</p><div className="tag-list"><span>Разработка</span><span>Автоматизация</span><span>Документы</span><span>Презентации</span><span>Консультации</span></div></div></div>
    </section>

    <section id="services" className="services section-pad"><div className="section-index">02 <span>SERVICES / INDEX</span></div><div className="services-head"><h2>Чем могу<br /><em>быть полезен.</em></h2><p>Не набор одинаковых услуг.<br />Скорее — разные способы<br />собрать хороший результат.</p></div><div className="service-list">{services.map(([number, title, sub, kind]) => <button key={number} className="service-row" data-cursor="VIEW" onClick={() => scrollToId(kind === "web" ? "work" : kind === "scent" ? "perfume" : "contact")}><span>{number}</span><b>{title}</b><small>{sub}</small><ArrowUpRight size={19} /><i className={`service-preview preview-${kind}`} /></button>)}</div></section>

    <section id="work" className="case-study section-pad"><div className="section-index">03 <span>SELECTED WORK / 04</span></div><div className="case-lead"><p className="eyebrow">SITES / BOTS / INTEGRATIONS</p><h2>Сайт должен работать<br />до того, как<br /><em>клиент написал вам.</em></h2><p>От первого вопроса до внедрения: собираю требования, проектирую логику, соединяю сервисы и проверяю всё в работе.</p></div><div className="case-rail">{[["01", "Строительная компания", "структура / документация", "construction"], ["02", "Салон красоты", "сайт / онлайн-запись", "beauty"], ["03", "Telegram-бот", "сценарий / интеграции", "bot"], ["04", "Консалтинговая компания", "презентационный сайт", "consulting"]].map(([n, title, desc, mock]) => <a href="https://github.com/lev-p3" target="_blank" rel="noreferrer" aria-label={`${title}: открыть GitHub Levon`} className="case-card" key={n} data-cursor="GITHUB"><span>{n}</span><div className={`mini-mock mock-${mock}`} aria-hidden="true"><i /><b /><em /><small>OPEN PROJECT ↗</small></div><div><h3>{title}</h3><p>{desc}</p></div><ArrowUpRight size={18} /></a>)}</div><div className="process"><span>01 Анализ задачи</span><span>02 UX</span><span>03 Дизайн</span><span>04 Разработка</span><span>05 Интеграции</span><span>06 Запуск</span></div></section>

    <section className="paper-section section-pad"><div className="section-index">04 <span>ACADEMIC / EDITORIAL</span></div><div className="paper-layout"><div><p className="eyebrow">15+ УЧЕБНЫХ ПРОЕКТОВ</p><h2>Сложную тему —<br />в понятную<br /><em>структуру.</em></h2><p className="body-copy">Помощь с дипломными и курсовыми проектами: анализ материала, структурирование, редактирование, оформление, презентация и подготовка к защите.</p></div><div className="paper-stack"><div className="paper paper-back"><span>TABLE / 02</span></div><div className="paper paper-front"><span>RESEARCH<br />&amp; STRUCTURE</span><strong>01</strong><i>────────────<br />────────<br />──────</i></div></div></div></section>

    <section ref={galleryRef} className="gallery-scroll"><div className="slides section-pad"><div className="section-index">05 <span>PRESENTATIONS / VISUAL CONCEPTS</span></div><div className="slides-head"><h2>Одна мысль.<br /><em>Сильная подача.</em></h2><p>Презентация — это не набор слайдов. Это маршрут, по которому зритель приходит к решению.</p></div><div ref={trackRef} className="slide-track" tabIndex={0} aria-label="Галерея визуальных концепций">{["01 / CONTEXT", "02 / IDEA", "03 / SYSTEM", "04 / PROOF", "05 / RESULT"].map((slide, i) => <div className={`slide slide-${i + 1}`} key={slide}><span>{slide}</span><strong>{["MAKE IT CLEAR.", "FIND THE THREAD.", "SHOW THE LOGIC.", "LAND THE IDEA.", "MAKE IT WORK."][i]}</strong><i>{i === 2 ? "DATA / FORM / MOTION" : "LEVON PETROSYAN"}</i><div className="slide-glow" /><div className="slide-index">0{i + 1}</div></div>)}</div><div className="gallery-controls"><span>DRAG / SWIPE TO EXPLORE</span><div><button type="button" aria-label="Предыдущий слайд" onClick={() => trackRef.current?.scrollBy({ left: -window.innerWidth * .7, behavior: "smooth" })}>←</button><button type="button" aria-label="Следующий слайд" onClick={() => trackRef.current?.scrollBy({ left: window.innerWidth * .7, behavior: "smooth" })}>→</button></div></div></div></section>

    <section className="docs section-pad"><div className="docs-word">STRUCTURE<br /><span>LOGIC</span><br />GOST</div><div className="docs-copy"><p className="eyebrow">DOCUMENTS / EDITING / LAYOUT</p><h2>Структура.<br />Оформление.<br /><em>Логика.</em></h2><p>Помощь с оформлением учебных и деловых документов по требованиям заказчика и применимым стандартам.</p><div className="doc-lines"><span>Титульный лист</span><span>Оглавление</span><span>Таблицы и ссылки</span><span>Сноски / редактура</span></div></div></section>

    <section className="consult section-pad"><p className="eyebrow">CONSULTING / A CLEAR NEXT STEP</p><h2>Иногда решение<br />нужно найти<br /><em>до того, как<br />начать работу.</em></h2><p>Сайты, структура проекта, презентации, документы, базы данных, автоматизация и учебные проекты.</p><Link className="contact-button" href="/contact">ОБСУДИТЬ ЗАДАЧУ <ArrowUpRight size={20} /></Link></section>
    <section id="perfume" className="perfume section-pad"><div className="perfume-glow" /><div className="section-index">06 <span>SCENT / PERSONAL SELECTION</span></div><div className="perfume-grid"><div><p className="eyebrow">A DIFFERENT KIND OF DETAIL</p><h2>Хороший аромат<br />не обязан стоить<br /><em>как витрина бутика.</em></h2><p>Подбор оригинальной парфюмерии под стиль, бюджет и предпочтения. Помогу найти оригинальные ароматы по более выгодной цене.</p></div><div className="bottle" aria-hidden="true"><div className="bottle-cap" /><div className="bottle-body"><span>LP<br /><small>PARFUM</small></span></div></div><div className="selector"><p className="eyebrow">FIND YOUR DIRECTION</p>{[["Стиль", ["Fresh", "Woody", "Sweet", "Spicy", "Clean", "Elegant"], "style"], ["Повод", ["Everyday", "Date", "Office", "Evening"], "occasion"], ["Budget", ["до 5 000", "до 10 000", "до 15 000"], "budget"]].map(([label, options, key]) => <div className="select-group" key={label as string}><span>{label as string}</span><div role="group" aria-label={label as string}>{(options as string[]).map(option => <button key={option} aria-pressed={scent[key as keyof typeof scent] === option} className={scent[key as keyof typeof scent] === option ? "selected" : ""} onClick={() => setScent({ ...scent, [key as string]: option })}>{option}</button>)}</div></div>)}<div className="recommendation" aria-live="polite"><small>YOUR DIRECTION / ПРЕДВАРИТЕЛЬНЫЙ ПОДБОР</small><b>{({ Fresh: "Цитрус и бергамот", Woody: "Кедр и ветивер", Sweet: "Ваниль и тонка", Spicy: "Кардамон и перец", Clean: "Ирис и мягкий мускус", Elegant: "Ирис и сандал" } as Record<string, string>)[scent.style]}</b><span>{["Office", "Everyday"].includes(scent.occasion) ? "Деликатный шлейф и лёгкая концентрация." : "Более насыщенная композиция для выразительного акцента."} Бюджет {scent.budget} ₽: {scent.budget === "до 5 000" ? "начнём с небольших объёмов и пробников" : "сравним доступные объёмы и предложения"}. Перед покупкой рекомендую затест на коже.</span><Link href={{ pathname: "/contact", query: scent }}>ЗАПРОСИТЬ ПОДБОР ↗</Link></div></div></div></section>

    <section className="timeline section-pad"><div className="section-index">07 <span>ORIGIN / NOW</span></div><h2>Опыт, который<br />собирается <em>слоями.</em></h2><div className="timeline-list">{[["2022", "Строительство / документация", "Сметная документация и внимание к деталям на месте."], ["2025", "Базы данных / технический опыт", "SQL, PostgreSQL, MSSQL и работа со структурой данных."], ["2026", "Разработка / автоматизация", "Сайты, Telegram-боты, интеграции и тестирование."], ["TODAY", "Собственные digital services", "Собираю разрозненные задачи в понятные решения."]].map(([year, title, text]) => <div className="timeline-item" key={year}><strong>{year}</strong><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></section>

    <section className="stack-section section-pad"><div className="section-index">08 <span>TOOLS / MINDSET</span></div><div className="stack-head"><h2>Инструменты<br /><em>без шума.</em></h2><p>Технология — не самоцель. Она должна помогать задаче исчезнуть.</p></div><div className="stack-list">{stack.map(([name, desc]) => <div key={name} data-cursor={name}><b>{name}</b><span>{desc}</span></div>)}</div><div className="approach"><p className="eyebrow">MY APPROACH</p><h2>НЕ ПРОСТО<br />СДЕЛАТЬ.<br /><em>СДЕЛАТЬ<br />НОРМАЛЬНО.</em></h2><div><span>01 <b>ПОНЯТЬ ЗАДАЧУ</b></span><span>02 <b>СОБРАТЬ РЕШЕНИЕ</b></span><span>03 <b>ДОВЕСТИ ДО РЕЗУЛЬТАТА</b></span></div></div></section>

    <section id="contact" className="contact section-pad"><div className="contact-orbit" /><div className="contact-portrait"><Portrait className="orb-image" /></div><p className="eyebrow">LET&apos;S MAKE SOMETHING USEFUL</p><h2>Есть задача?<br /><em>Давайте соберём<br />решение.</em></h2><Link className="contact-button" data-cursor="OPEN" href="/contact">НАПИСАТЬ МНЕ <ArrowUpRight size={21} /></Link><div className="contact-meta"><a href="mailto:leopetrosyan9@gmail.com">leopetrosyan9@gmail.com</a><a href="https://wa.me/79165260709">WhatsApp: +7 (916) 526-07-09</a><a href="https://t.me/lev_p3">Telegram: @lev_p3</a></div></section>
    <footer><b>LEVON PETROSYAN<span>.</span></b><span>DIGITAL / AUTOMATION / DOCUMENTS / DESIGN</span><span>© 2026 · MADE WITH ATTENTION TO DETAIL.</span></footer>
  </main>;
}
