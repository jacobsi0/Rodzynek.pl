export type Locale = "pl" | "en";
export type PublicRouteKey = "home" | "about" | "workshops" | "project" | "team" | "contact";

export const defaultLocale: Locale = "pl";
export const locales = ["pl", "en"] as const;

export const publicPaths: Record<Locale, Record<PublicRouteKey, string>> = {
  pl: {
    home: "/",
    about: "/o-nas",
    workshops: "/warsztaty",
    project: "/projekt",
    team: "/zespol",
    contact: "/kontakt",
  },
  en: {
    home: "/en",
    about: "/en/about",
    workshops: "/en/workshops",
    project: "/en/project",
    team: "/en/team",
    contact: "/en/contact",
  },
};

export const publicSectionIds: Record<Locale, Record<Exclude<PublicRouteKey, "home">, string>> = {
  pl: {
    about: "o-nas",
    workshops: "warsztaty",
    project: "projekt",
    team: "zespol",
    contact: "kontakt",
  },
  en: {
    about: "about",
    workshops: "workshops",
    project: "project",
    team: "team",
    contact: "contact",
  },
};

const routeKeys = Object.keys(publicPaths.pl) as PublicRouteKey[];

export function getPublicPath(locale: Locale, route: PublicRouteKey): string {
  return publicPaths[locale][route];
}

export function getHomeSectionHref(
  locale: Locale,
  section: Exclude<PublicRouteKey, "home">,
): string {
  return `${publicPaths[locale].home}#${publicSectionIds[locale][section]}`;
}

export function getRouteKeyForPath(pathname: string): PublicRouteKey | undefined {
  const normalized = normalizePathname(pathname);
  for (const locale of locales) {
    for (const key of routeKeys) {
      if (normalizePathname(publicPaths[locale][key]) === normalized) return key;
    }
  }
  return undefined;
}

export function getLocaleForPath(pathname: string): Locale {
  return normalizePathname(pathname).startsWith("/en") ? "en" : "pl";
}

export function getEnglishRedirectPath(pathname: string): string | undefined {
  const normalized = normalizePathname(pathname);
  for (const key of routeKeys) {
    if (normalizePathname(publicPaths.pl[key]) === normalized) {
      return publicPaths.en[key];
    }
  }
  return undefined;
}

export function normalizePathname(pathname: string): string {
  if (pathname === "/") return pathname;
  return pathname.replace(/\/+$/, "");
}

