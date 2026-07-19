#!/usr/bin/env python3
"""Build and validate the parsed Turbo tournament match dataset."""

from __future__ import annotations

import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "data" / "tournament-games.json"


def player(nickname: str, hero: str, kills: int, deaths: int, assists: int, gold: int) -> dict:
    return {
        "nickname": nickname,
        "hero": hero,
        "kda": {"kills": kills, "deaths": deaths, "assists": assists},
        "gold": gold,
    }


def match(
    match_id: str,
    radiant_team: str,
    dire_team: str,
    duration: str,
    radiant_score: int,
    dire_score: int,
    winner: str,
    radiant_players: list[dict],
    dire_players: list[dict],
) -> dict:
    minutes, seconds = map(int, duration.split(":"))
    return {
        "id": match_id,
        "teams": {"radiant": radiant_team, "dire": dire_team},
        "game": {
            "mode": "Turbo",
            "duration": duration,
            "duration_seconds": minutes * 60 + seconds,
            "score": {"radiant": radiant_score, "dire": dire_score},
            "winner": winner,
        },
        "players": {"radiant": radiant_players, "dire": dire_players},
    }


p = player

GAMES = [
    match(
        "j4-vs-allseeing-1", "J4", "Всефидящие", "47:47", 42, 36, "Dire",
        [
            p("123", "Invoker", 9, 3, 24, 51552),
            p("maxemot [PRMIR]", "Sniper", 9, 5, 17, 50367),
            p("Устал тащить", "Witch Doctor", 10, 10, 19, 35072),
            p("squall", "Skywrath Mage", 5, 8, 13, 25302),
            p("Mc_KFC", "Tidehunter", 9, 10, 21, 31051),
        ],
        [
            p("@katanaflow", "Anti-Mage", 13, 3, 9, 57605),
            p("qonsth", "Lifestealer", 7, 8, 13, 62681),
            p("HOLO [Bonk]", "Jakiro", 2, 12, 19, 32104),
            p("BaHa [CBO]", "Lion", 4, 12, 19, 33960),
            p("местная табуретка", "Phantom Assassin", 10, 7, 16, 53984),
        ],
    ),
    match(
        "j4-vs-allseeing-2", "Всефидящие", "J4", "19:59", 26, 16, "Radiant",
        [
            p("местная табуретка", "Legion Commander", 2, 2, 18, 19390),
            p("BaHa [CBO]", "Pudge", 6, 4, 13, 18730),
            p("HOLO [Bonk]", "Zeus", 3, 4, 15, 14301),
            p("@katanaflow", "Void Spirit", 10, 2, 6, 31848),
            p("qonsth", "Sand King", 5, 4, 9, 24584),
        ],
        [
            p("123", "Keeper of the Light", 4, 6, 6, 18084),
            p("Устал тащить", "Silencer", 2, 6, 9, 9386),
            p("epremches", "Axe", 4, 7, 3, 13082),
            p("maxemot [PRMIR]", "Phantom Assassin", 3, 4, 2, 11216),
            p("squall", "Windranger", 2, 3, 4, 9550),
        ],
    ),
    match(
        "j4-vs-allseeing-3", "J4", "Всефидящие", "22:01", 33, 43, "Dire",
        [
            p("123", "Pudge", 13, 9, 10, 26848),
            p("Устал тащить", "Witch Doctor", 6, 10, 15, 18719),
            p("squall", "Nature's Prophet", 5, 5, 12, 24016),
            p("epremches", "Viper", 6, 12, 19, 20360),
            p("maxemot [PRMIR]", "Phantom Assassin", 3, 7, 6, 19570),
        ],
        [
            p("@katanaflow", "Slark", 13, 6, 8, 29511),
            p("BaHa [CBO]", "Ember Spirit", 3, 7, 17, 21119),
            p("HOLO [Bonk]", "Zeus", 8, 6, 21, 23269),
            p("qonsth", "Sand King", 7, 10, 11, 27165),
            p("местная табуретка", "Snapfire", 9, 4, 14, 28168),
        ],
    ),
    match(
        "dogs-vs-j4-1", "Пес Дюк", "J4", "33:03", 25, 29, "Dire",
        [
            p("Магистр стиралки [ПЫЛ]", "Jakiro", 3, 7, 11, 20866),
            p("DAI MNE SILU", "Earthshaker", 5, 8, 10, 31140),
            p("Chief Penetrator [PRMIR]", "Snapfire", 9, 4, 8, 25651),
            p("ZED [РАЙ]", "Terrorblade", 5, 4, 6, 28674),
            p("nmf", "Ogre Magi", 3, 6, 9, 36001),
        ],
        [
            p("123", "Lina", 9, 6, 16, 34420),
            p("@katanaflow", "Beastmaster", 7, 4, 16, 25546),
            p("squall", "Pugna", 1, 8, 9, 16372),
            p("maxemot [PRMIR]", "Phantom Assassin", 8, 4, 7, 43862),
            p("Mc_KFC", "Tidehunter", 3, 3, 17, 27495),
        ],
    ),
    match(
        "dogs-vs-j4-2", "J4", "Пес Дюк", "29:13", 10, 28, "Dire",
        [
            p("squall", "Pugna", 0, 7, 8, 13086),
            p("Mc_KFC", "Tidehunter", 0, 4, 8, 18483),
            p("123", "Tinker", 6, 4, 3, 28784),
            p("@katanaflow", "Vengeful Spirit", 1, 5, 10, 20448),
            p("maxemot [PRMIR]", "Phantom Assassin", 3, 8, 1, 24093),
        ],
        [
            p("DAI MNE SILU", "Earthshaker", 10, 2, 16, 40516),
            p("Chief Penetrator [PRMIR]", "Doom", 5, 2, 8, 27158),
            p("Магистр стиралки [ПЫЛ]", "Jakiro", 2, 4, 8, 22408),
            p("nmf", "Ogre Magi", 3, 2, 10, 26931),
            p("ZED [РАЙ]", "Phantom Lancer", 7, 0, 5, 43267),
        ],
    ),
    match(
        "allseeing-vs-dogs-1", "Пес Дюк", "Всефидящие", "31:25", 29, 26, "Dire",
        [
            p("Магистр стиралки [ПЫЛ]", "Ogre Magi", 3, 5, 17, 17381),
            p("Chief Penetrator [PRMIR]", "Necrophos", 10, 5, 9, 28025),
            p("ZED [РАЙ]", "Spectre", 3, 3, 17, 33145),
            p("ЖЕНЯ ДАНЖЕР", "Weaver", 10, 4, 11, 29087),
            p("DAI MNE SILU", "Undying", 3, 9, 17, 18738),
        ],
        [
            p("@katanaflow", "Skywrath Mage", 8, 4, 10, 38241),
            p("местная табуретка", "Snapfire", 7, 7, 13, 23155),
            p("qonsth", "Ursa", 11, 6, 9, 41196),
            p("HOLO [Bonk]", "Slark", 0, 6, 19, 21062),
            p("голос свыше [ATEL]", "Ember Spirit", 0, 6, 18, 21999),
        ],
    ),
    match(
        "allseeing-vs-dogs-2", "Всефидящие", "Пес Дюк", "26:58", 11, 32, "Dire",
        [
            p("голос свыше [ATEL]", "Lich", 0, 11, 5, 11109),
            p("HOLO [Bonk]", "Slark", 1, 7, 6, 12532),
            p("местная табуретка", "Hoodwink", 5, 4, 4, 15735),
            p("qonsth", "Ursa", 4, 6, 2, 32134),
            p("@katanaflow", "Invoker", 1, 4, 5, 26499),
        ],
        [
            p("DAI MNE SILU", "Keeper of the Light", 8, 3, 15, 27597),
            p("Chief Penetrator [PRMIR]", "Bristleback", 3, 3, 22, 29082),
            p("ZED [РАЙ]", "Void Spirit", 16, 2, 6, 42832),
            p("ЖЕНЯ ДАНЖЕР", "Riki", 4, 1, 14, 19147),
            p("Магистр стиралки [ПЫЛ]", "Jakiro", 0, 2, 23, 20898),
        ],
    ),
    match(
        "allseeing-vs-dogs-3", "Пес Дюк", "Всефидящие", "58:54", 41, 35, "Radiant",
        [
            p("Магистр стиралки [ПЫЛ]", "Jakiro", 8, 11, 25, 59501),
            p("Chief Penetrator [PRMIR]", "Doom", 10, 10, 20, 64210),
            p("ZED [РАЙ]", "Phantom Lancer", 9, 1, 22, 105437),
            p("ЖЕНЯ ДАНЖЕР", "Riki", 6, 7, 17, 42008),
            p("DAI MNE SILU", "Earthshaker", 6, 6, 26, 61369),
        ],
        [
            p("@katanaflow", "Morphling", 18, 0, 7, 105535),
            p("qonsth", "Ursa", 10, 11, 8, 80281),
            p("HOLO [Bonk]", "Undying", 2, 14, 14, 42278),
            p("местная табуретка", "Kunkka", 4, 8, 21, 50952),
            p("голос свыше [ATEL]", "Techies", 1, 11, 12, 33089),
        ],
    ),
    match(
        "kittens-vs-j4-1", "J4", "Котята", "33:12", 49, 26, "Radiant",
        [
            p("123", "Tinker", 24, 6, 12, 49179),
            p("местная табуретка", "Spirit Breaker", 5, 4, 29, 26662),
            p("maxemot [PRMIR]", "Phantom Assassin", 9, 5, 15, 41500),
            p("Устал тащить", "Grimstroke", 10, 4, 30, 34860),
            p("Mc_KFC", "Tidehunter", 1, 7, 19, 20296),
        ],
        [
            p("epremches", "Medusa", 2, 6, 16, 31572),
            p("антон [антон]", "Bristleback", 2, 11, 22, 27069),
            p("Chop Chop", "Sniper", 11, 11, 7, 36002),
            p("головорез97 [NGR0d]", "Necrophos", 3, 13, 19, 27408),
            p("anitkacs [PRMIR]", "Lich", 8, 8, 10, 25573),
        ],
    ),
    match(
        "kittens-vs-j4-2", "Котята", "J4", "20:11", 17, 32, "Dire",
        [
            p("Chop Chop", "Sniper", 5, 10, 8, 15171),
            p("epremches", "Sven", 4, 6, 5, 20769),
            p("головорез97 [NGR0d]", "Weaver", 1, 6, 8, 10508),
            p("антон [антон]", "Axe", 5, 7, 6, 12978),
            p("anitkacs [PRMIR]", "Lich", 2, 3, 6, 8545),
        ],
        [
            p("123", "Necrophos", 17, 2, 7, 38092),
            p("maxemot [PRMIR]", "Phantom Assassin", 9, 4, 6, 28355),
            p("местная табуретка", "Spirit Breaker", 2, 4, 20, 16113),
            p("Mc_KFC", "Tidehunter", 2, 2, 11, 16538),
            p("Устал тащить", "Grimstroke", 2, 5, 24, 19543),
        ],
    ),
    match(
        "kittens-vs-j4-3", "J4", "Котята", "27:03", 45, 20, "Radiant",
        [
            p("123", "Storm Spirit", 10, 5, 19, 37296),
            p("Устал тащить", "Witch Doctor", 10, 4, 19, 27181),
            p("Mc_KFC", "Undying", 3, 7, 16, 23813),
            p("maxemot [PRMIR]", "Phantom Assassin", 11, 1, 8, 42943),
            p("местная табуретка", "Snapfire", 11, 3, 19, 30357),
        ],
        [
            p("epremches", "Luna", 3, 7, 6, 24385),
            p("головорез97 [NGR0d]", "Invoker", 8, 8, 8, 21909),
            p("anitkacs [PRMIR]", "Lich", 4, 7, 4, 11811),
            p("антон [антон]", "Axe", 1, 12, 10, 13152),
            p("Chop Chop", "Sniper", 3, 11, 9, 27092),
        ],
    ),
    match(
        "kittens-vs-dogs-1", "Котята", "Пес Дюк", "21:02", 0, 39, "Dire",
        [
            p("головорез97 [NGR0d]", "Necrophos", 0, 17, 0, 15066),
            p("anitkacs [PRMIR]", "Lich", 0, 10, 0, 5743),
            p("epremches", "Axe", 0, 8, 0, 9810),
            p("Chop Chop", "Sniper", 0, 7, 0, 14607),
            p("eclipse [-Arma]", "Spirit Breaker", 0, 7, 0, 9291),
        ],
        [
            p("Магистр стиралки [ПЫЛ]", "Winter Wyvern", 9, 0, 17, 24063),
            p("DAI MNE SILU", "Magnus", 2, 0, 17, 18138),
            p("ZED [РАЙ]", "Phantom Assassin", 14, 0, 10, 32271),
            p("ЖЕНЯ ДАНЖЕР", "Rubick", 10, 0, 10, 20805),
            p("Chief Penetrator [PRMIR]", "Chaos Knight", 4, 0, 14, 21455),
        ],
    ),
    match(
        "kittens-vs-dogs-2", "Пес Дюк", "Котята", "34:43", 36, 20, "Radiant",
        [
            p("Магистр стиралки [ПЫЛ]", "Winter Wyvern", 10, 6, 22, 38256),
            p("Chief Penetrator [PRMIR]", "Chaos Knight", 7, 2, 11, 39259),
            p("DAI MNE SILU", "Earthshaker", 2, 6, 21, 37719),
            p("ZED [РАЙ]", "Spectre", 10, 3, 18, 45800),
            p("ЖЕНЯ ДАНЖЕР", "Rubick", 7, 3, 22, 39437),
        ],
        [
            p("eclipse [-Arma]", "Mars", 3, 8, 9, 26380),
            p("epremches", "Medusa", 2, 6, 4, 41674),
            p("anitkacs [PRMIR]", "Lich", 3, 6, 8, 13826),
            p("Chop Chop", "Snapfire", 7, 9, 10, 25109),
            p("головорез97 [NGR0d]", "Viper", 5, 7, 9, 25103),
        ],
    ),
    match(
        "kittens-vs-dogs-3", "Котята", "Пес Дюк", "19:14", 15, 32, "Dire",
        [
            p("головорез97 [NGR0d]", "Slardar", 4, 5, 4, 14954),
            p("eclipse [-Arma]", "Doom", 4, 6, 7, 17282),
            p("anitkacs [PRMIR]", "Lich", 2, 5, 3, 9203),
            p("Chop Chop", "Lion", 3, 9, 4, 8430),
            p("epremches", "Sniper", 1, 7, 4, 12824),
        ],
        [
            p("Chief Penetrator [PRMIR]", "Chaos Knight", 8, 2, 7, 21311),
            p("ZED [РАЙ]", "Phantom Assassin", 11, 3, 11, 25363),
            p("DAI MNE SILU", "Magnus", 3, 3, 16, 18556),
            p("Магистр стиралки [ПЫЛ]", "Winter Wyvern", 6, 4, 14, 17116),
            p("ЖЕНЯ ДАНЖЕР", "Rubick", 4, 3, 18, 16438),
        ],
    ),
    match(
        "kittens-vs-otodraniki-1", "Котята", "Отодраники", "24:00", 34, 23, "Radiant",
        [
            p("Chop Chop", "Sniper", 7, 4, 19, 31344),
            p("головорез97 [NGR0d]", "Viper", 11, 6, 17, 29440),
            p("epremches", "Axe", 6, 5, 11, 23069),
            p("eclipse [-Arma]", "Magnus", 4, 3, 24, 21425),
            p("anitkacs [PRMIR]", "Lich", 6, 5, 6, 16820),
        ],
        [
            p("RUSSIAN VODKA", "Death Prophet", 7, 4, 2, 22980),
            p("4AIHUK", "Clockwerk", 3, 9, 10, 15384),
            p("Чепуха", "Kez", 8, 7, 4, 21331),
            p("Дима лучший Батон [#414A]", "Bane", 1, 8, 13, 11651),
            p("VATRUWKA [PRMIR]", "Drow Ranger", 4, 6, 8, 21656),
        ],
    ),
    match(
        "kittens-vs-otodraniki-2", "Отодраники", "Котята", "30:34", 37, 36, "Dire",
        [
            p("Дима лучший Батон [#414A]", "Bane", 3, 7, 21, 16674),
            p("4AIHUK", "Ogre Magi", 1, 9, 17, 24443),
            p("RUSSIAN VODKA", "Axe", 2, 8, 17, 24610),
            p("Чепуха", "Kez", 23, 5, 3, 42896),
            p("VATRUWKA [PRMIR]", "Juggernaut", 7, 7, 15, 36943),
        ],
        [
            p("epremches", "Centaur Warrunner", 4, 11, 21, 27620),
            p("anitkacs [PRMIR]", "Lich", 3, 7, 14, 19964),
            p("головорез97 [NGR0d]", "Invoker", 9, 5, 19, 37610),
            p("eclipse [-Arma]", "Magnus", 0, 8, 32, 24000),
            p("Chop Chop", "Drow Ranger", 19, 6, 12, 46836),
        ],
    ),
    match(
        "kittens-vs-otodraniki-3", "Котята", "Отодраники", "25:08", 29, 28, "Radiant",
        [
            p("Chop Chop", "Drow Ranger", 6, 5, 15, 29090),
            p("eclipse [-Arma]", "Marci", 3, 6, 17, 17817),
            p("головорез97 [NGR0d]", "Viper", 10, 4, 11, 26682),
            p("epremches", "Axe", 7, 9, 7, 21537),
            p("anitkacs [PRMIR]", "Lich", 2, 4, 7, 14135),
        ],
        [
            p("VATRUWKA [PRMIR]", "Windranger", 7, 5, 3, 20811),
            p("4AIHUK", "Lion", 1, 8, 8, 12823),
            p("Чепуха", "Spectre", 11, 4, 10, 31626),
            p("Дима лучший Батон [#414A]", "Tusk", 3, 6, 22, 20417),
            p("RUSSIAN VODKA", "Death Prophet", 4, 7, 7, 21316),
        ],
    ),
]


