# Cozy showcase — Game Design Doc (draft v0.1)
Modes Designer, 2026-11-18. Docs only. Source: CEO decisions 16 Nov 2026 (and 17:53 answers, via CoS). Anything marked *Proposed* is not yet a CEO decision.

## Pitch
You are a healer alchemist running a two-floor shop: shop downstairs, home upstairs. Grow herbs, brew potions, serve townsfolk, supply the adventurers' guild, and sneak into wild places for rare ingredients. First TileEngine showcase game, made in the maker from project data.

## Core loop (one day)
Wake upstairs > tend crops > brew > open shop (NPCs visit, buy, sell) > take or hand in quests > optional stealth run for rare ingredients > sleep (autosave, day rolls over, guild results next morning).

## Systems
- **Quests**: objective-style checklists with deadlines and tiers. One optional stealth run per objective; ingredients can also come from stock or the general shop.
- **Planting**: timers, day/night cycle (night boosts growth), inventory, loot.
- **Alchemy**: recipes from ingredients; potion tier from ingredient quality.
- **NPC shops**: vendors with fixed stock and prices; your counter is the same menu reversed. Exercises the behaviour system (walk, queue, buy, leave, schedules).
- **Guild**: guild NPCs buy potions through a quest; adventurers go out, success odds fixed at departure, results shown next day. Adventurers can die; the player never dies.
- **Reputation**: counters that shift who visits and what is asked.
- **Stealth**: four turn-based stages (wolves, lurkers) to gather herbs and ore. You go, then every enemy moves one tile toward its objective tile (BTF you-go-I-go + anniversary rule). Caught = you flee and lose some carried loot.
- **Saves**: autosave at doors, stairs and sleep; quitting mid-stealth restarts that stage. Exported game keeps player saves on the device.

## World
Town with the two-floor shop, NPC shops and the guild; four stealth stages reached by town gates. *Proposed*: stage themes forest edge, deep wood, cave, ruins.

## Art and content
Starter-kit art per the 12 Nov Starter Pack v2 decision (CEO Grok Imagine art, free hub pack; built-in library stays Kenney-only). All numbers live in project data as editable defaults.

## Out of scope for the showcase
Combat, permadeath for the player, real-time stealth, online features.

## Open (*Proposed*, need CEO)
Session length per in-game day; starting recipes/crops count; stealth stage themes.