export const publicContent = {
  pl: {
    site: {
      skipLink: "Przejdź do treści",
      homeAria: "Rodzynek.pl - strona główna",
      nav: {
        about: "O nas",
        workshops: "Warsztaty",
        project: "Projekt",
        team: "Zespół",
      },
      contact: "Kontakt",
      invite: "Zaproś nas",
      languageLabel: "English",
      languageAria: "Switch to English",
      theme: {
        switchToDark: "Włącz tryb ciemny",
        switchToLight: "Włącz tryb jasny",
      },
      openMenu: "Otwórz menu",
      closeMenu: "Zamknij menu",
      copyright: "© 2025 Rodzynek.pl",
      madeBy: "Made with 🤎 by jacobs ®",
    },
    hero: {
      badge: "Rówieśniczo • Profilaktyka • Młodzież",
      titleBefore: "Nie musisz przez to ",
      titleEmphasis: "przechodzić sam.",
      titleAfter: "",
      body: "Jesteśmy studentami Uniwersytetu Łódzkiego. Wierzymy, że rozmowa rówieśnika z rówieśnikiem zmienia więcej niż jakikolwiek podręcznik. Warsztaty o presji społecznej - przez młodych, dla młodych.",
      primaryCta: "Nasze warsztaty",
      secondaryCta: "Poznaj nas",
      cards: [
        ["Peer Support", "Wsparcie od rówieśnika do rówieśnika"],
        ["Bezpieczna przestrzeń", "Bez oceniania, z empatią"],
        ["Profilaktyka presji", "Praktyczne narzędzia na co dzień"],
      ],
      marquee: [
        "Asertywność",
        "Granice",
        "FOMO",
        "Empatia",
        "Zdrowie cyfrowe",
        "Samoocena",
        "Komunikacja",
        "Mediacja rówieśnicza",
        "Zaufanie",
        "Wsparcie",
      ],
    },
    about: {
      quoteTitle: "Hej, chcesz pogadać?",
      quoteBody:
        "Czasem właśnie tego pytania brakuje najbardziej. Rodzynek.pl powstał po to, żeby młodzi ludzie częściej zauważali siebie nawzajem i reagowali, kiedy ktoś zostaje sam z presją.",
      tags: ["Młodzież", "Rozmowa", "Wsparcie", "Bez presji"],
      whyLabel: "Czemu Rodzynek?",
      whyBody:
        "Rodzynkiem z początku był Iwo, bo naturalnie objął tę rolę w grupie składającej się z trzech kobiet i jego. Jednak z czasem okazało się, że każdy z nas był lub bywa Rodzynkiem. To nie tylko symbol naszej wyjątkowej współpracy i zgranej dynamiki, ale też metafora tego, co spotyka każdego z nas: bycia wykluczonym, obserwowanym z boku, czasem wydłubywanym i odsuwanym na dalszy plan jak rodzynki w cieście.",
      label: "O nas",
      titleBefore: "Jesteśmy grupą młodych ludzi - ",
      titleEmphasis: "taką samą jak Wy.",
      paragraphs: [
        "Projekt Rodzynek.pl stworzyliśmy, bo sami doświadczaliśmy presji, wykluczenia i momentów, w których brakowało nam kogoś, kto po prostu zauważy i zapyta: „Hej, chcesz pogadać?”.",
        "Teraz wiemy, jak ważne jest reagowanie na presję rówieśniczą i dbanie o siebie nawzajem, ale bardzo długo nie potrafiliśmy tego robić. Właśnie dlatego powstał Rodzynek - by zwrócić młodym uwagę na to, że powinni być dla siebie wsparciem, a nie kolejnym źródłem stresu, którego w szkolnej rzeczywistości jest już wystarczająco.",
      ],
      highlights: [
        [
          "Tacy sami jak Wy",
          "Mówimy z perspektywy młodych ludzi, którzy sami znają presję i wykluczenie.",
        ],
        [
          "Rozmowa zamiast wykładu",
          "Nie przychodzimy pouczać. Chcemy słuchać, pytać i tworzyć przestrzeń do szczerej rozmowy.",
        ],
        [
          "Wsparcie rówieśnicze",
          "Zwracamy uwagę na to, że młodzi mogą być dla siebie wsparciem, a nie kolejnym źródłem stresu.",
        ],
      ],
    },
    workshops: {
      label: "Warsztaty",
      titleBefore: "Co robimy ",
      titleEmphasis: "razem?",
      intro: {
        before: "Spotkania interaktywne, bezpieczne i dostosowane do wieku. Nie mówimy ",
        firstEmphasis: "do",
        middle: " młodzieży - rozmawiamy ",
        secondEmphasis: "z",
        after: " nią.",
      },
      availabilityNotice: "Pozostały 3 miejsca na warsztaty w nadchodzącym roku szkolnym (26-27).",
      capacityNotice:
        "Jesteśmy w stanie zrealizować maksymalnie 4 warsztaty w roku szkolnym, aby zapewnić pełne zaangażowanie oraz najwyższą jakość prowadzonych działań.",
      showMore: "Pokaż więcej",
      showLess: "Pokaż mniej",
      formatLabel: "Forma:",
      audienceLabel: "Dla kogo:",
      items: [
        {
          title: "“Masz głos” - warsztat tworzony RAZEM z młodzieżą",
          intro:
            "Nie przychodzimy z gotowymi rozwiązaniami ani narzucanymi działaniami. Dajemy narzędzia i bezpieczną przestrzeń, a młodzież mówi, co jest dla niej ważne - bo to ona najlepiej wie, czego potrzebuje.",
          body: [
            "Na warsztacie nie ma wykładów - są ćwiczenia, rozmowa i pomysły osób, które znają szkolną codzienność od środka.",
          ],
          detailsTitle: "Podczas warsztatu:",
          details: [
            "zastanowimy się, skąd bierze się presja i gdzie najczęściej pojawia się w szkolnej codzienności,",
            "wymyślimy, jak reagować na nią po swojemu, po ludzku, bez udawania,",
            "sprawdzimy, co działa w Waszej szkole, a co wymaga zmiany,",
            "zbierzemy pomysły, z których może powstać autorski scenariusz prowadzony później przez uczniów dla innych klas.",
          ],
          audience: "klasy 7-8 i 1-4 liceum",
          tags: ["60 minut"],
        },
        {
          title: "„BEZ presji” - warsztat o zjawisku presji rówieśniczej i budowaniu wspólnoty.",
          intro:
            "Gotowy scenariusz dla klas, które potrzebują konkretnych narzędzi i bezpiecznego wprowadzenia w temat.",
          detailsTitle: "Na warsztacie:",
          details: [
            "uczniowie dowiedzą się, czym jest presja rówieśnicza i skąd się bierze",
            "uczniowie przećwiczą stosowanie asertywnych komunikatów",
            "pokażemy jak ważne jest wspieranie się i stawanie w swojej obronie",
          ],
          format:
            "ćwiczenia interaktywne, praca w parach i grupach, dużo ruchu i rozmowy. Zero wykładów, zero oceniania.",
          audience:
            "klasy 3-6 szkoły podstawowej oraz klasy o niższej aktywności lub potrzebujące bardziej ustrukturyzowanych zajęć.",
          tags: ["60 minut"],
        },
      ],
    },
    project: {
      label: "Cel",
      titleBefore: "Budujemy system ",
      titleEmphasis: "wsparcia rówieśniczego.",
      paragraphs: [
        "Naszym celem jest reintegracja grup rówieśniczych i budowa systemu wsparcia rówieśniczego.",
        "Demokratyzujemy przestrzeń szkolną poprzez zajęcia profilaktyczne prowadzone przez młodzież, a nie tylko dla młodzieży. Opieramy warsztaty na ich wiedzy z doświadczenia, bo to młodzi najlepiej wiedzą, z czym mierzą się na co dzień.",
      ],
      cta: "Chcesz działać razem? Napisz do nas",
      approachLabel: "Nasze podejście",
      approach: [
        "Nie narzucamy gotowych rozwiązań - wypracowujemy je wspólnie z młodzieżą.",
        "Nie pouczamy - rozmawiamy.",
        "Nie udajemy, że wiemy wszystko - chcemy słuchać.",
      ],
      actions: [
        [
          "Reintegrujemy grupy",
          "Pomagamy klasom i grupom rówieśniczym odbudowywać kontakt, zaufanie i poczucie wspólnoty.",
        ],
        [
          "Szkolimy liderów równieśniczych",
          "Wzmacniamy osoby, które mogą później prowadzić działania rówieśnicze w swoich szkołach.",
        ],
        [
          "Tworzymy przestrzeń",
          "Budujemy miejsce, w którym młodzi nie muszą udawać i mogą mówić o tym, co naprawdę ważne.",
        ],
      ],
      whatLabel: "Co robimy?",
      whatBody:
        "Prowadzimy warsztaty, szkolimy liderów rówieśniczych i tworzymy przestrzeń, w której nie musisz udawać. Wierzymy, że prawdziwa zmiana zaczyna się od małych kroków i od ludzi, którzy są obok.",
      closing: "",
    },
    team: {
      label: "Nasz zespół",
      titleBefore: "Ludzie za ",
      titleEmphasis: "Rodzynkiem",
      intro: "",
      photoSoon: "Zdjęcie wkrótce",
      contactLead: "Chcesz działać razem?",
      contactLink: "Napisz do nas →",
      members: [
        ["Kornelia Łabieniec", "KŁ", "Trudne rzeczy łatwiej przejść z uśmiechem. Serio."],
        ["Iwo Nalbach", "IN", "Byłem obok. Widziałem. I zostałem."],
        [
          "Zuzanna Malinowska",
          "ZM",
          "Wiedziałam, że nie jestem sama. Chcę, żebyś też to wiedział.",
        ],
        ["Lena Drogosz", "LD", "Z małej iskry można zrobić pożar."],
      ],
    },
    contact: {
      label: "Kontakt",
      title: "Chcesz mieć nas u siebie?",
      intro:
        "Jesteś nauczycielem, pedagogiem, animatorem lub działasz w NGO? Napisz do nas - ustalimy szczegóły i przyjedziemy z warsztatem.",
      info: [
        ["E-mail", "rodzynekpl.kontakt@gmail.com"],
        ["Baza działań", "Łódź & okolice (i nie tylko)"],
        ["Instagram", "@rodzynekedu"],
      ],
      formAria: "Formularz kontaktowy Rodzynek.pl",
      formTitle: "Zaproś Rodzynek 🍇",
      responseTime: "Odpowiadamy w ciągu ~24 godzin.",
      fields: {
        name: ["Imię i nazwisko", "np. Anna Kowalska"],
        email: ["E-mail", "anna@szkola.edu.pl"],
        org: ["Instytucja / Organizacja", "np. SP nr 5 w Łodzi"],
        topic: "Interesuje mnie",
        timeframe: ["Preferowany termin", "np. Październik 2026, I kwartał 2027"],
        message: ["Wiadomość (opcjonalnie)", "Powiedz nam coś więcej…"],
        website: "Strona www",
      },
      options: [
        "Warsztat dla szkoły ponadpodstawowej",
        "Warsztat dla szkoły podstawowej (kl. 7-8)",
        "Inne - opisz poniżej",
      ],
      buttons: {
        submit: "Wyślij zgłoszenie",
        sending: "Wysyłam…",
        sent: "Wysłano!",
      },
      privacy:
        "Wysyłając formularz wyrażasz zgodę na przetwarzanie podanych danych (imię, e-mail, instytucja) wyłącznie w celu odpowiedzi na zgłoszenie. Dane nie są udostępniane stronom trzecim.",
      validation: {
        name: "Podaj imię i nazwisko",
        email: "Niepoprawny adres e-mail",
        org: "Podaj nazwę instytucji",
        timeframe: "Podaj preferowany termin",
        spam: "spam",
      },
      toasts: {
        invalidTitle: "Sprawdź formularz",
        invalidDescription: "Niektóre pola wymagają poprawy.",
        errorTitle: "Nie udało się wysłać",
        errorDescription: "Spróbuj ponownie za chwilę albo napisz na rodzynekpl.kontakt@gmail.com.",
        successTitle: "Wysłano!",
        successDescription: "Odezwiemy się w ciągu ~24 godzin.",
      },
    },
    ui: {
      notFoundTitle: "Nie znaleziono strony",
      notFoundBody: "Strona, której szukasz, nie istnieje albo została przeniesiona.",
      errorTitle: "Ta strona się nie załadowała",
      errorBody:
        "Coś poszło nie tak po naszej stronie. Możesz odświeżyć widok albo wrócić na stronę główną.",
      retry: "Spróbuj ponownie",
      home: "Wróć na stronę główną",
    },
  },
  en: {
    site: {
      skipLink: "Skip to content",
      homeAria: "Rodzynek.pl - home",
      nav: {
        about: "About",
        workshops: "Workshops",
        project: "Project",
        team: "Team",
      },
      contact: "Contact",
      invite: "Invite us",
      languageLabel: "Polski",
      languageAria: "Przełącz na język polski",
      theme: {
        switchToDark: "Switch to dark mode",
        switchToLight: "Switch to light mode",
      },
      openMenu: "Open menu",
      closeMenu: "Close menu",
      copyright: "© 2025 Rodzynek.pl",
      madeBy: "Made with 🤎 by jacobs ®",
    },
    hero: {
      badge: "Peer-led • Prevention • Youth",
      titleBefore: "You do not have to ",
      titleEmphasis: "face it alone.",
      titleAfter: "",
      body: "We are students from the University of Lodz. We believe that a peer-to-peer conversation can change more than any textbook. Workshops about social pressure - by young people, for young people.",
      primaryCta: "Our workshops",
      secondaryCta: "Meet us",
      cards: [
        ["Peer Support", "Support from young people to young people"],
        ["Safe space", "No judgement, with empathy"],
        ["Pressure prevention", "Practical tools for everyday situations"],
      ],
      marquee: [
        "Assertiveness",
        "Boundaries",
        "FOMO",
        "Empathy",
        "Digital wellbeing",
        "Self-esteem",
        "Communication",
        "Peer mediation",
        "Trust",
        "Support",
      ],
    },
    about: {
      quoteTitle: "Hey, want to talk?",
      quoteBody:
        "Sometimes that is the question people need most. Rodzynek.pl exists so young people notice each other more often and respond when someone is left alone with pressure.",
      tags: ["Youth", "Conversation", "Support", "No pressure"],
      whyLabel: "Why Rodzynek?",
      whyBody:
        "At first, Iwo was the Rodzynek because he naturally took that role in a group made up of three women and him. Over time, we realized each of us had been, or sometimes becomes, the Rodzynek. For us it is both a symbol of our close teamwork and a metaphor for something many people experience: being excluded, watched from the side, picked out and pushed to the background like raisins in cake.",
      label: "About us",
      titleBefore: "We are a group of young people - ",
      titleEmphasis: "just like you.",
      paragraphs: [
        'We created Rodzynek.pl because we had experienced pressure, exclusion and moments when we needed someone to simply notice us and ask: "Hey, want to talk?".',
        "Now we know how important it is to respond to peer pressure and care for each other, but for a long time we did not know how to do that. That is why Rodzynek was created: to remind young people that they can support each other instead of becoming another source of stress in a school reality that already has enough of it.",
      ],
      highlights: [
        [
          "Young people like you",
          "We speak from the perspective of young people who know pressure and exclusion first-hand.",
        ],
        [
          "Conversation, not lectures",
          "We do not come to preach. We want to listen, ask questions and create room for honest conversation.",
        ],
        [
          "Peer support",
          "We show that young people can be a source of support for each other, not another source of stress.",
        ],
      ],
    },
    workshops: {
      label: "Workshops",
      titleBefore: "What do we do ",
      titleEmphasis: "together?",
      intro: {
        before: "Interactive, safe meetings adapted to age. We do not talk ",
        firstEmphasis: "at",
        middle: " young people - we talk ",
        secondEmphasis: "with",
        after: " them.",
      },
      availabilityNotice: "Only 3 spots left for workshops in the upcoming school year (26-27).",
      capacityNotice:
        "To ensure full engagement and the highest quality of our activities, we limit ourselves to a maximum of 4 workshops per school year.",
      showMore: "Show more",
      showLess: "Show less",
      formatLabel: "Format:",
      audienceLabel: "For:",
      items: [
        {
          title: '"You have a voice" - a workshop co-created with young people',
          intro:
            "We do not arrive with ready-made answers or imposed activities. We provide tools and a safe space, while young people name what matters to them, because they know best what they need.",
          body: [
            "There are no lectures here: there are exercises, conversation and ideas from students who know school reality from the inside.",
          ],
          detailsTitle: "During the workshop:",
          details: [
            "we explore where pressure comes from and where it appears most often in everyday school life,",
            "we create ways to respond to it in a natural, human way, without pretending,",
            "we check what works in your school and what needs to change,",
            "we collect ideas that can become an original scenario later led by students for other classes.",
          ],
          audience: "grades 7-8 and secondary school students",
          tags: ["60 minutes"],
        },
        {
          title: '"No pressure" - a workshop on peer pressure and building community.',
          intro:
            "A ready-to-use scenario for classes that need concrete tools and a safe introduction to the topic.",
          detailsTitle: "During the workshop:",
          details: [
            "students learn what peer pressure is and where it comes from",
            "students practise using assertive messages",
            "we show why supporting each other and standing up for yourself matters",
          ],
          format:
            "interactive exercises, pair and group work, movement and conversation. No lectures, no judging.",
          audience:
            "grades 3-6 of primary school, and classes with lower activity or a need for more structured activities.",
          tags: ["60 minutes"],
        },
      ],
    },
    project: {
      label: "Goal",
      titleBefore: "We are building a ",
      titleEmphasis: "peer support system.",
      paragraphs: [
        "Our goal is to reintegrate peer groups and build a peer support system.",
        "We democratize school space through preventive activities led by young people, not only for young people. Our workshops are grounded in their lived experience, because young people know best what they face every day.",
      ],
      cta: "Want to work together? Contact us",
      approachLabel: "Our approach",
      approach: [
        "We do not impose ready-made answers - we work them out together with young people.",
        "We do not preach - we talk.",
        "We do not pretend to know everything - we want to listen.",
      ],
      actions: [
        [
          "We reconnect groups",
          "We help classes and peer groups rebuild contact, trust and a sense of community.",
        ],
        [
          "We train peer leaders",
          "We strengthen people who can later lead peer activities in their own schools.",
        ],
        [
          "We create space",
          "We build a place where young people do not have to pretend and can talk about what really matters.",
        ],
      ],
      whatLabel: "What do we do?",
      whatBody:
        "We run workshops, train peer leaders and create space where you do not have to pretend. We believe real change starts with small steps and with people who are nearby.",
      closing: "",
    },
    team: {
      label: "Our team",
      titleBefore: "The people behind ",
      titleEmphasis: "Rodzynek",
      intro: "",
      photoSoon: "Photo soon",
      contactLead: "Want to work together?",
      contactLink: "Contact us →",
      members: [
        ["Kornelia Łabieniec", "KŁ", "Hard things are easier to get through with a smile. Really."],
        ["Iwo Nalbach", "IN", "I was nearby. I saw it. And I stayed."],
        ["Zuzanna Malinowska", "ZM", "I knew I was not alone. I want you to know that too."],
        ["Lena Drogosz", "LD", "A small spark can start a fire."],
      ],
    },
    contact: {
      label: "Contact",
      title: "Would you like us to visit?",
      intro:
        "Are you a teacher, school counselor, youth worker or NGO organizer? Write to us - we will agree the details and come with a workshop.",
      info: [
        ["E-mail", "rodzynekpl.kontakt@gmail.com"],
        ["Base", "Lodz and nearby areas, plus selected other locations"],
        ["Instagram", "@rodzynekedu"],
      ],
      formAria: "Rodzynek.pl contact form",
      formTitle: "Invite Rodzynek 🍇",
      responseTime: "We usually reply within ~24 hours.",
      fields: {
        name: ["Full name", "e.g. Anna Kowalska"],
        email: ["E-mail", "anna@school.edu"],
        org: ["Institution / Organization", "e.g. Primary School No. 5"],
        topic: "I am interested in",
        timeframe: ["Preferred timeframe", "e.g., October 2026, Q1 2027"],
        message: ["Message (optional)", "Tell us a bit more..."],
        website: "Website",
      },
      options: [
        "Workshop for secondary school",
        "Workshop for primary school (grades 7-8)",
        "Other - describe below",
      ],
      buttons: {
        submit: "Send request",
        sending: "Sending...",
        sent: "Sent!",
      },
      privacy:
        "By submitting this form, you consent to the processing of the provided data (name, e-mail, institution) only so we can respond to your request. The data is not shared with third parties.",
      validation: {
        name: "Enter your full name",
        email: "Enter a valid e-mail address",
        org: "Enter the institution name",
        timeframe: "Enter preferred timeframe",
        spam: "spam",
      },
      toasts: {
        invalidTitle: "Check the form",
        invalidDescription: "Some fields need correction.",
        errorTitle: "Could not send",
        errorDescription: "Please try again in a moment or write to rodzynekpl.kontakt@gmail.com.",
        successTitle: "Sent!",
        successDescription: "We will reply within ~24 hours.",
      },
    },
    ui: {
      notFoundTitle: "Page not found",
      notFoundBody: "The page you are looking for does not exist or has moved.",
      errorTitle: "This page did not load",
      errorBody:
        "Something went wrong on our side. You can refresh the page or go back to the homepage.",
      retry: "Try again",
      home: "Back to homepage",
    },
  },
} as const;

