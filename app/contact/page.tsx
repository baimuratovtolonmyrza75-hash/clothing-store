"use client";

import { useLanguage } from "@/context/LanguageContext";

const content = {
  kg: {
    title: "БАЙЛАНЫШ",
    subtitle: "Буйрутма, өлчөм же кызматташуу боюнча бизге кайрылыңыз.",
    getInTouch: "БАЙЛАНЫШ МААЛЫМАТЫ",
    sendMessage: "КАБАР ЖӨНӨТҮҮ",
    name: "Аты",
    email: "Email",
    subject: "Тема",
    message: "Кабар",
    send: "ЖӨНӨТҮҮ",
    hours: ["Дүй - Жум: 10:00 - 19:00", "Ишм: 11:00 - 17:00", "Жек: Дем алыш"],
    labels: {
      general: "Жалпы",
      support: "Колдоо",
      wholesale: "Опт",
      phone: "Телефон",
    },
  },
  ru: {
    title: "КОНТАКТЫ",
    subtitle: "Свяжитесь с нами по вопросам заказа, размеров или сотрудничества.",
    getInTouch: "КОНТАКТНАЯ ИНФОРМАЦИЯ",
    sendMessage: "ОТПРАВИТЬ СООБЩЕНИЕ",
    name: "Имя",
    email: "Email",
    subject: "Тема",
    message: "Сообщение",
    send: "ОТПРАВИТЬ",
    hours: ["Пн - Пт: 10:00 - 19:00", "Сб: 11:00 - 17:00", "Вс: Выходной"],
    labels: {
      general: "Общие",
      support: "Поддержка",
      wholesale: "Опт",
      phone: "Телефон",
    },
  },
  en: {
    title: "CONTACT",
    subtitle: "Reach out for orders, sizing help, collaborations, or press inquiries.",
    getInTouch: "GET IN TOUCH",
    sendMessage: "SEND A MESSAGE",
    name: "Name",
    email: "Email",
    subject: "Subject",
    message: "Message",
    send: "SEND",
    hours: ["Mon - Fri: 10:00 - 19:00", "Sat: 11:00 - 17:00", "Sun: Closed"],
    labels: {
      general: "General",
      support: "Support",
      wholesale: "Wholesale",
      phone: "Phone",
    },
  },
} as const;

export default function ContactPage() {
  const { language } = useLanguage();
  const copy = content[language];

  const contactRows = [
    { label: copy.labels.general, value: "hello@oimo.com" },
    { label: copy.labels.support, value: "support@oimo.com" },
    { label: copy.labels.wholesale, value: "sales@oimo.com" },
    { label: copy.labels.phone, value: "+996 (555) 12-34-56" },
  ];

  return (
    <main className="min-h-screen bg-white text-black px-6 md:px-10 pt-24 pb-16">
      <div className="max-w-5xl mx-auto space-y-12">
        <header className="space-y-3">
          <h1 className="text-3xl md:text-4xl tracking-[0.2em]">{copy.title}</h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl">
            {copy.subtitle}
          </p>
        </header>

        <section className="grid md:grid-cols-2 gap-10">
          <div className="border border-black p-6 space-y-5">
            <h2 className="text-xl font-semibold">{copy.getInTouch}</h2>
            <div className="space-y-3 text-sm">
              {contactRows.map((row) => (
                <div key={row.label} className="flex justify-between gap-4 border-b pb-2">
                  <span className="text-gray-500">{row.label}</span>
                  <span className="font-medium text-right">{row.value}</span>
                </div>
              ))}
            </div>
            <div className="pt-3 text-sm text-gray-600">
              {copy.hours.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>

          <form className="border border-black p-6 space-y-4">
            <h2 className="text-xl font-semibold">{copy.sendMessage}</h2>
            <input
              type="text"
              placeholder={copy.name}
              className="w-full border border-black px-4 py-3 focus:outline-none"
            />
            <input
              type="email"
              placeholder={copy.email}
              className="w-full border border-black px-4 py-3 focus:outline-none"
            />
            <input
              type="text"
              placeholder={copy.subject}
              className="w-full border border-black px-4 py-3 focus:outline-none"
            />
            <textarea
              placeholder={copy.message}
              rows={6}
              className="w-full border border-black px-4 py-3 focus:outline-none resize-none"
            />
            <button
              type="button"
              className="w-full bg-black text-white py-3 font-semibold hover:bg-gray-800 transition"
            >
              {copy.send}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
