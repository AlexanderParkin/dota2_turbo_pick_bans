(() => {
  "use strict";

  const DATA_URL = "data/tournament-games.json";
  const HERO_CDN = "https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/";

  const TEAMS = [
    { id: "j4", name: "J4" },
    { id: "dogs", name: "Пес Дюк" },
    { id: "allseeing", name: "Всефидящие" },
    { id: "kittens", name: "Котята" },
    { id: "otodraniki", name: "Отодраники" },
  ];

  const PRIMARY_TEAM_OVERRIDES = {
    "@katanaflow": "Всефидящие",
    epremches: "Котята",
    "местная табуретка": "Всефидящие",
  };

  // Official internal hero slugs copied from the HEROES registry in index.html.
  const HERO_SLUGS = {
    "Anti-Mage": "antimage",
    Axe: "axe",
    Bane: "bane",
    Beastmaster: "beastmaster",
    Bristleback: "bristleback",
    "Centaur Warrunner": "centaur",
    "Chaos Knight": "chaos_knight",
    Clockwerk: "rattletrap",
    "Death Prophet": "death_prophet",
    Doom: "doom_bringer",
    "Drow Ranger": "drow_ranger",
    Earthshaker: "earthshaker",
    "Ember Spirit": "ember_spirit",
    Grimstroke: "grimstroke",
    Hoodwink: "hoodwink",
    Invoker: "invoker",
    Jakiro: "jakiro",
    Juggernaut: "juggernaut",
    "Keeper of the Light": "keeper_of_the_light",
    Kez: "kez",
    Kunkka: "kunkka",
    "Legion Commander": "legion_commander",
    Lich: "lich",
    Lifestealer: "life_stealer",
    Lina: "lina",
    Lion: "lion",
    Luna: "luna",
    Magnus: "magnataur",
    Marci: "marci",
    Mars: "mars",
    Medusa: "medusa",
    Morphling: "morphling",
    "Nature's Prophet": "furion",
    Necrophos: "necrolyte",
    "Ogre Magi": "ogre_magi",
    "Phantom Assassin": "phantom_assassin",
    "Phantom Lancer": "phantom_lancer",
    Pudge: "pudge",
    Pugna: "pugna",
    Riki: "riki",
    Rubick: "rubick",
    "Sand King": "sand_king",
    Silencer: "silencer",
    "Skywrath Mage": "skywrath_mage",
    Slardar: "slardar",
    Slark: "slark",
    Snapfire: "snapfire",
    Sniper: "sniper",
    Spectre: "spectre",
    "Spirit Breaker": "spirit_breaker",
    "Storm Spirit": "storm_spirit",
    Sven: "sven",
    Techies: "techies",
    Terrorblade: "terrorblade",
    Tidehunter: "tidehunter",
    Tinker: "tinker",
    Tusk: "tusk",
    Undying: "undying",
    Ursa: "ursa",
    "Vengeful Spirit": "vengefulspirit",
    Viper: "viper",
    "Void Spirit": "void_spirit",
    Weaver: "weaver",
    Windranger: "windrunner",
    "Winter Wyvern": "winter_wyvern",
    "Witch Doctor": "witch_doctor",
    Zeus: "zuus",
  };

  const collator = new Intl.Collator("ru", { sensitivity: "base" });
  const numberFormat = new Intl.NumberFormat("ru-RU");

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    })[character]);
  }

  function teamById(id) {
    return TEAMS.find((team) => team.id === id) || null;
  }

  function teamByName(name) {
    return TEAMS.find((team) => team.name === name) || null;
  }

  function teamUrl(team) {
    return `tournament-team.html?team=${encodeURIComponent(team.id)}`;
  }

  function seriesUrl(teamA, teamB) {
    return `tournament-series.html?a=${encodeURIComponent(teamA.id)}&b=${encodeURIComponent(teamB.id)}`;
  }

  function matchUrl(matchId) {
    return `tournament-match.html?id=${encodeURIComponent(matchId)}`;
  }

  function sideForTeam(game, teamName) {
    if (game.teams.radiant === teamName) return "radiant";
    if (game.teams.dire === teamName) return "dire";
    return null;
  }

  function winnerTeam(game) {
    return game.teams[game.game.winner.toLowerCase()];
  }

  function sideWon(game, side) {
    return game.game.winner.toLowerCase() === side;
  }

  function scoreForTeam(game, teamName) {
    const side = sideForTeam(game, teamName);
    return side ? game.game.score[side] : null;
  }

  function gamesForTeam(games, teamName) {
    return games.filter((game) => sideForTeam(game, teamName));
  }

  function gamesForSeries(games, teamA, teamB) {
    return games.filter((game) => {
      const names = Object.values(game.teams);
      return names.includes(teamA) && names.includes(teamB);
    });
  }

  function getTeamStats(games, teamName) {
    const appearances = gamesForTeam(games, teamName);
    const wins = appearances.filter((game) => winnerTeam(game) === teamName).length;
    const losses = appearances.length - wins;
    return {
      games: appearances.length,
      wins,
      losses,
      points: wins,
      winrate: appearances.length ? wins / appearances.length : 0,
    };
  }

  function heroMedia(hero, className = "") {
    const slug = HERO_SLUGS[hero];
    const safeHero = escapeHtml(hero);
    const classes = ["hero-media", className].filter(Boolean).join(" ");
    if (!slug) {
      return `<span class="${classes} is-missing" data-label="${safeHero}" title="${safeHero}"><span class="sr-only">${safeHero}</span></span>`;
    }
    return `<span class="${classes}" data-label="${safeHero}" title="${safeHero}"><img src="${HERO_CDN}${slug}.png" alt="${safeHero}" loading="lazy" data-hero-image></span>`;
  }

  function recordMarkup(wins, losses) {
    return `<span class="record" aria-label="${wins} побед, ${losses} поражений"><span class="win">${wins}</span><span class="record__dash">–</span><span class="loss">${losses}</span></span>`;
  }

  function mastheadMarkup(eyebrow, title, intro, stamp = "Turbo\nLeague") {
    return `
      <header class="masthead">
        <div>
          <p class="eyebrow">${escapeHtml(eyebrow)}</p>
          <h1>${escapeHtml(title)}</h1>
          <p class="masthead__intro">${escapeHtml(intro)}</p>
        </div>
        <div class="masthead__stamp" aria-hidden="true">${escapeHtml(stamp).replace("\n", "<br>")}</div>
      </header>`;
  }

  function footerMarkup(games) {
    return `
      <footer class="footer">
        <span>Турнир «100 Грешников» · Turbo Dota 2</span>
        <span>${games.length} матчей · ${games.length * 10} игровых строк</span>
      </footer>`;
  }

  function emptyState(title, message) {
    return `
      <section class="empty-state">
        <div>
          <p class="eyebrow">Данные не найдены</p>
          <h1>${escapeHtml(title)}</h1>
          <p>${escapeHtml(message)}</p>
          <a class="text-link" href="tournament-100-sinners.html">Вернуться к турниру</a>
        </div>
      </section>`;
  }

  function standingsMarkup(games) {
    const standings = TEAMS.map((team) => ({ team, ...getTeamStats(games, team.name) }))
      .sort((left, right) => (
        right.points - left.points
        || right.winrate - left.winrate
        || collator.compare(left.team.name, right.team.name)
      ));

    return `
      <div class="table-scroll">
        <table class="data-table">
          <caption class="sr-only">Турнирная таблица команд</caption>
          <thead>
            <tr><th>#</th><th>Команда</th><th>Игры</th><th>Победы</th><th>Поражения</th><th>Баллы</th></tr>
          </thead>
          <tbody>
            ${standings.map((row, index) => `
              <tr>
                <td class="rank">${index + 1}</td>
                <td><a class="team-link" href="${teamUrl(row.team)}">${escapeHtml(row.team.name)}</a></td>
                <td>${row.games}</td>
                <td class="win">${row.wins}</td>
                <td class="loss">${row.losses}</td>
                <td class="points">${row.points}</td>
              </tr>`).join("")}
          </tbody>
        </table>
      </div>`;
  }

  function matrixMarkup(games) {
    const head = TEAMS.map((team) => `<th scope="col">${escapeHtml(team.name)}</th>`).join("");
    const rows = TEAMS.map((rowTeam) => {
      const cells = TEAMS.map((columnTeam) => {
        if (rowTeam.id === columnTeam.id) {
          return '<td class="matrix__empty" aria-label="Команда не играет сама с собой">—</td>';
        }
        const series = gamesForSeries(games, rowTeam.name, columnTeam.name);
        if (!series.length) {
          return '<td><span class="matrix__missing" aria-label="Матчи не сыграны">—</span></td>';
        }
        const wins = series.filter((game) => winnerTeam(game) === rowTeam.name).length;
        const losses = series.length - wins;
        const label = `${rowTeam.name} — ${columnTeam.name}: ${wins} побед, ${losses} поражений`;
        return `<td><a class="matrix__link" href="${seriesUrl(rowTeam, columnTeam)}" aria-label="${escapeHtml(label)}">${wins}–${losses}</a></td>`;
      }).join("");
      return `<tr><th scope="row">${escapeHtml(rowTeam.name)}</th>${cells}</tr>`;
    }).join("");

    return `
      <div class="matrix-frame">
        <table class="matrix">
          <caption class="sr-only">Матрица встреч команд</caption>
          <thead><tr><th scope="col">Команда</th>${head}</tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  function aggregateHeroStats(games) {
    const stats = new Map();
    games.forEach((game) => {
      ["radiant", "dire"].forEach((side) => {
        game.players[side].forEach((player) => {
          const stat = stats.get(player.hero) || { hero: player.hero, picks: 0, wins: 0, losses: 0 };
          stat.picks += 1;
          if (sideWon(game, side)) stat.wins += 1;
          else stat.losses += 1;
          stats.set(player.hero, stat);
        });
      });
    });
    return [...stats.values()].sort((left, right) => (
      right.picks - left.picks
      || right.wins - left.wins
      || collator.compare(left.hero, right.hero)
    ));
  }

  function heroStatsMarkup(games) {
    return `<div class="hero-grid">${aggregateHeroStats(games).map((stat) => `
      <article class="hero-stat">
        ${heroMedia(stat.hero)}
        <div>
          <div class="hero-stat__name">${escapeHtml(stat.hero)}</div>
          <div class="hero-stat__picks">${stat.picks} ${pluralize(stat.picks, "игра", "игры", "игр")}</div>
        </div>
        <div class="hero-stat__record">${recordMarkup(stat.wins, stat.losses)}</div>
      </article>`).join("")}</div>`;
  }

  function pluralize(value, one, few, many) {
    const mod10 = value % 10;
    const mod100 = value % 100;
    if (mod10 === 1 && mod100 !== 11) return one;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
    return many;
  }

  function renderHome(data) {
    const games = data.games;
    document.title = "Турнир 100 Грешников — Dota 2 Turbo";
    return `
      ${mastheadMarkup("Dota 2 Turbo · турнирная книга", "100 Грешников", "Все серии, очные встречи и статистика героев из 17 сыгранных матчей.", "17\nматчей")}
      <main>
        <section class="section" aria-labelledby="standings-title">
          <div class="section__head">
            <h2 id="standings-title">Таблица серий</h2>
            <p class="section__note">Одна победа — один балл</p>
          </div>
          ${standingsMarkup(games)}
        </section>

        <section class="section" aria-labelledby="matrix-title">
          <div class="section__head">
            <h2 id="matrix-title">Матрица встреч</h2>
            <p class="section__note">Счёт указан с позиции команды в строке</p>
          </div>
          ${matrixMarkup(games)}
        </section>

        <section class="section" aria-labelledby="heroes-title">
          <div class="section__head">
            <h2 id="heroes-title">Статистика героев</h2>
            <p class="section__note">Пики · <span class="win">победы</span>–<span class="loss">поражения</span></p>
          </div>
          ${heroStatsMarkup(games)}
        </section>
      </main>
      ${footerMarkup(games)}`;
  }

  function collectPlayerAppearances(games) {
    const appearances = new Map();
    games.forEach((game) => {
      ["radiant", "dire"].forEach((side) => {
        game.players[side].forEach((player) => {
          const item = {
            game,
            side,
            team: game.teams[side],
            player,
            won: sideWon(game, side),
          };
          const list = appearances.get(player.nickname) || [];
          list.push(item);
          appearances.set(player.nickname, list);
        });
      });
    });
    return appearances;
  }

  function primaryTeamByPlayer(games) {
    const appearances = collectPlayerAppearances(games);
    const resolved = new Map();
    appearances.forEach((items, nickname) => {
      if (PRIMARY_TEAM_OVERRIDES[nickname]) {
        resolved.set(nickname, PRIMARY_TEAM_OVERRIDES[nickname]);
        return;
      }
      const counts = new Map();
      items.forEach((item) => counts.set(item.team, (counts.get(item.team) || 0) + 1));
      const ranked = [...counts.entries()].sort((left, right) => (
        right[1] - left[1] || collator.compare(left[0], right[0])
      ));
      resolved.set(nickname, ranked[0][0]);
    });
    return { appearances, resolved };
  }

  function playerHeroStats(items) {
    const stats = new Map();
    items.forEach((item) => {
      const hero = item.player.hero;
      const stat = stats.get(hero) || { hero, games: 0, wins: 0, losses: 0 };
      stat.games += 1;
      if (item.won) stat.wins += 1;
      else stat.losses += 1;
      stats.set(hero, stat);
    });
    return [...stats.values()].sort((left, right) => (
      right.games - left.games
      || right.wins - left.wins
      || collator.compare(left.hero, right.hero)
    ));
  }

  function summaryStripMarkup(stats) {
    const winrate = `${Math.round(stats.winrate * 100)}%`;
    const items = [
      ["Игры", stats.games],
      ["Победы", stats.wins, "win"],
      ["Поражения", stats.losses, "loss"],
      ["Баллы", stats.points],
      ["Winrate", winrate],
    ];
    return `<div class="summary-strip">${items.map(([label, value, className = ""]) => `
      <div class="summary-strip__item">
        <span class="summary-strip__label">${label}</span>
        <span class="summary-strip__value ${className}">${value}</span>
      </div>`).join("")}</div>`;
  }

  function renderTeam(data) {
    const params = new URLSearchParams(window.location.search);
    const team = teamById(params.get("team"));
    if (!team) return emptyState("Команда не найдена", "Проверьте ссылку или выберите команду в турнирной таблице.");

    document.title = `${team.name} — Турнир 100 Грешников`;
    const teamStats = getTeamStats(data.games, team.name);
    const { appearances, resolved } = primaryTeamByPlayer(data.games);
    const roster = [...resolved.entries()]
      .filter(([, teamName]) => teamName === team.name)
      .map(([nickname]) => ({ nickname, items: appearances.get(nickname) || [] }))
      .sort((left, right) => (
        right.items.length - left.items.length || collator.compare(left.nickname, right.nickname)
      ));

    const players = roster.map(({ nickname, items }) => {
      const topHeroes = playerHeroStats(items).slice(0, 3);
      return `
        <article class="player-card">
          <div>
            <h2 class="player-card__name">${escapeHtml(nickname)}</h2>
            <p class="player-card__games">${items.length} ${pluralize(items.length, "матч", "матча", "матчей")} в турнире</p>
          </div>
          <div class="top-heroes" aria-label="Три самых частых героя игрока">
            ${topHeroes.map((stat) => `
              <div class="top-hero" aria-label="${escapeHtml(stat.hero)}: ${stat.wins} побед, ${stat.losses} поражений">
                ${heroMedia(stat.hero)}
                <div>
                  <span class="sr-only">${escapeHtml(stat.hero)}</span>
                  <div class="top-hero__games">${stat.games} ${pluralize(stat.games, "игра", "игры", "игр")}</div>
                  ${recordMarkup(stat.wins, stat.losses)}
                </div>
              </div>`).join("")}
          </div>
        </article>`;
    }).join("");

    return `
      <nav class="breadcrumbs" aria-label="Навигация">
        <a href="tournament-100-sinners.html">Турнир</a><span>›</span><span>${escapeHtml(team.name)}</span>
      </nav>
      ${mastheadMarkup("Команда · основной состав", team.name, "Игроки закреплены по большинству сыгранных матчей; статистика героев учитывает все их игры.", `${roster.length}\nигроков`)}
      <main>
        ${summaryStripMarkup(teamStats)}
        <section class="section" aria-labelledby="players-title">
          <div class="section__head">
            <h2 id="players-title">Игроки и топ героев</h2>
            <p class="section__note"><span class="win">Победы</span>–<span class="loss">поражения</span> на герое</p>
          </div>
          <div class="player-list">${players}</div>
        </section>
      </main>
      ${footerMarkup(data.games)}`;
  }

  function renderSeries(data) {
    const params = new URLSearchParams(window.location.search);
    const teamA = teamById(params.get("a"));
    const teamB = teamById(params.get("b"));
    if (!teamA || !teamB || teamA.id === teamB.id) {
      return emptyState("Серия не найдена", "В ссылке должны быть указаны две разные команды турнира.");
    }
    const games = gamesForSeries(data.games, teamA.name, teamB.name);
    if (!games.length) {
      return emptyState("Матчи ещё не сыграны", `${teamA.name} и ${teamB.name} пока не встречались в загруженных сериях.`);
    }

    document.title = `${teamA.name} — ${teamB.name} · Турнир 100 Грешников`;
    const winsA = games.filter((game) => winnerTeam(game) === teamA.name).length;
    const winsB = games.length - winsA;

    const cards = games.map((game, index) => {
      const scoreA = scoreForTeam(game, teamA.name);
      const scoreB = scoreForTeam(game, teamB.name);
      return `
        <a class="match-card" href="${matchUrl(game.id)}">
          <span class="match-card__number">Матч ${index + 1}</span>
          <span>
            <span class="match-card__score">${scoreA}:${scoreB}</span>
            <span class="match-card__meta">${escapeHtml(game.game.duration)} · ${escapeHtml(game.teams.radiant)} Radiant / ${escapeHtml(game.teams.dire)} Dire</span>
          </span>
          <span class="match-card__winner">Победитель: ${escapeHtml(winnerTeam(game))}</span>
        </a>`;
    }).join("");

    return `
      <nav class="breadcrumbs" aria-label="Навигация">
        <a href="tournament-100-sinners.html">Турнир</a><span>›</span><span>${escapeHtml(teamA.name)} × ${escapeHtml(teamB.name)}</span>
      </nav>
      ${mastheadMarkup("Очная серия", `${teamA.name} × ${teamB.name}`, `${games.length} ${pluralize(games.length, "матч", "матча", "матчей")} в турнирном архиве.`, `${winsA}–${winsB}\nсерия`)}
      <main>
        <div class="series-scoreboard" aria-label="Счёт серии ${winsA}:${winsB}">
          <div class="series-scoreboard__team">${escapeHtml(teamA.name)}</div>
          <div class="series-scoreboard__score">${winsA}–${winsB}</div>
          <div class="series-scoreboard__team">${escapeHtml(teamB.name)}</div>
        </div>
        <section class="section" aria-labelledby="matches-title">
          <div class="section__head"><h2 id="matches-title">Матчи серии</h2><p class="section__note">Откройте полную статистику игры</p></div>
          <div class="match-list">${cards}</div>
        </section>
      </main>
      ${footerMarkup(data.games)}`;
  }

  function playersTableMarkup(game, side) {
    const teamName = game.teams[side];
    const rows = game.players[side].map((player) => `
      <tr>
        <td class="player-name">${escapeHtml(player.nickname)}</td>
        <td>${heroMedia(player.hero)}</td>
        <td class="kda">${player.kda.kills} / ${player.kda.deaths} / ${player.kda.assists}</td>
        <td class="gold">${numberFormat.format(player.gold)}</td>
      </tr>`).join("");
    return `
      <section class="side-panel side-panel--${side}" aria-labelledby="${side}-title">
        <div class="side-panel__head">
          <h2 id="${side}-title">${escapeHtml(teamName)}</h2>
          <span class="side-panel__side">${side}</span>
        </div>
        <table class="players-table">
          <caption class="sr-only">Игроки команды ${escapeHtml(teamName)}</caption>
          <thead><tr><th>Игрок</th><th>Герой</th><th>K / D / A</th><th>Золото</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </section>`;
  }

  function renderMatch(data) {
    const params = new URLSearchParams(window.location.search);
    const matchId = params.get("id");
    const game = data.games.find((item) => item.id === matchId);
    if (!game) return emptyState("Матч не найден", "Проверьте идентификатор матча или откройте игру со страницы серии.");

    const radiantTeam = teamByName(game.teams.radiant);
    const direTeam = teamByName(game.teams.dire);
    document.title = `${game.teams.radiant} ${game.game.score.radiant}:${game.game.score.dire} ${game.teams.dire}`;
    const winningSide = game.game.winner.toLowerCase();
    const winner = winnerTeam(game);

    return `
      <nav class="breadcrumbs" aria-label="Навигация">
        <a href="tournament-100-sinners.html">Турнир</a><span>›</span>
        <a href="${seriesUrl(radiantTeam, direTeam)}">${escapeHtml(game.teams.radiant)} × ${escapeHtml(game.teams.dire)}</a><span>›</span>
        <span>${escapeHtml(game.id)}</span>
      </nav>
      ${mastheadMarkup("Turbo · подробности матча", `${game.teams.radiant} × ${game.teams.dire}`, `Победитель: ${winner}. Все показатели перенесены с итогового табло.`, game.game.duration)}
      <main>
        <div class="match-scoreboard">
          <div class="match-scoreboard__side">
            <div class="match-scoreboard__team">${escapeHtml(game.teams.radiant)}</div>
            <div class="match-scoreboard__label">Radiant</div>
            ${winningSide === "radiant" ? '<span class="winner-flag">Победа</span>' : ""}
          </div>
          <div class="match-scoreboard__center">
            <div class="match-scoreboard__score">${game.game.score.radiant}:${game.game.score.dire}</div>
            <div class="match-scoreboard__duration">${escapeHtml(game.game.duration)}</div>
          </div>
          <div class="match-scoreboard__side">
            <div class="match-scoreboard__team">${escapeHtml(game.teams.dire)}</div>
            <div class="match-scoreboard__label">Dire</div>
            ${winningSide === "dire" ? '<span class="winner-flag">Победа</span>' : ""}
          </div>
        </div>
        <div class="match-sides">
          ${playersTableMarkup(game, "radiant")}
          ${playersTableMarkup(game, "dire")}
        </div>
      </main>
      ${footerMarkup(data.games)}`;
  }

  function validateData(data) {
    if (!data || !Array.isArray(data.games)) throw new Error("В JSON отсутствует список games");
    data.games.forEach((game) => {
      if (!game.id || !game.teams || !game.game || !game.players) throw new Error("Некорректная структура матча");
      ["radiant", "dire"].forEach((side) => {
        if (!Array.isArray(game.players[side]) || game.players[side].length !== 5) {
          throw new Error(`${game.id}: на стороне ${side} должно быть пять игроков`);
        }
      });
    });
  }

  function installImageFallback() {
    document.addEventListener("error", (event) => {
      const image = event.target;
      if (!(image instanceof HTMLImageElement) || !image.matches("[data-hero-image]")) return;
      image.closest(".hero-media")?.classList.add("is-missing");
    }, true);
  }

  async function init() {
    installImageFallback();
    const app = document.getElementById("app");
    if (!app) return;
    try {
      const response = await fetch(DATA_URL, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      validateData(data);
      const page = document.body.dataset.page;
      const renderers = { home: renderHome, team: renderTeam, series: renderSeries, match: renderMatch };
      if (!renderers[page]) throw new Error("Неизвестный тип страницы");
      app.innerHTML = renderers[page](data);
      app.removeAttribute("aria-busy");
    } catch (error) {
      console.error(error);
      app.innerHTML = emptyState("Не удалось загрузить турнир", "JSON с результатами недоступен. Обновите страницу или попробуйте позже.");
      app.removeAttribute("aria-busy");
    }
  }

  window.TournamentData = { TEAMS, HERO_SLUGS, aggregateHeroStats, getTeamStats, primaryTeamByPlayer };
  document.addEventListener("DOMContentLoaded", init);
})();
