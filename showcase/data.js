// All example content of the showcase in one object, apart from the layout code.
// Fictional case, fictional persons, prepared texts. No model is called.
// Law text is NOT written here: it comes from laws.js (converter output).
// Tokens in texts: {EE} employee, {BM} mayor, {GE} municipality.
// They are shown as real name (red) or false name (blue) depending on the view.
window.EXAMPLE = {
  names: {
    EE: { role: "Mandantin (Vertragsbedienstete)", real: "Julia Brandstetter", fake: "Sabine Lechner" },
    BM: { role: "Bürgermeister (Vertreter des Dienstgebers)", real: "Ferdinand Egger", fake: "Walter Gruber" },
    GE: { role: "Dienstgeber (Gemeinde)", real: "Gemeinde Wiesenbrunn-Tal", fake: "Gemeinde Tannenau" }
  },

  caseTitle: "Urlaubsverfall und Ersatzleistung bei Kündigung",

  form: [
    // [label, value, sent?]  sent: "yes" | "no" | "false-names" (value contains a name)
    ["Mandantin", "{EE}", "no"],
    ["Anschrift der Mandantin", "Bergweg 7, 6999 Wiesenbrunn-Tal", "no"],
    ["Aktenzahl der Kanzlei", "GZ 26/0412", "no"],
    ["Dienstgeber", "{GE}", "no"],
    ["Vertreter des Dienstgebers", "Bürgermeister {BM}", "no"],
    ["Anschrift des Dienstgebers", "Dorfplatz 1, 6999 Wiesenbrunn-Tal", "no"],
    ["Geschlecht", "weiblich", "yes"],
    ["Geburtsdatum", "14.03.1980", "yes"],
    ["Beginn des Dienstverhältnisses", "01.09.2014", "yes"],
    ["Ende des Dienstverhältnisses", "31.10.2026", "yes"],
    ["Art der Beendigung", "Kündigung durch den Dienstgeber (ausgesprochen am 30.06.2026)", "yes"],
    ["Beschäftigungsausmaß", "Vollzeit", "yes"],
    ["Dienstgeber ist", "Gemeinde in Tirol (nicht Innsbruck), privatrechtliches Dienstverhältnis", "yes"]
  ],

  freeText:
    "{EE}, geboren am 14.03.1980, ist seit 01.09.2014 Vertragsbedienstete der {GE}. " +
    "Die Gemeinde hat das Dienstverhältnis mit Schreiben vom 30.06.2026 gekündigt; es endete am 31.10.2026. " +
    "Vom Urlaub 2024 (240 Stunden) hat sie 120 Stunden verbraucht, vom Urlaub 2025 (240 Stunden) 200 Stunden. " +
    "Bürgermeister {BM} meint, der Urlaub aus 2024 sei Ende 2025 verfallen. " +
    "Ein schriftlicher Hinweis der Gemeinde, den Urlaub zu verbrauchen, ist nicht bekannt. " +
    "{EE} verlangt die Auszahlung.",

  instructions:
    "Schreiben an Bürgermeister {BM}, sachlich, Ersatzleistung fordern, Zahlungsfrist bis 30.11.2026 setzen.",

  // Screen 2
  derived: [
    ["Dienstzeit", "12 Jahre, 2 Monate", "01.09.2014 bis 31.10.2026"],
    ["Alter am Stichtag", "46 Jahre", "Stichtag = Ende des Dienstverhältnisses, 31.10.2026"],
    ["43. Lebensjahr vollendet", "im Jahr 2023", "Geburtsdatum 14.03.1980 plus 43 Jahre"],
    ["Urlaubsjahre im Streit", "2024, 2025, 2026", "Urlaubsjahr = Kalenderjahr"],
    ["Gesetz muss gültig sein für", "01.01.2024 bis 31.10.2026", "frühestes Urlaubsjahr bis Stichtag"]
  ],

  // Screen 3
  regime: {
    rule: [
      ["Dienstgeber ist eine Gemeinde in Tirol, nicht Innsbruck", "ja"],
      ["Privatrechtliches Dienstverhältnis (Vertragsbedienstete)", "ja"],
      ["Beschäftigt in land- und forstwirtschaftlichem Betrieb", "nein"]
    ],
    result: "Gemeinde-Vertragsbedienstetengesetz 2012 (G-VBG 2012), Tirol, Rechtsnummer 20000488",
    basis: "§ 1"
  },

  // Screen 5
  issues: [
    ["Verfall des Urlaubs 2024 zum 31.12.2025", "Erholungsurlaub Verfall; Urlaubsjahr; folgendes Kalenderjahr"],
    ["Pflicht des Dienstgebers, auf den Urlaubsverbrauch hinzuwirken", "hinwirken; rechtzeitig; unmissverständlich"],
    ["Ersatzleistung für nicht verbrauchten Urlaub aus Vorjahren", "Ersatzleistung; Beendigung des Dienstverhältnisses"],
    ["Aliquote Ersatzleistung für 2026", "aliquot; Dienstzeit im Kalenderjahr; Monatsentgelt"],
    ["Verjährung und schriftliche Geltendmachung", "Verjährung; Geltendmachung; Unterbrechung"],
    ["Urlaubsausmaß ab dem 43. Lebensjahr", "Urlaubsausmaß; Lebensjahr; Dienststunden"]
  ],
  task5: "Aufgabe: Nenne die Rechtsfragen dieses Falls und zu jeder Suchbegriffe für die Suche im Gesetzestext.",

  // Screen 6: [label in laws.js, why found, how]
  hits: [
    ["§ 79", "Verfall, Hinwirken", "Suchbegriff"],
    ["§ 81", "Ersatzleistung, Beendigung", "Suchbegriff"],
    ["§ 74", "Urlaubsausmaß, Lebensjahr", "Suchbegriff"],
    ["§ 69", "Verjährung, Geltendmachung", "Suchbegriff"],
    ["§ 73", "Erholungsurlaub, Urlaubsjahr", "Suchbegriff"],
    ["§ 76", "Verbrauch des Erholungsurlaubes", "Suchbegriff"],
    ["§ 92a", "Verweis aus § 74 Abs. 3", "Verweis"],
    ["§ 32b", "Verweis aus § 81 Abs. 7", "Verweis"]
  ],
  // Screen 7
  removed: { "§ 76": "Betrifft die Vereinbarung über den Urlaubsantritt, nicht den Streit.", "§ 92a": "Sabbatical, ohne Bezug zum Fall.", "§ 32b": "Wiedereingliederungsteilzeit, ohne Bezug zum Fall." },
  kept: ["§ 69", "§ 73", "§ 74", "§ 79", "§ 81"],

  task8: "Aufgabe: Schreibe den Entwurf eines Schreibens an den Dienstgeber. Jede rechtliche Aussage als eigene Aussage mit Fundstelle und wörtlichem Zitat. Anschrift und Aktenzahl als Platzhalter lassen.",

  // Screens 8, 9, 12. Segments: text, or a statement.
  // verdict: ok | partial | none | apply. quote = literal quote from the cited provision.
  draft: [
    { t: "[Anschrift des Dienstgebers]\n\nBetreff: Ersatzleistung für nicht verbrauchten Erholungsurlaub – {EE}\n[Aktenzahl]\n\nSehr geehrter Herr Bürgermeister {BM},\n\nich vertrete {EE}, deren Dienstverhältnis zur {GE} mit 31. Oktober 2026 geendet hat. Zum nicht verbrauchten Erholungsurlaub halte ich Folgendes fest:\n\n" },
    { s: "S1", verdict: "ok", cite: "§ 74", abs: "Abs. 1 lit. b",
      text: "{EE} hat seit der Vollendung des 43. Lebensjahres Anspruch auf 240 Dienststunden Erholungsurlaub je Kalenderjahr (§ 74 Abs. 1 lit. b G-VBG 2012).",
      quote: "ab dem vollendeten 43. Lebensjahr 240 Dienststunden",
      note: "Zitat im Datensatz gefunden. Alter und Dienststunden stimmen mit den abgeleiteten Daten überein." },
    { t: " " },
    { s: "S2", verdict: "ok", cite: "§ 79", abs: "Abs. 1",
      text: "Der Urlaubsanspruch für 2024 wäre nach § 79 Abs. 1 G-VBG 2012 grundsätzlich mit Ablauf des 31. Dezember 2025 verfallen.",
      quote: "nicht bis zum 31. Dezember des dem Urlaubsjahr folgenden Kalenderjahres verbraucht hat",
      note: "Das Gesetz knüpft den Verfall an den 31. Dezember des Folgejahres; für 2024 ist das der 31.12.2025." },
    { t: "\n\n" },
    { s: "S3", verdict: "apply", cite: "§ 79", abs: "Abs. 4",
      text: "Da die Gemeinde es unterlassen hat, {EE} rechtzeitig und unmissverständlich auf den Verbrauch des Urlaubs hinzuweisen, ist der Verfall nach § 79 Abs. 4 G-VBG 2012 nicht eingetreten.",
      quote: "Der Verfall des Erholungsurlaubes tritt nicht ein, wenn es der Dienstgeber unterlassen hat, rechtzeitig und unmissverständlich auf die Inanspruchnahme des Erholungsurlaubes durch den Vertragsbediensteten hinzuwirken.",
      note: "Die Regel ist belegt. Ob die Gemeinde tatsächlich nichts unternommen hat, ist eine Tatsache aus dem Sachverhalt („nicht bekannt“) und muss vom Anwalt geprüft werden." },
    { t: "\n\n" },
    { s: "S4", verdict: "ok", cite: "§ 81", abs: "Abs. 5",
      text: "Für nicht verbrauchten Erholungsurlaub aus vorangegangenen Kalenderjahren gebührt bei Beendigung eine Ersatzleistung; für bereits verfallenen Urlaub gebührt keine (§ 81 Abs. 5 G-VBG 2012).",
      quote: "Für bereits verfallenen Erholungsurlaub gebührt keine Ersatzleistung.",
      note: "Beide Hälften der Aussage stehen in § 81 Abs. 5." },
    { t: " " },
    { s: "S5", verdict: "partial", cite: "§ 81", abs: "Abs. 5",
      text: "Die Ersatzleistung für 2024 und 2025 bemisst sich nach Monatsentgelt, Kinderzulage und anteiligen Sonderzahlungen (§ 81 Abs. 5 G-VBG 2012).",
      quote: "in der Höhe des Monatsentgeltes und der Kinderzulage",
      note: "Eingebaut als Beispiel. Monatsentgelt und Kinderzulage stehen in Abs. 5. Sonderzahlungen werden nur in Abs. 2 lit. b genannt, und dort für das laufende Kalenderjahr, nicht für Vorjahre." },
    { t: "\n\n" },
    { s: "S6", verdict: "ok", cite: "§ 81", abs: "Abs. 1",
      text: "Für das Jahr 2026 gebührt eine Ersatzleistung im Verhältnis der Dienstzeit zum gesamten Kalenderjahr; bereits verbrauchter Urlaub dieses Jahres wird angerechnet (§ 81 Abs. 1 G-VBG 2012).",
      quote: "Bereits verbrauchter Erholungsurlaub dieses Kalenderjahres ist auf das aliquote Urlaubsausmaß anzurechnen.",
      note: "Zitat im Datensatz gefunden; die Aussage gibt Abs. 1 richtig wieder." },
    { t: " " },
    { s: "S7", verdict: "none", cite: "§ 81", abs: "Abs. 1",
      text: "Die Gemeinde ist verpflichtet, die Ersatzleistung binnen 14 Tagen nach dem Ende des Dienstverhältnisses auszuzahlen (§ 81 Abs. 1 G-VBG 2012).",
      quote: "",
      note: "Eingebaut als Beispiel. Eine Frist von 14 Tagen steht weder in § 81 Abs. 1 noch sonst in den gewählten Fundstellen. Die Aussage hat kein Zitat und wäre ohne Prüfung im Schreiben geblieben." },
    { t: "\n\n" },
    { s: "S8", verdict: "ok", cite: "§ 69", abs: "Abs. 4",
      text: "Mit diesem Schreiben macht {EE} ihren Anspruch schriftlich geltend; die schriftliche Geltendmachung unterbricht die Verjährung (§ 69 Abs. 4 G-VBG 2012).",
      quote: "die schriftliche Geltendmachung eines noch nicht verjährten Anspruches durch den Vertragsbediensteten gegenüber dem Dienstgeber die Verjährung unterbricht",
      note: "Zitat im Datensatz gefunden." },
    { t: "\n\nIch ersuche um Überweisung der Ersatzleistung bis zum 30. November 2026.\n\nMit freundlichen Grüßen\n[Unterschrift des Rechtsanwalts]" }
  ],

  // Screen 11
  notUsed: {
    provisions: [
      ["§ 76", "G-VBG 2012", "gefunden, vom Anwalt entfernt: betrifft die Vereinbarung über den Urlaubsantritt"],
      ["§ 92a", "G-VBG 2012", "per Verweis gefunden, vom Anwalt entfernt: Sabbatical"],
      ["§ 32b", "G-VBG 2012", "per Verweis gefunden, vom Anwalt entfernt: Wiedereingliederungsteilzeit"]
    ],
    outside: [
      ["Mutterschutzgesetz 1979 (Rechtsnummer 10008464)", "Verweis aus § 79 Abs. 2, 3 und § 81 Abs. 6. Nicht in der Sammlung. Der Entwurf stützt sich nicht darauf, der Anwalt sollte prüfen, ob der Fall sie berührt."],
      ["Tiroler Eltern-Karenzurlaubsgesetz 2005 (20000254)", "Verweis aus § 79 Abs. 3. In der Sammlung, aber nicht gewählt."],
      ["Landesbeamtengesetz 1998 (20000225)", "Verweis aus § 74 Abs. 3. In der Sammlung, aber nicht gewählt."]
    ],
    noHit: [
      ["Was bedeutet „rechtzeitig und unmissverständlich“ hinwirken (§ 79 Abs. 4)?", "Das Gesetz sagt es nicht näher. Die Antwort steht in der Rechtsprechung, und die ist noch nicht in der Sammlung. Der Anwalt muss sie aus anderen Quellen prüfen."]
    ]
  },

  // Screen 13
  summary: [
    ["0–3", "Eingabe, Ableitungen, Rechtsregime", "nichts", "nichts, rein lokal"],
    ["4", "Falsche Namen", "nichts", "Zuordnungstabelle bleibt lokal"],
    ["5", "Rechtsfragen", "Freitext mit falschen Namen, Fakten ohne Namen und Adressen, Rechtsregime", "an Mistral"],
    ["6–7", "Suche, Fundstellen", "nichts", "nichts, rein lokal"],
    ["8", "Entwurf", "wie 5, dazu bestätigte Rechtsfragen, Anweisungen mit falschen Namen, öffentlicher Gesetzestext", "an Mistral"],
    ["9", "Prüfung 1, Teil 2", "jede Aussage mit falschen Namen und der zitierte Gesetzestext", "an Mistral"],
    ["9", "Prüfung 1, Teil 1", "nichts", "Programm, lokal"],
    ["10–11", "Quellenverzeichnis, Nicht berücksichtigt", "nichts", "rein lokal"],
    ["12", "Echte Namen einsetzen", "nichts", "rein lokal"]
  ],
  neverSent: [
    "echte Namen", "Anschriften", "Telefonnummern", "Aktenzahlen", "Bank- und Versicherungsnummern",
    "die Zuordnungstabelle", "das fertige Schreiben", "Protokolle (Logs)", "die Mandantenliste links und ihre Suche"
  ],

  // Left navigation: earlier cases. Fictional. Never part of any request.
  pastCases: [
    { id: "c0", client: "{EE}", tags: ["G-VBG 2012"], date: "14.11.2026", current: true },
    { id: "c1", client: "Hofer, Maximilian", tags: ["G-VBG 2012"], date: "03.11.2026" },
    { id: "c2", client: "Pfurtscheller KG", tags: ["AZG", "ARG"], date: "29.10.2026" },
    { id: "c3", client: "Moser, Katharina", tags: ["UrlG"], date: "21.10.2026" },
    { id: "c4", client: "Gemeindeverband Oberes Tal", tags: ["G-VBG 2012", "TMSchG 2005"], date: "12.10.2026" },
    { id: "c5", client: "Außerlechner, Thomas", tags: ["AZG"], date: "30.09.2026" },
    { id: "c6", client: "Kofler & Söhne GmbH", tags: ["ARG", "AZG", "UrlG"], date: "17.09.2026" },
    { id: "c7", client: "Mair, Elisabeth", tags: ["TMSchG 2005"], date: "04.09.2026" },
    { id: "c8", client: "Praxis Dr. Steinlechner", tags: ["UrlG", "AZG"], date: "26.08.2026" },
    { id: "c9", client: "Wallner, Josef", tags: ["LBG 1998"], date: "11.08.2026" },
    { id: "c10", client: "Gasthof Zum Adler", tags: ["ARG", "UrlG"], date: "29.07.2026" },
    { id: "c11", client: "Schneider, Anna-Lena", tags: ["G-VBG 2012", "UrlG"], date: "15.07.2026" },
    { id: "c12", client: "Tischlerei Haider", tags: ["AZG"], date: "02.07.2026" },
    { id: "c13", client: "Rainer, Stefan", tags: ["LBG 1998", "G-VBG 2012"], date: "19.06.2026" }
  ],

  // Step texts. send: true = data leaves the server to Mistral.
  // where: node(s) active in the diagram. hop: highlighted connection.
  steps: [
    { id: 0, name: "Start", send: false, nodes: [], hop: null,
      what: "Diese Seite zeigt, wie der Entwurfsassistent aussehen und arbeiten soll. Es ist eine Vorführung mit einem erfundenen Fall. Du klickst mit „Weiter“ und „Zurück“ durch die Schritte; nichts davon ist ein laufendes Programm.",
      data: "Nur der erfundene Beispielfall. Es wurde nichts berechnet und kein Modell befragt; alle Texte sind vorbereitet.",
      flow: "Beim Anzeigen dieser Seite und beim Klicken wird nichts gesendet, auch nicht an Mistral. Die Seite lädt keine Schriften, Skripte oder Bilder von außen." },
    { id: 1, name: "Eingabe", send: false, nodes: ["browser", "server"], hop: "bs",
      what: "Die Anwältin oder der Anwalt trägt Personen, Daten und Dienstverhältnis in das Formular ein und beschreibt den Fall im Freitext. Hier ist alles ausgefüllt und gesperrt.",
      data: "Das Formular mit Namen, Anschriften und Aktenzahl sowie der Freitext und die Anweisung an das Schreiben. Rechts neben jedem Feld steht, ob der Wert später an Mistral geht.",
      flow: "Die Eingaben gehen vom Browser zum gopfi-Server, der in der Kanzlei steht. Nichts geht an Mistral oder anderswohin." },
    { id: 2, name: "Abgeleitete Daten", send: false, nodes: ["server"], hop: null,
      what: "Ein Programm auf dem gopfi-Server rechnet aus den Formularfeldern Dienstzeit, Alter am Stichtag und den Zeitraum, für den das Gesetz gültig sein muss. Das Modell ist nicht beteiligt.",
      data: "Gelesen: Geburtsdatum, Beginn und Ende des Dienstverhältnisses. Erzeugt: die Werte unten.",
      flow: "Alles bleibt auf dem gopfi-Server. Es wird nichts gesendet." },
    { id: 3, name: "Anwendbares Recht", send: false, nodes: ["server"], hop: null,
      what: "Ein Programm wählt anhand der Formularfelder über eine feste Regeltabelle das anwendbare Gesetz. Es wird nicht geraten, und das Modell ist nicht beteiligt.",
      data: "Gelesen: Art des Dienstgebers und des Dienstverhältnisses. Erzeugt: das Regime. Der Text von § 1 stammt aus der Gesetzessammlung.",
      flow: "Alles bleibt auf dem gopfi-Server. Das Gesetz wurde vorher und unabhängig von jedem Fall aus dem RIS geladen; für diesen Fall wird das RIS nicht kontaktiert." },
    { id: 4, name: "Falsche Namen", send: false, nodes: ["server", "browser"], hop: "bs",
      what: "Ein lokales Programm ersetzt jeden Namen aus dem Formular, auch im Freitext und in der Anweisung, durch einen falschen Namen aus einer festen Liste. Die Anwältin oder der Anwalt sieht den genauen Text, der später gesendet wird, und bestätigt ihn.",
      data: "Gelesen: Formular, Freitext, Anweisung. Erzeugt: die Zuordnungstabelle (echt, falsch) und der Text mit falschen Namen.",
      flow: "Noch nichts verlässt den Server. Die Zuordnungstabelle bleibt für immer lokal und wird in keinem Schritt gesendet." },
    { id: 5, name: "Rechtsfragen", send: true, nodes: ["server", "mistral"], hop: "sm",
      what: "Das Modell liest den Fall und listet die Rechtsfragen mit Suchbegriffen. Die Anwältin oder der Anwalt bestätigt oder ändert die Liste.",
      data: "Gelesen: Freitext mit falschen Namen, Fakten, Rechtsregime. Erzeugt: Liste der Rechtsfragen und Suchbegriffe.",
      flow: "Der gopfi-Server sendet an Mistral genau den Text im Kasten „Genau das wird gesendet“. Keine echten Namen, keine Anschriften, keine Aktenzahlen. Nicht geschützt: der Sachverhalt selbst, Datumsangaben, Alter, Geschlecht und Dienstzeit gehen unverändert mit. Falsche Namen machen den Fall pseudonym, nicht anonym." },
    { id: 6, name: "Suche", send: false, nodes: ["server"], hop: null,
      what: "Ein Programm sucht mit den bestätigten Suchbegriffen in der lokalen Gesetzessammlung und folgt den Verweisen zwischen Bestimmungen.",
      data: "Gelesen: bestätigte Rechtsfragen und Suchbegriffe, die Gesetzessammlung. Erzeugt: Trefferliste.",
      flow: "Alles bleibt auf dem gopfi-Server, auch die Suche über Bedeutung (Vektoren). Das setzt voraus, dass das dafür nötige Modell lokal läuft. Das ist eine Bedingung des Plans." },
    { id: 7, name: "Fundstellen prüfen", send: false, nodes: ["browser", "server"], hop: "bs",
      what: "Die Anwältin oder der Anwalt entfernt Treffer, die nicht passen, und ergänzt fehlende Bestimmungen.",
      data: "Gelesen: die Trefferliste. Erzeugt: die Auswahl der Fundstellen, die der Entwurf verwenden darf.",
      flow: "Die Auswahl geht vom Browser zum gopfi-Server und nicht weiter." },
    { id: 8, name: "Entwurf", send: true, nodes: ["server", "mistral"], hop: "sm",
      what: "Das Modell schreibt den Entwurf des Schreibens als Aussagen. Jede rechtliche Aussage nennt ihre Fundstelle und zitiert sie wörtlich.",
      data: "Gelesen: wie in Schritt 5, dazu die bestätigten Rechtsfragen, die Anweisung und der Wortlaut der gewählten Bestimmungen. Erzeugt: der Entwurf mit Platzhaltern für Anschrift und Aktenzahl.",
      flow: "An Mistral geht genau der Text im Kasten „Genau das wird gesendet“: Schritt 5, die bestätigten Rechtsfragen, die Anweisung mit falschen Namen und der Gesetzestext, der öffentlich ist. Vor dem Senden sieht die Anwältin oder der Anwalt diese Vorschau." },
    { id: 9, name: "Prüfung 1", send: true, mixed: true, nodes: ["server", "mistral"], hop: "sm",
      what: "Teil 1 macht ein Programm: Es sucht jedes Zitat im Datensatz und vergleicht Fassungen, Daten, Beträge und Dateiprüfsummen. Teil 2 macht das Modell: Es liest je eine Aussage und den Gesetzestext, den sie zitiert, und urteilt, ob der Text die Aussage trägt.",
      data: "Gelesen: der Entwurf und die Datensätze der Fundstellen. Erzeugt: je Aussage ein Urteil: belegt, teilweise belegt, nicht belegt oder Anwendung auf den Fall.",
      flow: "Teil 1: nichts wird gesendet. Teil 2: an Mistral geht je Aussage genau dieser Text: die Aussage mit falschen Namen und der Gesetzestext, den sie zitiert. Sonst nichts." },
    { id: 10, name: "Prüfung 2", send: false, nodes: ["server"], hop: null,
      what: "Ein Programm baut das Quellenverzeichnis: zu jeder verwendeten Bestimmung Fundstelle, Datensatz, Stand und Prüfsumme der Quelldatei.",
      data: "Gelesen: die Datensätze der verwendeten Bestimmungen. Erzeugt: das Verzeichnis.",
      flow: "Alles bleibt auf dem gopfi-Server. Die Quelladressen sind nur Angaben im Verzeichnis; es wird nichts abgerufen." },
    { id: 11, name: "Nicht berücksichtigt", send: false, nodes: ["server"], hop: null,
      what: "Ein Programm listet, was nicht in den Entwurf kam: nicht verwendete Bestimmungen, Verweise auf Gesetze außerhalb der Sammlung und Rechtsfragen ohne Fundstelle.",
      data: "Gelesen: Trefferliste, Auswahl, Verweise der Datensätze, Rechtsfragen. Erzeugt: die Liste unten.",
      flow: "Alles bleibt auf dem gopfi-Server. Es wird nichts gesendet." },
    { id: 12, name: "Echte Namen einsetzen", send: false, nodes: ["server"], hop: null,
      what: "Ein lokales Skript ersetzt jeden falschen Namen durch den echten und prüft, dass kein falscher Name übrig ist. Anschrift und Aktenzahl werden aus dem Formular eingesetzt. Stimmen die Zahlen nicht, bricht das Skript mit einem Fehler ab.",
      data: "Gelesen: der geprüfte Entwurf, die Zuordnungstabelle, das Formular. Erzeugt: das fertige Schreiben mit echten Namen.",
      flow: "Alles bleibt auf dem gopfi-Server. Das fertige Schreiben und die Zuordnungstabelle werden nie gesendet." },
    { id: 13, name: "Zusammenfassung", send: false, nodes: ["browser", "server", "mistral"], hop: null,
      what: "Alle Schritte in einer Tabelle: was gesendet wurde, an wen, und was nie den Server verlassen hat.",
      data: "Nur die Übersicht aus den vorigen Schritten.",
      flow: "An Mistral gingen genau drei Anfragen-Arten (Schritte 5, 8, 9 Teil 2). An niemand sonst. Das RIS erhält nie Falldaten." }
  ]
};
