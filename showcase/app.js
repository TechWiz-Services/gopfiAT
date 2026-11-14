// Layout and behaviour of the showcase. All content comes from data.js and laws.js.
// No network request of any kind is made here.
(function () {
  "use strict";
  var E = window.EXAMPLE, L = window.LAWS;
  var view = document.getElementById("view");
  var stepsEl = document.getElementById("steps");
  var cur = 0;

  // ---------- helpers ----------
  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  // mode: real | fake | plain(real name without colour)
  function tx(s, mode) {
    return esc(s).replace(/\{(EE|BM|GE)\}/g, function (_, k) {
      var n = E.names[k];
      if (mode === "plain") return esc(n.real);
      return '<span class="nm ' + mode + '">' + esc(mode === "fake" ? n.fake : n.real) + "</span>";
    });
  }
  function raw(s, mode) { // plain string, tokens replaced, no HTML
    return s.replace(/\{(EE|BM|GE)\}/g, function (_, k) { return mode === "fake" ? E.names[k].fake : E.names[k].real; });
  }
  function norm(s) { return s.replace(/[  \s]+/g, " ").trim(); }
  function law(l) { return L[l]; }
  function fmtDate(iso) { var p = iso.split("-"); return p[2] + "." + p[1] + "." + p[0]; }
  function lawText(l) { return law(l).text; }

  var BADGE = {
    ok: ["✔", "belegt"], partial: ["◐", "teilweise belegt"], none: ["✖", "nicht belegt"],
    apply: ["⚖", "Anwendung auf den Fall, vom Anwalt zu prüfen"]
  };
  function pill(v) { return '<span class="pill ' + v + '">' + BADGE[v][0] + " " + BADGE[v][1] + "</span>"; }

  function keyLine() {
    return '<p class="key">Farben: <span class="nm real">echter Name</span> <span class="nm fake">falscher Name</span> – in jedem Schritt gleich.</p>';
  }

  // ---------- texts that are sent ----------
  function facts() {
    return "Rechtsregime: G-VBG 2012 (Tirol, Vertragsbedienstete einer Gemeinde)\n" +
      "Fakten: weiblich; geboren 14.03.1980; Dienstbeginn 01.09.2014; Dienstende 31.10.2026 (Kündigung durch den Dienstgeber); Vollzeit";
  }
  function issuesList() {
    return E.issues.map(function (x, i) { return (i + 1) + ". " + x[0]; }).join("\n");
  }
  function lawBlock() {
    return E.kept.map(function (l) { return law(l).citation + " – " + law(l).heading; }).join("\n");
  }
  function text5() { return facts() + "\n\nFreitext:\n" + E.freeText + "\n\n" + E.task5; }
  function text8() {
    return facts() + "\n\nFreitext:\n" + E.freeText +
      "\n\nBestätigte Rechtsfragen:\n" + issuesList() +
      "\n\nAnweisung: " + E.instructions +
      "\n\nGesetzestext (öffentlich, voller Wortlaut unten):\n" + lawBlock() + "\n\n" + E.task8;
  }
  var CHECK = "Frage: Trägt der Gesetzestext die Aussage? Antworte mit belegt, teilweise belegt oder nicht belegt und begründe kurz.";
  function stmt(id) { return E.draft.filter(function (d) { return d.s === id; })[0]; }
  function text9() {
    var s = stmt("S3");
    return "Aussage:\n" + s.text + "\n\nGesetzestext:\n" + lawText(s.cite) + "\n\n" + CHECK;
  }

  function pairBox(txt, extra) {
    return '<div class="pair">' +
      '<div class="box sentbox"><h4>↗ Genau das wird gesendet (falsche Namen)</h4><div class="pre">' + tx(txt, "fake") + "</div></div>" +
      '<div class="box localbox"><h4>⌂ Bleibt lokal (echte Namen)</h4><div class="pre">' + tx(txt, "real") + "</div></div>" +
      "</div>" + (extra || "");
  }
  function lawDetails(list) {
    return "<details><summary>Gesetzestext ansehen, der mitgesendet wird (öffentlich)</summary>" +
      list.map(function (l) { return '<p class="pre"><strong>' + esc(law(l).citation) + " – " + esc(law(l).heading) + "</strong>\n" + esc(law(l).text) + "</p>"; }).join("") +
      "</details>";
  }

  // ---------- draft rendering ----------
  function draftHtml(mode, marked, ids) {
    return E.draft.map(function (d) {
      if (d.t !== undefined) return tx(d.t, mode);
      var inner = tx(d.text, mode);
      var sid = ids ? '<span class="sid">[' + d.s + "]</span>" : "";
      return marked ? '<span class="vs ' + d.verdict + '">' + inner + "</span>" + sid : inner + sid;
    }).join("");
  }
  function realDraftText() {
    return E.draft.map(function (d) { return raw(d.t !== undefined ? d.t : d.text, "real"); }).join("");
  }
  function countToken(re) {
    var n = 0;
    E.draft.forEach(function (d) { var m = (d.t !== undefined ? d.t : d.text).match(re); if (m) n += m.length; });
    return n;
  }

  // ---------- screens: the left side ----------
  var screens = {
    0: function () {
      return "<h1>gopfi – Entwurfsassistent (Vorführung)</h1>" +
        "<p>Beispiel: <strong>" + esc(E.caseTitle) + "</strong>. Eine Vertragsbedienstete einer Tiroler Gemeinde streitet mit der Gemeinde über Urlaub, der nach der Kündigung ausgezahlt werden soll. Gesucht ist ein Schreiben an den Dienstgeber.</p>" +
        "<h3>So lest ihr die Seiten</h3>" +
        "<table><tr><th>Mark</th><th>Bedeutung</th></tr>" +
        '<tr><td><span class="pill no">⌂ Bleibt lokal</span></td><td>Die Daten bleiben auf dem gopfi-Server in der Kanzlei und im Browser.</td></tr>' +
        '<tr><td><span class="pill yes">↗ Wird an Mistral gesendet</span></td><td>Der gopfi-Server sendet Daten an Mistral. Der genaue Text steht auf der Seite.</td></tr>' +
        '<tr><td><span class="nm real">Julia Brandstetter</span></td><td>echter Name (im Beispiel erfunden)</td></tr>' +
        '<tr><td><span class="nm fake">Sabine Lechner</span></td><td>falscher Name, der an die Stelle des echten tritt</td></tr></table>' +
        "<h3>Was dieser Assistent nicht tut</h3>" +
        "<p>Er schreibt Entwürfe, er berät nicht. Was drinsteht, prüft die Anwältin oder der Anwalt.</p>" +
        "<h3>Links</h3><p>Die Liste links zeigt frühere Fälle. Sie ist nur für die Anwältin oder den Anwalt da und kommt in keinem Schritt vor.</p>";
    },
    1: function () {
      var rows = E.form.map(function (f) {
        var pillh = f[2] === "yes" ? '<span class="pill yes">↗ geht an Mistral</span>' : '<span class="pill no">⌂ bleibt lokal</span>';
        return '<div class="fieldrow"><div class="l">' + esc(f[0]) + '</div><div class="v locked" aria-readonly="true">' + tx(f[1], "real") + "</div><div>" + pillh + "</div></div>";
      }).join("");
      return "<h1>Eingabe</h1>" + keyLine() + rows +
        '<h3>Freitext zum Fall</h3><div class="box locked pre">' + tx(E.freeText, "real") + "</div>" +
        '<h3>Anweisung für das Schreiben</h3><div class="box locked pre">' + tx(E.instructions, "real") + "</div>" +
        '<p class="key">Alle Felder sind gesperrt. Dass ein Wert „an Mistral“ geht, heißt nur: nach Schritt 4 und in der Form, die dort gezeigt wird.</p>';
    },
    2: function () {
      var rows = E.derived.map(function (d) { return "<tr><td>" + esc(d[0]) + "</td><td><strong>" + esc(d[1]) + "</strong></td><td>" + esc(d[2]) + "</td></tr>"; }).join("");
      return "<h1>Abgeleitete Daten</h1><table><tr><th>Wert</th><th>Ergebnis</th><th>Berechnet aus</th></tr>" + rows + "</table>" +
        '<p class="key">Warum das Datum zählt: Die Fassung des Gesetzes hängt von den Daten ab. Das Alter bestimmt hier das Urlaubsausmaß (240 statt 200 Dienststunden).</p>';
    },
    3: function () {
      var r = E.regime;
      var rows = r.rule.map(function (x) { return "<tr><td>" + esc(x[0]) + "</td><td>" + esc(x[1]) + "</td></tr>"; }).join("");
      var l1 = law(r.basis);
      var q = "für alle Bediensteten, die in einem privatrechtlichen Dienstverhältnis zu einer Gemeinde, mit Ausnahme der Stadt Innsbruck, oder zu einem Gemeindeverband stehen (Vertragsbedienstete)";
      return "<h1>Anwendbares Recht</h1><table><tr><th>Regel (aus dem Formular)</th><th>Antwort</th></tr>" + rows + "</table>" +
        '<h3>Ergebnis</h3><p class="result">' + esc(r.result) + "</p>" +
        "<h3>Grundlage</h3><p>" + esc(l1.citation) + " Abs. 1: <q>" + esc(q) + '</q></p><p class="key">Stand der Quelle: geändert am ' + fmtDate(l1.changed) + ", Datensatz " + esc(l1.id) + ".</p>";
    },
    4: function () {
      var rows = Object.keys(E.names).map(function (k) {
        var n = E.names[k];
        return "<tr><td>" + esc(n.role) + '</td><td><span class="nm real">' + esc(n.real) + '</span></td><td><span class="nm fake">' + esc(n.fake) + "</span></td></tr>";
      }).join("");
      return "<h1>Falsche Namen</h1><h3>Zuordnungstabelle (bleibt lokal)</h3>" +
        "<table><tr><th>Rolle</th><th>Echter Name</th><th>Falscher Name</th></tr>" + rows + "</table>" +
        "<h3>Freitext vorher und nachher</h3>" +
        '<div class="pair"><div class="box localbox"><h4>⌂ Vorher (echt)</h4><div class="pre">' + tx(E.freeText, "real") + "</div></div>" +
        '<div class="box sentbox"><h4>↗ Nachher: so geht er später raus</h4><div class="pre">' + tx(E.freeText, "fake") + "</div></div></div>" +
        '<h3>Anweisung vorher und nachher</h3><div class="pair"><div class="box localbox"><div class="pre">' + tx(E.instructions, "real") + '</div></div><div class="box sentbox"><div class="pre">' + tx(E.instructions, "fake") + "</div></div></div>" +
        "<h3>Bestätigung</h3><p>☐ Ich habe den Text geprüft: kein echter Name ist übrig geblieben.  <span class=\"pill no\">gesperrt in der Vorführung</span></p>" +
        '<p class="key">Die falschen Namen kommen aus einer festen Liste, sind von derselben Art wie die echten (Person für Person, Gemeinde für Gemeinde) und kommen sonst im Fall nicht vor.</p>' + keyLine();
    },
    5: function () {
      var rows = E.issues.map(function (x, i) { return "<tr><td>" + (i + 1) + "</td><td>" + esc(x[0]) + "</td><td>" + esc(x[1]) + "</td></tr>"; }).join("");
      return "<h1>Rechtsfragen</h1><h3>Gesendet und lokal</h3>" + keyLine() + pairBox(text5()) +
        "<h3>Antwort des Modells (vorbereitet)</h3><table><tr><th>#</th><th>Rechtsfrage</th><th>Suchbegriffe</th></tr>" + rows + "</table>" +
        '<p>☐ Liste bestätigt  <span class="pill no">gesperrt in der Vorführung</span></p>' +
        '<p class="key">Der Aufgabentext oben ist ein Platzhalter; der Wortlaut des echten Auftrags steht noch nicht fest.</p>';
    },
    6: function () {
      var items = E.hits.map(function (h) {
        var l = law(h[0]);
        return "<li><div class=\"hit\"><strong>" + esc(l.citation) + "</strong> " + esc(l.heading) +
          '<span class="pill ' + (h[2] === "Verweis" ? "partial" : "no") + '">' + esc(h[2]) + "</span></div><div class=\"key\">gefunden wegen: " + esc(h[1]) + "</div></li>";
      }).join("");
      return "<h1>Suche</h1><p>Lokale Gesetzessammlung, G-VBG 2012. Treffer, nach Bestimmung:</p><ul class=\"hits\">" + items + "</ul>" +
        '<p class="key">Verweis = die Bestimmung wurde nicht gesucht, sondern von einem Treffer aus erreicht, der sie nennt.</p>';
    },
    7: function () {
      var items = E.hits.map(function (h) {
        var l = law(h[0]), gone = E.removed[h[0]];
        return '<li class="' + (gone ? "gone" : "") + '"><div class="hit">' + (gone ? "☒ entfernt" : "☑ behalten") + " <strong>" + esc(l.citation) + "</strong> " + esc(l.heading) + "</div>" +
          (gone ? '<div class="key" style="text-decoration:none">Grund: ' + esc(gone) + "</div>" : "") + "</li>";
      }).join("");
      return "<h1>Fundstellen prüfen</h1><ul class=\"hits\">" + items + "</ul>" +
        '<p><span class="pill no">gesperrt in der Vorführung</span> Hier könnte die Anwältin oder der Anwalt auch weitere Bestimmungen hinzufügen.</p>';
    },
    8: function () {
      return "<h1>Entwurf</h1><h3>Gesendet und lokal</h3>" + keyLine() + pairBox(text8(), lawDetails(E.kept)) +
        "<h3>Antwort des Modells (vorbereitet)</h3>" +
        '<p class="key">Noch mit falschen Namen. Hinter jeder rechtlichen Aussage steht ihre Nummer.</p>' +
        '<div class="letter">' + draftHtml("fake", false, true) + "</div>";
    },
    9: function () {
      var rows = E.draft.filter(function (d) { return d.s; }).map(function (d) {
        var found = d.quote ? norm(lawText(d.cite)).indexOf(norm(d.quote)) >= 0 : null;
        var l = law(d.cite);
        return "<tr><td>" + d.s + "</td><td>" + esc(l.citation) + " " + esc(d.abs) + "</td><td>" +
          (found === null ? '<span class="pill none">✖ kein Zitat</span>' : found ? '<span class="pill ok">✔ gefunden</span>' : '<span class="pill none">✖ nicht gefunden</span>') +
          "</td><td>" + fmtDate(l.changed) + " ≤ 31.10.2026 ✔</td></tr>";
      }).join("");
      var stm = E.draft.filter(function (d) { return d.s; }).map(function (d) {
        return '<div class="stmt ' + d.verdict + '"><div>' + pill(d.verdict) + " <strong>" + d.s + "</strong> " + tx(d.text, "fake") + "</div>" +
          (d.quote ? '<div class="quote">Zitat: <q>' + esc(d.quote) + "</q> (" + esc(law(d.cite).citation) + " " + esc(d.abs) + ")</div>" : "") +
          '<div class="note">' + esc(d.note) + "</div>" +
          (d.verdict === "none" || d.verdict === "partial" ? '<div class="built">Im Beispiel absichtlich eingebaut, damit die Prüfung etwas fängt.</div>' : "") + "</div>";
      }).join("");
      return "<h1>Prüfung 1</h1>" +
        "<h3>Teil 1 – Programm (lokal)</h3><table><tr><th>Nr.</th><th>Fundstelle</th><th>Zitat im Datensatz</th><th>Fassung (Stand ≤ Stichtag)</th></tr>" + rows + "</table>" +
        '<p class="key">Das Zitat wird wirklich in diesem Moment im Gesetzestext gesucht (Leerzeichen vereinheitlicht). Zusätzlich geprüft: Daten (31.12.2025 = Ende des Folgejahres von 2024), Beträge (240 Stunden = § 74 Abs. 1 lit. b), Prüfsummen der Quelldateien.</p>' +
        "<h3>Teil 2 – Modell (Mistral): eine Aussage mit ihrem Gesetzestext</h3>" +
        '<p class="key">Beispiel: Aussage S3. So geschieht es für jede der 8 Aussagen einzeln.</p>' + pairBox(text9()) +
        "<h3>Urteile</h3>" + stm;
    },
    10: function () {
      var seen = {}, rows = [];
      E.draft.forEach(function (d) { if (d.s && !seen[d.cite]) { seen[d.cite] = 1; var l = law(d.cite);
        rows.push("<tr><td>" + esc(l.citation) + "</td><td class=\"mono\">" + esc(l.id) + "</td><td>" + fmtDate(l.changed) + '</td><td class="mono">' + esc(l.sha256.slice(0, 16)) + "…</td><td class=\"mono\">" + esc(l.source) + "</td></tr>"); } });
      return "<h1>Prüfung 2: Quellenverzeichnis</h1><table><tr><th>Fundstelle</th><th>Datensatz</th><th>Stand</th><th>Prüfsumme (SHA-256, Anfang)</th><th>Quelle (nur Angabe)</th></tr>" + rows.join("") + "</table>" +
        '<p class="key">Die Prüfsumme gehört zur heruntergeladenen Quelldatei. Sie zeigt später, dass der Text seit dem Laden unverändert ist.</p>';
    },
    11: function () {
      var n = E.notUsed;
      return "<h1>Nicht berücksichtigt</h1>" +
        "<h3>Gefundene, aber nicht verwendete Bestimmungen</h3><table>" + n.provisions.map(function (x) { return "<tr><td>" + esc(x[0]) + " " + esc(x[1]) + "</td><td>" + esc(x[2]) + "</td></tr>"; }).join("") + "</table>" +
        "<h3>Verweise auf Gesetze, die nicht verwendet wurden</h3><table>" + n.outside.map(function (x) { return "<tr><td>" + esc(x[0]) + "</td><td>" + esc(x[1]) + "</td></tr>"; }).join("") + "</table>" +
        "<h3>Rechtsfragen ohne Fundstelle</h3><table>" + n.noHit.map(function (x) { return "<tr><td>" + esc(x[0]) + "</td><td>" + esc(x[1]) + "</td></tr>"; }).join("") + "</table>";
    },
    12: function () {
      var nEE = countToken(/\{EE\}/g), nBM = countToken(/\{BM\}/g), nGE = countToken(/\{GE\}/g);
      var after = realDraftText();
      var left = 0;
      Object.keys(E.names).forEach(function (k) { var f = E.names[k].fake; var i = -1; while ((i = after.indexOf(f, i + 1)) >= 0) left++; });
      var filled = draftHtml("real", false, false)
        .replace("[Anschrift des Dienstgebers]", '<span class="nm fill">Dorfplatz 1, 6999 Wiesenbrunn-Tal</span>')
        .replace("[Aktenzahl]", '<span class="nm fill">GZ 26/0412</span>');
      return "<h1>Echte Namen einsetzen</h1>" + keyLine() +
        '<div class="pair"><div class="box"><h4>Vorher (falsche Namen)</h4><div class="letter">' + draftHtml("fake", false, false) + "</div></div>" +
        '<div class="box localbox"><h4>⌂ Nachher (echte Namen)</h4><div class="letter">' + filled + "</div></div></div>" +
        "<h3>Prüfung des Skripts</h3><table><tr><th>Name</th><th>Ersetzungen</th></tr>" +
        "<tr><td>" + esc(E.names.EE.fake) + " → " + esc(E.names.EE.real) + "</td><td>" + nEE + "</td></tr>" +
        "<tr><td>" + esc(E.names.BM.fake) + " → " + esc(E.names.BM.real) + "</td><td>" + nBM + "</td></tr>" +
        "<tr><td>" + esc(E.names.GE.fake) + " → " + esc(E.names.GE.real) + "</td><td>" + nGE + "</td></tr></table>" +
        '<p><span class="result">' + left + " falsche Namen übrig</span> &nbsp; Anschrift und Aktenzahl aus dem Formular eingesetzt (grün). Die Unterschrift setzt die Anwältin oder der Anwalt.</p>";
    },
    13: function () {
      var rows = E.summary.map(function (r) {
        var send = /Mistral/.test(r[3]);
        return "<tr><td>" + esc(r[0]) + "</td><td>" + esc(r[1]) + "</td><td>" + esc(r[2]) + '</td><td><span class="pill ' + (send ? "yes" : "no") + '">' + (send ? "↗ " : "⌂ ") + esc(r[3]) + "</span></td></tr>";
      }).join("");
      return "<h1>Zusammenfassung</h1><table><tr><th>Schritt</th><th>Was</th><th>Was gesendet wurde</th><th>Wohin</th></tr>" + rows + "</table>" +
        "<h3>Nie gesendet, in keinem Schritt</h3><ul>" + E.neverSent.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul>" +
        '<h3>Was nicht geschützt ist</h3><p>Falsche Namen machen den Fall <strong>pseudonym, nicht anonym</strong>: Der Sachverhalt, Daten, Alter, Geschlecht und Dienstzeit gehen unverändert an Mistral. Wer die Geschichte kennt, kann sie wiedererkennen.</p>' +
        "<p class=\"key\">Das RIS wird mit Falldaten nie kontaktiert: Das Gesetz wird nachts geladen, unabhängig von jedem Fall.</p>";
    }
  };

  // ---------- diagram ----------
  function diagram(step) {
    function on(n) { return step.nodes.indexOf(n) >= 0 ? " on" : ""; }
    function hop(id) { return step.hop === id ? " on" + (step.send ? " send" : "") : ""; }
    var sm = step.hop === "sm";
    return '<svg viewBox="0 0 460 90" role="img" aria-label="Datenweg: Browser, gopfi-Server, Mistral. ' +
      (step.nodes.length ? "Beteiligt: " + step.nodes.join(", ") + "." : "Nichts beteiligt.") + (sm ? " Daten gehen an Mistral." : "") + '">' +
      '<g class="node browser' + on("browser") + '"><rect x="4" y="20" width="110" height="50" rx="8"/><text x="59" y="42" text-anchor="middle">Browser</text><text x="59" y="58" text-anchor="middle">der Kanzlei</text></g>' +
      '<g class="hop' + hop("bs") + '"><line x1="114" y1="45" x2="175" y2="45"/><text x="144" y="36" text-anchor="middle">lokal</text></g>' +
      '<g class="node server' + on("server") + '"><rect x="175" y="20" width="110" height="50" rx="8"/><text x="230" y="42" text-anchor="middle">gopfi-Server</text><text x="230" y="58" text-anchor="middle">in der Kanzlei</text></g>' +
      '<g class="hop' + hop("sm") + '"><line x1="285" y1="45" x2="346" y2="45"/><text x="315" y="36" text-anchor="middle">' + (sm ? "↗ Internet" : "–") + '</text></g>' +
      '<g class="node mistral' + on("mistral") + '"><rect x="346" y="20" width="110" height="50" rx="8"/><text x="401" y="50" text-anchor="middle">Mistral</text></g></svg>';
  }

  // ---------- render ----------
  function badge(step) {
    if (step.mixed) {
      return '<div class="badge send"><span class="sym">↗</span> Teil 2 wird an Mistral gesendet</div> <div class="badge local"><span class="sym">⌂</span> Teil 1 bleibt lokal</div>';
    }
    return step.send
      ? '<div class="badge send"><span class="sym">↗</span> Wird an Mistral gesendet</div>'
      : '<div class="badge local"><span class="sym">⌂</span> Bleibt lokal</div>';
  }
  function render(n) {
    cur = Math.max(0, Math.min(E.steps.length - 1, n));
    var step = E.steps[cur];
    view.innerHTML =
      '<div class="layout"><section class="card" aria-label="Die Ansicht">' + badge(step) + screens[cur]() + "</section>" +
      '<aside class="card explain" aria-label="Erklärung">' +
      "<h3>Was passiert hier?</h3><p>" + esc(step.what) + "</p>" +
      "<h3>Welche Daten werden verarbeitet?</h3><p>" + esc(step.data) + "</p>" +
      "<h3>Wohin gehen Daten?</h3><div class=\"flowbox" + (step.send ? " send" : "") + "\"><p>" + esc(step.flow) + "</p></div>" +
      '<div class="diagram">' + diagram(step) + "</div></aside></div>" +
      '<div class="nav"><button id="prev"' + (cur === 0 ? " disabled" : "") + '>← Zurück</button><button id="next"' + (cur === E.steps.length - 1 ? " disabled" : "") + '>Weiter →</button><span class="pos">Schritt ' + cur + " von " + (E.steps.length - 1) + " · " + esc(step.name) + "</span></div>";
    document.getElementById("prev").onclick = function () { go(cur - 1); };
    document.getElementById("next").onclick = function () { go(cur + 1); };
    Array.prototype.forEach.call(stepsEl.querySelectorAll("button"), function (b, i) {
      if (i === cur) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current");
    });
    document.title = "gopfi Showcase – " + step.name;
    window.scrollTo(0, 0);
  }
  function go(n) {
    n = Math.max(0, Math.min(E.steps.length - 1, n));
    if (location.hash !== "#/" + n) location.hash = "#/" + n; else render(n);
  }
  function buildSteps() {
    stepsEl.innerHTML = E.steps.map(function (s) {
      return '<li><button class="' + (s.send ? "send" : "") + '" data-i="' + s.id + '" title="' + esc(s.name) + (s.send ? " – sendet an Mistral" : "") + '">' +
        s.id + (s.send ? ' <span class="mk" aria-hidden="true">↗</span><span style="position:absolute;left:-9999px"> sendet an Mistral</span>' : "") + "</button></li>";
    }).join("");
    stepsEl.onclick = function (e) {
      var b = e.target.closest("button"); if (b) go(+b.getAttribute("data-i"));
    };
  }
  function fromHash() {
    var m = /^#\/(\d+)$/.exec(location.hash);
    render(m ? +m[1] : 0);
  }

  // ---------- sidebar: local-only filter ----------
  var casesEl = document.getElementById("cases");
  var qEl = document.getElementById("q");
  var countEl = document.getElementById("count");
  var noteEl = document.getElementById("cnote");
  function fold(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function hl(s, terms) {
    var out = esc(s);
    terms.forEach(function (t) {
      if (!t) return;
      var re = new RegExp("(" + t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      // highlight on folded text positions only when lengths agree (they do for these data)
      out = out.replace(re, "<mark>$1</mark>");
    });
    return out;
  }
  function renderCases() {
    var raw = qEl.value.trim();
    var terms = fold(raw).split(/\s+/).filter(Boolean);
    var shown = E.pastCases.filter(function (c) {
      var hay = fold(raw0(c) + " " + c.tags.join(" "));
      return terms.every(function (t) { return hay.indexOf(t) >= 0; });
    });
    countEl.textContent = shown.length + " von " + E.pastCases.length + " Fällen";
    if (!shown.length) { casesEl.innerHTML = '<li class="empty">Keine Treffer.</li>'; return; }
    casesEl.innerHTML = shown.map(function (c) {
      return '<li><div class="case' + (c.current ? " current" : "") + '" role="button" tabindex="0" data-id="' + c.id + '"' + (c.current ? ' aria-current="true"' : "") + ">" +
        '<div class="cname"><span>' + hl(raw0(c), terms) + '</span><span class="cdate">' + esc(c.date) + "</span></div>" +
        '<div class="tags">' + c.tags.map(function (t) { return '<button class="tag" data-tag="' + esc(t) + '">' + hl(t, terms) + "</button>"; }).join("") + "</div></div></li>";
    }).join("");
  }
  function raw0(c) { return c.client.replace(/\{(EE|BM|GE)\}/g, function (_, k) { return E.names[k].real; }); }
  qEl.addEventListener("input", renderCases);
  qEl.addEventListener("keydown", function (e) { if (e.key === "Escape") { qEl.value = ""; renderCases(); } });
  casesEl.addEventListener("click", function (e) {
    var t = e.target.closest(".tag");
    if (t) { qEl.value = t.getAttribute("data-tag"); renderCases(); e.stopPropagation(); return; }
    var c = e.target.closest(".case");
    if (c && !c.classList.contains("current")) noteEl.textContent = "In der Vorführung ist nur der aktuelle Fall geöffnet.";
    else if (c) noteEl.textContent = "";
  });
  casesEl.addEventListener("keydown", function (e) {
    if ((e.key === "Enter" || e.key === " ") && e.target.classList.contains("case")) { e.preventDefault(); e.target.click(); }
  });

  // ---------- mobile menu, keys ----------
  var side = document.getElementById("side"), menu = document.getElementById("menu");
  menu.onclick = function () { var o = side.classList.toggle("open"); menu.setAttribute("aria-expanded", o); };
  document.getElementById("main").addEventListener("click", function () { side.classList.remove("open"); menu.setAttribute("aria-expanded", "false"); });
  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (e.key === "/" && tag !== "input") { e.preventDefault(); qEl.focus(); return; }
    if (tag === "input" || e.ctrlKey || e.metaKey || e.altKey) return;
    if (e.key === "ArrowRight") go(cur + 1);
    else if (e.key === "ArrowLeft") go(cur - 1);
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(E.steps.length - 1);
  });

  buildSteps();
  renderCases();
  window.addEventListener("hashchange", fromHash);
  fromHash();
})();
