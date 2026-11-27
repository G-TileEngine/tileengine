Step F1 look kit, r2 (one must-fix). Read docs/qa/step-f1-handback-review.md (QA's r1 review) and the guide docs/maker/steps/step-f1-look-kit.md (r3b, 9d7ecff2) again; everything in it still holds.
Branch: new branch step/step-f1-look-kit-r2-chatA from main 04dadacfc40d81d17b21df8f96ef1e11f9d2dbaa. Bring your r1 code commit d0689c2c across unchanged (cherry-pick it), then make the one fix below in the same code commit.
M1: tools/maker/icons.ts lines 2-17 (the 16 PATHS entries) become exactly these 16 lines, byte for byte. These are UX's drawings from the trial (Ruling 5, L119). Change nothing else in any code file.
```
  play: `<path d="M8 5l11 7-11 7z" fill="currentColor"/>`,
  undo: `<path d="M9 14L4 9l5-5"/><path d="M4 9h10a6 6 0 010 12h-3"/>`,
  more: `<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>`,
  back: `<path d="M15 6l-6 6 6 6"/>`,
  save: `<path d="M5 3h11l3 3v15H5z"/><path d="M8 3v5h7V3M8 21v-7h8v7"/>`,
  build: `<path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 17v3h16v-3"/>`,
  rules: `<path d="M5 21V4"/><path d="M5 4h12l-2 4 2 4H5"/>`,
  image: `<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M21 16l-5-5-8 8"/>`,
  grid: `<path d="M4 4h16v16H4zM4 10h16M4 15h16M10 4v16M15 4v16"/>`,
  units: `<circle cx="12" cy="7" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>`,
  stages: `<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>`,
  effects: `<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5L18 18M6 18l2.5-2.5M15.5 8.5L18 6"/>`,
  levels: `<path d="M12 3l2.7 5.6 6.1.8-4.4 4.3 1 6.1L12 17l-5.4 2.8 1-6.1L3.2 9.4l6.1-.8z"/>`,
  edit: `<path d="M4 20h4L19 9l-4-4L4 16z"/>`,
  plus: `<path d="M12 5v14M5 12h14"/>`,
  resize: `<path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/>`,
```
Done means: code head tree b9676b64899b3cbe727d9e69032472ed73309415; npm run green 1188 pass / 0 fail; tools tsc only the 3 base errors; plants-f1.py 29/29; shipped test 83ef2acf unchanged; all 25 smokes PASS solo; export audit 136/150/150; counted lines 289+85 = 374; the tap-path shots (a)-(g) re-taken at 390x844 and 360 (g in both states), beside f01 and f04.
Hand back at handback/step-f1-look-kit/r2/HANDBACK.md as the branch's last commit, with the code head sha and the tip sha in § Green, and § Helpers & self-review. Push once, the same way as r1.
