import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import "./contact.css";

export const metadata: Metadata = {
  title: "Контакты | Левон Петросян",
  description: "Обсудить задачу или подбор парфюмерии с Левоном Петросяном.",
};

export default function ContactPage({ searchParams }: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const selection = [["style", "Стиль"], ["occasion", "Повод"], ["budget", "Бюджет"]]
    .flatMap(([key, label]) => {
      const raw = searchParams[key];
      const value = (Array.isArray(raw) ? raw[0] : raw)?.trim();
      return value ? [{ key, label, value }] : [];
    });
  const subject = selection.length ? "Подбор аромата" : "Обсудить задачу";
  const draft = selection.length
    ? `Здравствуйте! Хочу запросить подбор парфюмерии.\n\n${selection.map(({ key, label, value }) => `${label}: ${value}${key === "budget" ? " рублей" : ""}`).join("\n")}`
    : "Здравствуйте! Хочу обсудить задачу.\n\nОписание задачи: ";

  return <div className="contact-page">
    <a className="skip-link" href="#contact-content">Перейти к способам связи</a>
    <header className="contact-page-header">
      <Link className="contact-page-logo" href="/" aria-label="Левон Петросян, главная">LP<span>.</span></Link>
      <Link className="contact-page-back" href="/"><ArrowLeft size={16} aria-hidden="true" /> На главную</Link>
    </header>
    <main id="contact-content" className="contact-page-main">
      <p className="contact-page-kicker">LEVON PETROSYAN / DIRECT CONTACT</p>
      <div className="contact-page-grid">
        <section aria-labelledby="contact-title">
          <h1 id="contact-title">Есть задача?<br /><em>Давайте<br />обсудим.</em></h1>
          <p className="contact-page-intro">Расскажите, что хотите сделать, какие есть сроки и пожелания. Выберите удобный способ связи.</p>
          {selection.length > 0 && <section className="contact-selection" aria-labelledby="selection-title">
            <h2 id="selection-title">Ваш подбор парфюмерии</h2>
            <dl>{selection.map(({ key, label, value }) => <div key={key}><dt>{label}</dt><dd>{value}{key === "budget" ? " рублей" : ""}</dd></div>)}</dl>
            <p>Параметры уже добавлены в черновики Email и WhatsApp. Для Telegram укажите их в сообщении.</p>
          </section>}
        </section>
        <section className="contact-channels" aria-labelledby="channels-title">
          <h2 id="channels-title">Выберите канал</h2>
          <a className="contact-channel" href="https://t.me/lev_p3"><span className="contact-channel-number" aria-hidden="true">01</span><span><span className="contact-channel-label">Telegram</span><span className="contact-channel-detail">@lev_p3</span></span><ArrowUpRight aria-hidden="true" /></a>
          <a className="contact-channel" href={`https://wa.me/79165260709?text=${encodeURIComponent(draft)}`}><span className="contact-channel-number" aria-hidden="true">02</span><span><span className="contact-channel-label">WhatsApp</span><span className="contact-channel-detail">+7 (916) 526-07-09</span></span><ArrowUpRight aria-hidden="true" /></a>
          <a className="contact-channel" href={`mailto:leopetrosyan9@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`}><span className="contact-channel-number" aria-hidden="true">03</span><span><span className="contact-channel-label">Email</span><span className="contact-channel-detail">leopetrosyan9@gmail.com</span></span><ArrowUpRight aria-hidden="true" /></a>
          <p className="contact-channel-note">Ссылки открывают выбранный сервис. Сообщение отправляется только после вашего подтверждения в нём.</p>
        </section>
      </div>
    </main>
    <div className="contact-page-signoff">ЛЕВОН ПЕТРОСЯН <span>DIGITAL / DOCUMENTS / SCENT</span></div>
  </div>;
}
