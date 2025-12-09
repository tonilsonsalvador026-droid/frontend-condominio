// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  pt: {
    translation: {
      email: "Digite o seu email",
      password: "Digite a sua palavra-passe",
      forgotPassword: "Esqueceu a palavra passe?",
      login: "Entrar",
      system: {
        gestao: "Gestão",
        condominio: "Condomínios",
        slogan: "Momentum.si",
      },
      language: {
        portuguese: "Português",
        kimbundu: "Kimbundu",
        umbundu: "Umbundu",
      },
      errors: {
        emptyFields: "Por favor, preencha todos os campos.",
        invalidEmail: "Digite um email válido.",
      },
      recuperar: {
        titulo: "Recuperar Palavra Passe",
        email: "Digite o seu email",
        placeholder: "exemplo@email.com",
        botao: "Recuperar",
        lembrou: "Lembrou-se?",
        loginLink: "Faça login aqui",
        linkEnviado: "Link de recuperação enviado para: {{email}}",
      },
      welcome: {
        hello: "Olá",
        admin: "Administrador",
        user: "Usuário",
        aiRecognized:
          "Inteligência Artificial te reconheceu automaticamente 🎉",
        readMessage: "Leia este texto com atenção. Em",
        timeNotice: "30 segundos",
        accessOptions: "você terá acesso às opções do sistema",
        button: "Avançar",

        // Adicionados para WelcomeActionsPage.js
        greeting: "Seja bem-vindo",
        chooseOption: "Escolha uma das opções abaixo para continuar:",
        inviteUser: "Convidar Novo Usuário",
        recoverPassword: "Recuperar Senha de Usuário",
        goToMainPage: "Ir para a Página Principal",
        },
      motivational: {
        monday: [
          "Acredite em si mesmo e tudo será possível! 💪",
          "Toda segunda é uma nova chance para vencer! 🚀",
          "Você é mais forte do que imagina!",
          "A semana só está começando, faça acontecer!",
          "Persistência é o caminho para o sucesso!",
        ],
      },
      learning: {
        week: [
          "Aprender nunca é demais, continue evoluindo 📘",
          "O conhecimento é a única coisa que ninguém pode tirar de você.",
          "Cada login é uma nova oportunidade de crescer!",
          "Aprender algo novo hoje te leva mais longe amanhã.",
          "Seja curioso: a curiosidade abre portas ✨",
        ],
      },
    },
  },

  kmb: {
    translation: {
      email: "Kuma ndinga email yenu",
      password: "Kuma ndinga kiphasi",
      forgotPassword: "Wakula kiphasi?",
      login: "Kukwata",
      system: {
        gestao: "Kulombolola",
        condominio: "Kondomu",
        slogan: "Momentum.si",
      },
      language: {
        portuguese: "Português",
        kimbundu: "Kimbundu",
        umbundu: "Umbundu",
      },
      errors: {
        emptyFields: "Tala kinsinda kulombolola osoni.",
        invalidEmail: "Email yenu kayi vali.",
      },
      recuperar: {
        titulo: "Kubutula Nsangu ya Seka",
        email: "Kuma ndinga email yenu",
        placeholder: "exemplo@email.com",
        botao: "Kubutula",
        lembrou: "Wakumbuka?",
        loginLink: "Yenda ku login awa",
        linkEnviado: "Link ya kubutula itumwidi ku: {{email}}",
      },
      welcome: {
        hello: "Wakamba",
        admin: "Mukambi",
        user: "Muntu",
        aiRecognized: "AI yikukwatudi kyoka 🎉",
        readMessage: "Soma onkanda yayi. Mu",
        timeNotice: "sekondi 30",
        accessOptions: "wakole ku meso ya sistemu",
        button: "Twala mbele",

        // WelcomeActionsPage.js
        greeting: "Kiawala muene",
        chooseOption: "T'kala mu nkanda yaku lunga nzila:",
        inviteUser: "Lambula muntu mu zandu",
        recoverPassword: "Tala nswasu ya muntu",
        goToMainPage: "Kuenda mu makila maku",
      },
      motivational: {
        monday: [
          "Suvila mu nitu yako, kadi osoni okuvua!",
          "Luvila lwonso luyi luvila lwa kubela!",
          "Owe wa kulu okuvua 💪",
          "Lubila lwenene lwikela, lombolola!",
          "Kuvua yikila kyoka ku success 🚀",
        ],
      },
      learning: {
        week: [
          "Kusoma kayi vali, lombolola muvi 📘",
          "Osoni kayi vali okuvuwa osoni yenu.",
          "Login yoso yikela luvila lwa kusoma!",
          "Kusoma elamba yoso yikela mu lumbu lwa kuvuwa.",
          "Kuva kyuka: kivuya mikanda ✨",
        ],
      },
    },
  },

  umb: {
    translation: {
      email: "Tya ndinga email yove",
      password: "Tya ndinga olombali",
      forgotPassword: "Okwatele olombali?",
      login: "Okulonga",
      system: {
        gestao: "Okutalula",
        condominio: "Kondomu",
        slogan: "Momentum.si",
      },
      language: {
        portuguese: "Português",
        kimbundu: "Kimbundu",
        umbundu: "Umbundu",
      },
      errors: {
        emptyFields: "Okulomba okufeka onkala yonke.",
        invalidEmail: "Email kayi vali.",
      },
      recuperar: {
        titulo: "Olongiso ya Lufulu",
        email: "Tya ndinga email yove",
        placeholder: "exemplo@email.com",
        botao: "Longisa",
        lembrou: "Wakolela?",
        loginLink: "Kota awa",
        linkEnviado: "Link ya olongiso yatume ku: {{email}}",
      },
      welcome: {
        hello: "Wa ndinga",
        admin: "Olongiso",
        user: "Omuntu",
        aiRecognized: "AI yakuvona oku longela 🎉",
        readMessage: "Tala eyi onkanda. Mu",
        timeNotice: "sekondi 30",
        accessOptions: "okulonga ku meso ya sistema",
        button: "Enda okupele",

        // WelcomeActionsPage.js
        greeting: "Kakuyuke",
        chooseOption: "Tchitave okukwata eshimwe shoka okutwala:",
        inviteUser: "Okulamba omuena omupya",
        recoverPassword: "Okutwala okuliwa kwa omuena",
        goToMainPage: "Okulonga epandja liki",
      },
      motivational: {
        monday: [
          "Tala okuvimba we, osona vyosi vi posikile!",
          "Oluvilo lweke lwosi lwi oshelela kuvangula!",
          "Ove wa kulu okuvangula 💪",
          "Oluvilo lwosi lutangi, yenda!",
          "Okulonga okuvimba yikala ku sucesso 🚀",
        ],
      },
      learning: {
        week: [
          "Okusoma kayi vali, yende okuvimba 📘",
          "Eyi kayi vali okuvimba kove.",
          "Login yosi yikala okuvona okuvimba!",
          "Okusoma osoni vyosi yikala okuvimba vyosi.",
          "Okukwatela, okuvimba okuvula onkala ✨",
        ],
      },
    },
  },
};

const savedLang = localStorage.getItem("lang") || "pt";

i18n.use(initReactI18next).init({
  resources,
  lng: savedLang,
  fallbackLng: "pt",
  interpolation: { escapeValue: false },
});

i18n.on("languageChanged", (lng) => {
  localStorage.setItem("lang", lng);
});

export default i18n;