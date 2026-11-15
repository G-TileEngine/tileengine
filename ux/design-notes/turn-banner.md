# Turn banner ("your turn / enemy turn") style goal

## 2026-11-15: CEO reference, felnartstories SRPG clip
**Source:** https://x.com/felnartstories/status/2121666291656503583 (5 s). The clip is in /workspace/share/turn-banner/felnart-turn-switch.mp4 and the frames are in refs/turn-banner/. These are internal reference only, because the licence is unstated. The CEO's words: "the goal for the 'your turn/enemy team' style".

**What the clip shows**
- **About 0–1.5 s, player phase.** The map dims a little, with no blur or zoom. A full-width band crosses the middle in deep navy, darker at its left and right ends, with thin gold lines above and below. A large serif "PLAYER PHASE" in pale gold-white sits between two glowing diamonds. A small, widely spaced gold "TURN 03" sits above it, and a small "◆ 自軍フェイズ ◆" below. A thin diamond outline sits behind the text. Soft glowing motes drift sideways across the band. The text and band stay completely still while it holds.
- **About 1.5–2.5 s.** The band leaves fast and the dim lifts, then the map is clear for about one beat. The exact way the band leaves wasn't clear in the description (a wipe or a fade).
- **About 2.5–5 s, enemy phase.** The same layout comes back in crimson, the motes turn warm, the diamonds glint, and it holds.
- **Why it feels good:** the motion is held back (no bounce or scale), the map dims for focus, the motes add depth, the type is regal, and the smooth UI sits over pixel-art world art.

**How it fits TileEngine**
- This is a HUD kit piece (the 2026-11-13 UI kit direction). It's a HUD layout element, not an effect, and it never touches the editor's r62 look; the editor preview shows it as the game shows it.
- **Basic:** a "Turn banner" preset with a single On/Off switch, and the team colour comes from the team (player navy, enemy crimson, ally green as a guess to confirm). The text options are "Player Phase", "Your Turn" or custom, and the turn number can be on or off. Basic adds zero taps.
- **Advanced:** a speed slider (hold of about 0.8 to 1.6 s), the dim amount, motes on or off, a style picker (Regal serif like the reference, Bold, Minimal), a second-language line, and the band art (any ornate 9-slice from the kit).
- **Pixel rule:** the world stays Crisp. The banner text and lines draw at screen resolution as UI, as the reference does, which needs an EA ruling against the whole-pixel rule. A Crisp-banner option (pixel font, stepped colours) stays available.
- **Feel tie-ins:** the step 33 player can run the motes as a preset (no more than 24 particles). The dim reuses the stage dim op, and the HUD never shakes.
- **Fonts:** we must ship our own licensed serif (an OFL font such as Cinzel or Cormorant, to check) and never copy the clip's font.
- **Taps and timing:** a tap skips the banner, and repeat turns can shorten it. Auto-speed in replays skips it.

**Open:** the exit motion (frame-check the clip), whether UI may draw text at screen resolution (EA), and the ally colour and whether a "Your Turn" wording is wanted (CEO).