def validate(games: list[dict]) -> list[str]:
    warnings: list[str] = []
    assert len(games) == 17, f"expected 17 games, got {len(games)}"
    ids = [game["id"] for game in games]
    assert len(ids) == len(set(ids)), "duplicate game ids"

    for game in games:
        duration = game["game"]["duration"]
        minutes, seconds = map(int, duration.split(":"))
        assert 0 <= seconds < 60
        assert game["game"]["duration_seconds"] == minutes * 60 + seconds
        assert game["game"]["winner"] in {"Radiant", "Dire"}

        for side in ("radiant", "dire"):
            players = game["players"][side]
            assert len(players) == 5, f"{game['id']} {side}: expected 5 players"
            for parsed in players:
                assert parsed["nickname"] and parsed["hero"]
                assert isinstance(parsed["gold"], int) and parsed["gold"] >= 0
                assert set(parsed["kda"]) == {"kills", "deaths", "assists"}
                assert all(isinstance(value, int) and value >= 0 for value in parsed["kda"].values())

            parsed_kills = sum(parsed["kda"]["kills"] for parsed in players)
            expected_kills = game["game"]["score"][side]
            if parsed_kills != expected_kills:
                warnings.append(
                    f"{game['id']} {side}: player kills {parsed_kills} != score {expected_kills}"
                )

    return warnings


if __name__ == "__main__":
    warnings = validate(GAMES)
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(
        json.dumps({"schema_version": 1, "games": GAMES}, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(GAMES)} fully populated games to {OUTPUT}")
    for warning in warnings:
        print(f"WARNING: {warning}")
