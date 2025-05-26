import React from "react";
import Header from "../components/Header";

const ContactsPage = () => {
  return (
    <>
      <Header title="Наши контакты" />
      <div
        style={{
          display: "flex",
          height: "100%",
        }}
      >
        <div style={{ maxWidth: 800, fontSize: "1.3rem" }}>
          <p className="contacts__block">
            <span>E-mail: </span>
            <a href="mailto:kazneft@kaznp.ru">kazneft@kaznp.ru</a>
          </p>
          <p className="contacts__block">
            <span>Бухгалтерия: </span>
            <a href="mailto:buh@kaznp.ru">buh@kaznp.ru</a>
          </p>
          <p className="contacts__block">
            <span>Юридическая служба: </span>
            <a href="mailto:urist@kaznp.ru">urist@kaznp.ru</a>
          </p>
          <p className="contacts__block">
            <span>Тендерный отдел: </span>
            <a href="mailto:tender@kaznp.ru">tender@kaznp.ru</a>
          </p>
          <p className="contacts__block">
            <span>Служба клиентского сопровождения: </span>
            <a href="mailto:ckc@kaznp.ru">ckc@kaznp.ru</a>
          </p>
          <br />
          <p className="contacts__block">
            <span>Конт.тел: </span>
            <a href="tel: +7 927-248-50-67">+7 927-248-50-67</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default ContactsPage;