export const publicSeo: Record<
  Locale,
  Record<
    PublicRouteKey,
    { title: string; description: string; ogTitle: string; ogDescription: string }
  >
> = {
  pl: {
    home: {
      title: "Rodzynek.pl - rówieśnicze warsztaty o presji rówieśniczej",
      description:
        "Studencka inicjatywa z UŁ. Bezpłatne warsztaty o presji społecznej, asertywności i granicach - dla młodzieży, prowadzone przez młodych ludzi.",
      ogTitle: "Rodzynek.pl - rówieśnicze warsztaty dla młodzieży",
      ogDescription:
        "Rozmowa rówieśnika z rówieśnikiem zmienia więcej niż wykład. Zaproś nas do swojej szkoły lub organizacji.",
    },
    about: {
      title: "O nas - Rodzynek.pl",
      description:
        "Poznaj Rodzynek.pl - młodych ludzi, którzy tworzą wsparcie rówieśnicze i reagują na presję oraz wykluczenie.",
      ogTitle: "O nas - Rodzynek.pl",
      ogDescription:
        "Kim jesteśmy, dlaczego powstał Rodzynek.pl i czemu wierzymy w rozmowę zamiast pouczania.",
    },
    workshops: {
      title: "Warsztaty - Rodzynek.pl",
      description:
        "Bezpłatne warsztaty rówieśnicze o presji rówieśniczej, asertywności i zdrowiu cyfrowym dla szkół i organizacji młodzieżowych.",
      ogTitle: "Warsztaty Rodzynek.pl dla szkół i NGO",
      ogDescription:
        "Trzy interaktywne warsztaty: presja społeczna, asertywność, presja w sieci. 90-120 min, prowadzą studenci UŁ.",
    },
    project: {
      title: "Projekt - Rodzynek.pl",
      description:
        "Cel Rodzynek.pl: reintegracja grup rówieśniczych, wsparcie rówieśnicze i warsztaty tworzone z młodzieżą.",
      ogTitle: "Projekt - Rodzynek.pl",
      ogDescription:
        "Zobacz, jak Rodzynek.pl buduje system wsparcia rówieśniczego i przestrzeń do rozmowy bez presji.",
    },
    team: {
      title: "Zespół - Rodzynek.pl",
      description:
        "Studenci, mentorzy rówieśniczy i badaczki tworzące inicjatywę Rodzynek.pl na Uniwersytecie Łódzkim.",
      ogTitle: "Zespół Rodzynek.pl",
      ogDescription: "Ludzie za Rodzynkiem - studenci UŁ działający w profilaktyce rówieśniczej.",
    },
    contact: {
      title: "Kontakt - Zaproś Rodzynek.pl do swojej szkoły",
      description:
        "Napisz do nas - ustalimy szczegóły i przyjedziemy z bezpłatnym warsztatem do Twojej szkoły lub organizacji.",
      ogTitle: "Zaproś Rodzynek.pl - kontakt",
      ogDescription: "Formularz dla nauczycieli, pedagogów i NGO. Odpowiadamy w ~24 godziny.",
    },
  },
  en: {
    home: {
      title: "Rodzynek.pl - peer-led workshops on peer pressure",
      description:
        "A student initiative from the University of Lodz. Free workshops about social pressure, assertiveness and boundaries, led by young people for young people.",
      ogTitle: "Rodzynek.pl - peer-led workshops for young people",
      ogDescription:
        "A peer-to-peer conversation can change more than a lecture. Invite us to your school or organization.",
    },
    about: {
      title: "About - Rodzynek.pl",
      description:
        "Meet Rodzynek.pl: young people building peer support and responding to pressure and exclusion.",
      ogTitle: "About Rodzynek.pl",
      ogDescription:
        "Who we are, why Rodzynek.pl was created and why we believe in conversation instead of preaching.",
    },
    workshops: {
      title: "Workshops - Rodzynek.pl",
      description:
        "Free peer-led workshops on peer pressure, assertiveness and digital wellbeing for schools and youth organizations.",
      ogTitle: "Rodzynek.pl workshops for schools and NGOs",
      ogDescription:
        "Interactive workshops on social pressure, assertiveness and community. Led by University of Lodz students.",
    },
    project: {
      title: "Project - Rodzynek.pl",
      description:
        "Rodzynek.pl works to reintegrate peer groups, build peer support and create workshops with young people.",
      ogTitle: "Project - Rodzynek.pl",
      ogDescription:
        "See how Rodzynek.pl builds peer support and creates room for honest conversation without pressure.",
    },
    team: {
      title: "Team - Rodzynek.pl",
      description:
        "Students, peer mentors and researchers creating the Rodzynek.pl initiative at the University of Lodz.",
      ogTitle: "Rodzynek.pl team",
      ogDescription:
        "The people behind Rodzynek: University of Lodz students working in peer prevention.",
    },
    contact: {
      title: "Contact - Invite Rodzynek.pl to your school",
      description:
        "Write to us and we will arrange a free workshop for your school or organization.",
      ogTitle: "Invite Rodzynek.pl - contact",
      ogDescription: "A form for teachers, school counselors and NGOs. We reply within ~24 hours.",
    },
  },
};

const localeMeta: Record<Locale, string> = {
  pl: "pl_PL",
  en: "en_US",
};

export function getPublicHead(locale: Locale, route: PublicRouteKey) {
  const seo = publicSeo[locale][route];
  const canonicalPath = publicPaths[locale][route];

  return {
    meta: [
      { title: seo.title },
      { name: "description", content: seo.description },
      { property: "og:title", content: seo.ogTitle },
      { property: "og:description", content: seo.ogDescription },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: localeMeta[locale] },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: `https://rodzynek.pl${canonicalPath}` },
      { rel: "alternate", hrefLang: "pl", href: `https://rodzynek.pl${publicPaths.pl[route]}` },
      { rel: "alternate", hrefLang: "en", href: `https://rodzynek.pl${publicPaths.en[route]}` },
      {
        rel: "alternate",
        hrefLang: "x-default",
        href: `https://rodzynek.pl${publicPaths.pl[route]}`,
      },
    ],
  };
}
