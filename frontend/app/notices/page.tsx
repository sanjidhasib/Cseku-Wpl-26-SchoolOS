import NavBar from "../components/NavBar";

const notices = [
  {
    title: "Exam schedule",
    date: "2026-08-25",
    text: "The midterm exam for Class 9 and 10 will begin next Monday. Please check the timetable.",
  },
  {
    title: "School holiday",
    date: "2026-08-27",
    text: "The school will remain closed on Friday due to the national holiday.",
  },
  {
    title: "Event notice",
    date: "2026-08-30",
    text: "The annual science fair details will be announced by the teacher council shortly.",
  },
];

export default function NoticesPage() {
  return (
    <main className="page-shell">
      <NavBar />

      <section className="hero-panel">
        <div>
          <p className="eyebrow">Announcement</p>
          <h1>Notice board</h1>
        </div>
      </section>

      <section className="stack-panel">
        {notices.map((notice) => (
          <div key={notice.title} className="panel">
            <div className="notice-head">
              <h3>{notice.title}</h3>
              <span>{notice.date}</span>
            </div>
            <p>{notice.text}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
