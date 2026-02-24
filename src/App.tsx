import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

const fetchDuas = () =>
  new Promise((resolve) => {
    fetch(`/duas.json`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        resolve(data);
      })
      .catch((error) => {
        console.error("Error fetching duas:", error);
      });
  });

function App() {
  const [duas, setDuas] = useState([]);

  useEffect(() => {
    fetchDuas().then((data) => {
      setDuas(data);
    });
  }, []);
  return (
    <>
      {/* <pre>{JSON.stringify(duas, null, 2)}</pre> */}
      <header className="header">
        <div className="bismillah">بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيمِ</div>
        <h1 className="title-main">{duas.header?.title}</h1>
        <p className="title-sub">{duas.header?.subtitle}</p>
      </header>
      <div className="grid">
        {Object.values(duas.duas || {})?.map((dua: any) => (
          <div className="dua-card short">
            <div className="dua-number">{dua.number}</div>
            <div className="dua-text">{dua.text}</div>
          </div>
        ))}
      </div>

      <footer>
        <div className="ornament">✦ ✦ ✦</div>
        <p>
          {duas.footer?.title} • {duas.footer?.text}
        </p>
      </footer>
    </>
  );
}

export default App;
