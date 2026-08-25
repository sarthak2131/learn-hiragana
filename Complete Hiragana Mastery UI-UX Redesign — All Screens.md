Completely redesign and polish the entire **Hiragana Mastery / Active Recall Studio** interface shown in the current implementation.

The goal is NOT to simply change a few colors or card sizes. Create a consistent, premium, modern Japanese-learning-game design system and apply it across:

1. Home screen
2. Practice configuration screen
3. Hiragana reference chart
4. Match Up game screen

The existing dark theme can be retained, but the current UI needs stronger hierarchy, cleaner spacing, better cards, more intentional colors, better typography, and more consistent interactions.

Do NOT make the interface look like a generic dashboard. It should feel like a polished interactive learning product.

---

# 1. OVERALL DESIGN DIRECTION

The product should feel:

- Modern
- Premium
- Educational
- Game-like but not childish
- Japanese-inspired
- Clean
- Fast
- Focused
- Easy to understand

Avoid:

- Huge empty cards
- Excessive borders
- Excessive glow
- Too many different accent colors
- Tiny text
- Random spacing
- Inconsistent button sizes
- Overly rounded UI everywhere
- Excessive decorative elements

The Japanese characters should always be visually important.

The UI should communicate:

**Learn → Practice → Recall → Master**

---

# 2. GLOBAL COLOR SYSTEM

Use ONE consistent color system throughout the entire application.

Do not randomly assign different colors to every card.

## Background

Main page background:

```text
#080D17
```

Secondary/background surface:

```text
#0D1422
```

Main card:

```text
#121B2B
```

Elevated card:

```text
#172237
```

Interactive tile:

```text
#0B1220
```

## Borders

Normal border:

```text
#24324A
```

Hover border:

```text
#354563
```

Selected border:

```text
#F43F67
```

## Primary Accent

Use a warm pink/coral as the main brand accent:

```text
#F43F67
```

Use this for:

- Primary buttons
- Selected cards
- Active navigation
- Important progress
- Success confirmation
- Main interactive elements

## Secondary Accent

Use a soft orange:

```text
#FF9D2E
```

Use this sparingly for:

- Secondary highlights
- Timer emphasis
- Rewards
- Important callouts
- Gradient ending on primary CTA

## Purple Accent

Use:

```text
#8B7CFF
```

Use for:

- Secondary interactive states
- Audio/matching-related labels
- Optional learning categories

Do NOT use purple everywhere.

## Success

```text
#22C55E
```

## Error

```text
#EF4444
```

## Warning

```text
#F59E0B
```

## Text

Primary:

```text
#F8FAFC
```

Secondary:

```text
#A9B6CC
```

Muted:

```text
#71809A
```

---

# 3. GLOBAL GRADIENT

Use the brand gradient only on major CTAs and hero areas:

```text
linear-gradient(135deg, #F43F67 0%, #FF9D2E 100%)
```

Do NOT use this gradient on every card.

It should remain special.

---

# 4. TYPOGRAPHY

Use a clean modern sans-serif for English UI.

Recommended:

```text
Inter
```

or a similar modern sans-serif.

Headings:

- Bold / 700–800
- Tight line-height
- Strong contrast

Body:

- 14–16px
- Medium/regular
- Comfortable line-height

Small labels:

- 10–12px
- Medium/bold
- Uppercase only when useful
- Slight letter spacing

Japanese characters:

Use a proper Japanese font.

Keep Japanese characters visually larger than surrounding English text.

Do not mix too many fonts.

---

# 5. GLOBAL CARD SYSTEM

All cards across the application should follow one system.

Normal card:

```text
background: #121B2B
border: 1px solid #24324A
border-radius: 14px
```

Hover:

```text
border-color: #354563
transform: translateY(-1px)
```

Selected:

```text
border-color: #F43F67
background: slightly warmer/darker pink-tinted surface
```

Do not use huge shadows.

Use only subtle elevation.

---

# 6. GLOBAL BUTTON SYSTEM

## Primary button

Use for:

- Start Practicing
- Start Session
- Start Practice Session
- Play Again

Style:

```text
background: linear-gradient(135deg, #F43F67, #FF9D2E)
color: white
font-weight: 700
border-radius: 10–12px
```

Height:

```text
44–48px
```

Padding:

```text
16–22px
```

Add a subtle shadow.

## Secondary button

Use:

```text
background: #172237
border: 1px solid #354563
color: #F8FAFC
```

## Ghost button

Transparent background.

Only visible text/icon.

Use for:

- Clear All
- Reset
- minor actions

---

# 7. GLOBAL NAVIGATION

The navigation currently looks good conceptually but should be made more consistent.

Keep:

```text
Hiragana Mastery
Active Recall Studio
```

on the left.

Navigation:

```text
Home
Practice
Chart
Stats
Write
```

Use a pill-shaped active state.

Active page:

```text
background: #F43F67
color: white
```

Inactive:

```text
color: #A9B6CC
```

Hover:

```text
background: #172237
```

Keep the navigation compact.

Do not make the header too tall.

---

# 8. HOME SCREEN REDESIGN

The Home screen should feel like the main landing/dashboard of the learning product.

## Hero

Keep the hero but improve hierarchy.

Current:

```text
Master Hiragana.
One character at a time.
```

This is good and should remain the main message.

Make the heading slightly tighter and less oversized.

Use:

```text
Master Hiragana.
One character at a time.
```

The first line should be white.

The second line can use the brand gradient.

Add a subtle oversized Japanese character in the background, but make it extremely low-opacity.

Do not let it compete with the text.

## Hero buttons

Primary:

```text
Start Practicing →
```

Secondary:

```text
View Hiragana Chart
```

Keep the primary CTA clearly dominant.

---

# 9. HOME — GAME CARDS

The current 11 game cards are too repetitive.

Keep the 3-column grid, but make each card more compact and structured.

Each card should have:

```text
[Icon]                       [Category badge]

Game Name

Short one-line description

Play Game →
```

Example:

```text
┌─────────────────────────────────┐
│ [icon]              Character→Sound
│
│ Read It
│ See あ, pick sound "a"
│
│ Play Game                    →  │
└─────────────────────────────────┘
```

Do NOT put unnecessary giant empty areas inside cards.

Cards should have approximately:

```text
height: 130–145px
```

depending on content.

## Card category colors

Use only a few category colors.

Recall:

```text
#F43F67
```

Audio:

```text
#22C55E
```

Matching:

```text
#8B7CFF
```

Speed:

```text
#F59E0B
```

Writing:

```text
#22A6D5
```

Mastery:

```text
#FF9D2E
```

The category badge should be subtle and small.

Do not make the entire card that color.

---

# 10. HOME — PRACTICE GOAL

The bottom practice goal section should be cleaner.

Instead of a large empty card, use:

```text
Today's Practice Goal

0 / 20 Questions

████░░░░░░░░░░░░

0% Completed
20 questions remaining
```

Make the progress bar visually prominent.

Use the primary pink for completed progress.

Keep the card compact.

---

# 11. HOME — PRACTICE FONT

The practice font card should feel like a small settings/widget card.

Show:

```text
PRACTICE FONT

教科書体

Kyokasho
```

Then:

```text
Tap to change practice font →
```

Do not waste space.

The Japanese font preview should be the main visual element.

---

# 12. PRACTICE CONFIGURATION SCREEN

The Practice Configuration screen currently contains too many large cards.

Keep the sections, but improve the hierarchy.

Top:

```text
PRACTICE SESSION

Configure Practice Session

Select game mode, character rows to practice,
and target question count.
```

The Start Session button should sit on the right on desktop.

On mobile, move it below the heading.

---

# 13. GAME MODE CARDS

Current 3-column layout is fine.

Keep the grid.

But make cards smaller and more interactive.

Each card:

```text
[icon]

Game Name

Category
Short description
```

Do not put huge empty areas inside them.

Recommended height:

```text
110–125px
```

Selected Match Up card:

```text
border: 2px solid #F43F67
background: rgba(244,63,103,0.08)
```

Add a small check icon in the top-right.

Do not make the entire selected card bright pink.

Only the border and subtle background tint should communicate selection.

---

# 14. CHARACTER ROW SELECTION

This section needs better visual hierarchy.

Current cards are too large and the checkbox is too isolated.

Each row should look like a compact selectable option:

```text
┌──────────────────────────────────┐
│ ROW N                            │
│ な に ぬ ね の             ✓    │
└──────────────────────────────────┘
```

Japanese characters should be the focus.

Selected row:

```text
border: #F43F67
background: rgba(244,63,103,0.08)
```

Checkbox:

```text
background: #F43F67
```

Unselected checkbox:

```text
background: transparent
border: #354563
```

Keep:

```text
Select All | Clear All
```

at the top-right.

Make them small utility actions.

---

# 15. PRACTICE CONFIGURATION OPTIONS

The bottom section currently has:

```text
Game Mode Configuration
Practice Font Style
```

Keep these, but make them feel like compact settings cards.

For Match Up:

```text
Match Up Mode

Deck size and targets are automatically generated
from your selected character rows.
```

Font selector:

```text
Kyokasho
Mincho
Gothic
```

Use segmented controls.

Selected:

```text
background: #F43F67
color: white
```

Unselected:

```text
background: #0B1220
border: #24324A
```

---

# 16. BOTTOM START SECTION

The final CTA should be the strongest element of the configuration page.

Use:

```text
CONFIGURATION COMPLETE

Ready to Start Match Up?

1 Character Row Selected · KYOKASHO Font Style

                     [ Start Practice Session → ]
```

Keep this as a horizontal card on desktop.

On mobile stack it vertically.

Use the main gradient CTA.

---

# 17. HIRAGANA CHART REDESIGN

The current chart works functionally but feels too repetitive and vertically long.

The chart should feel like a **reference sheet**, not a collection of giant cards.

Each row should be compact.

Example:

```text
ROW A                                  Play Row
あ  いう え お

┌────┐ ┌────┐ ┌────┐ ┌────┐ ┌────┐
│ あ │ │ い │ │ う │ │ え │ │ お │
│ a  │ │ i  │ │ u  │ │ e  │ │ o  │
└────┘ └────┘ └────┘ └────┘ └────┘
```

Do NOT make each row extremely tall.

---

# 18. CHART CHARACTER TILES

Each character tile should be smaller and more elegant.

Recommended:

```text
height: 72–82px
```

The Japanese character:

```text
32–38px
```

Romaji:

```text
11–12px
```

Center both.

Normal tile:

```text
background: #0B1220
border: 1px solid #24324A
```

Hover:

```text
border: #F43F67
background: #121B2B
```

Active/playing:

```text
border: #FF9D2E
```

Do not use huge cards around each character.

---

# 19. CHART ROW CONTAINERS

Each row container should be compact.

Use:

```text
background: #121B2B
border: 1px solid #24324A
border-radius: 14px
padding: 16px
```

Header:

```text
ROW A
あ い う え お
```

Play button on right.

The row itself should not take up excessive vertical space.

---

# 20. PLAY ROW BUTTON

Make the Play Row button a secondary action.

Example:

```text
🔊 Play Row
```

Style:

```text
background: rgba(244,63,103,0.08)
border: 1px solid rgba(244,63,103,0.35)
color: #F43F67
```

When playing:

```text
background: #F43F67
color: white
```

Show a subtle animated audio indicator.

---

# 21. CHART CONTROLS

At the top:

```text
Speed:
0.5x   1x   1.5x   2x   3x
```

and:

```text
Kyokasho
Mincho
Gothic
```

Make these proper segmented controls.

Do NOT use many independent pill badges.

Selected option:

```text
background: #F43F67
color: white
```

Normal:

```text
background: #121B2B
color: #A9B6CC
```

---

# 22. MATCH UP SCREEN

The Match Up screen should be visually different from the reference chart because it is an actual game.

Do not use huge rectangular cards.

The game should be compact and focused.

Top:

```text
MATCH THE HIRAGANA

Select a character and match it with its sound.
You can also drag a character onto its matching sound.

Time: 03s
Moves: 0
```

---

# 23. MATCH UP GAME AREA

Use a central game panel.

Inside:

```text
HIRAGANA                       SOUND

   な                             "no"

   ぬ                             "na"

   の                             "ne"

   に                             "nu"

   ね                             "ni"
```

The sound column MUST be shuffled.

Do not align the correct answer in the same row every time.

---

# 24. MATCH UP TILE DESIGN

Use compact tiles:

```text
width: 160–190px
height: 72–84px
```

Desktop.

Mobile:

```text
width: 130–150px
height: 64–72px
```

Hiragana:

```text
font-size: 34–42px
```

Romaji:

```text
font-size: 18–20px
font-weight: 700
```

Tile:

```text
background: #0B1220
border: 1px solid #24324A
border-radius: 12px
```

---

# 25. MATCH UP TILE STATES

## Normal

Dark tile.

## Hover

Slightly brighter background.

## Selected

```text
border: 2px solid #F43F67
background: rgba(244,63,103,0.08)
```

## Correct

```text
border: #22C55E
background: rgba(34,197,94,0.10)
```

Add a small check icon.

## Incorrect

```text
border: #EF4444
background: rgba(239,68,68,0.08)
```

Add a very short shake animation.

---

# 26. MATCH UP INTERACTION

Support BOTH:

### Click-to-match

User clicks:

```text
な
```

Then clicks:

```text
"na"
```

If correct:

```text
success → animation → remove both
```

If wrong:

```text
error → shake → reset
```

### Drag-and-drop

User can drag:

```text
な → "na"
```

During drag:

- tile slightly scales
- shadow increases
- destination highlights
- drop target gets pink/purple outline

Click-to-match must remain the primary interaction because it is much easier on touch devices.

---

# 27. MATCH UP REMOVAL / REFLOW

When a pair is correctly matched:

Do NOT leave a blank space.

The matched pair should disappear/fade.

Remaining tiles should automatically move upward.

Example:

Before:

```text
な     na
ぬ     nu
の     no
に     ni
ね     ne
```

After matching な:

```text
ぬ     nu
の     no
に     ni
ね     ne
```

Update:

```text
4 pairs remaining
```

or:

```text
1 / 5 matched
```

---

# 28. MATCH UP PROGRESS

At the top of the game panel show:

```text
1 / 5 matched
```

with a small progress bar.

Example:

```text
████░░░░░░
```

Use:

```text
#F43F67
```

for progress.

---

# 29. MATCH UP TIMER / MOVES

Do not make the timer huge.

Use compact stats:

```text
TIME
03s

MOVES
4
```

or horizontal:

```text
⏱ 03s     Moves 4
```

Keep these secondary to the actual matching game.

---

# 30. MATCH UP COMPLETION SCREEN

After all matches:

```text
🎉 Hiragana Matched!

You matched all 5 characters.

Time       18s
Moves       7

[ Play Again ]
[ Back to Practice ]
```

Use the success green only for the success indicator.

The primary Play Again button should still use the brand gradient.

---

# 31. RESPONSIVE DESIGN

Desktop:

- centered content
- maximum width around 1100–1200px
- 3-column game grids
- compact cards

Tablet:

- 2-column grids where appropriate

Mobile:

- 1-column game cards
- stacked settings
- compact navigation
- touch-friendly controls
- Match Up tiles remain easy to tap
- no horizontal overflow

Do not simply shrink desktop components.

---

# 32. SPACING SYSTEM

Use a consistent spacing scale:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
```

Avoid arbitrary spacing values everywhere.

Major sections:

```text
32–40px
```

Card internal spacing:

```text
16–20px
```

Small gaps:

```text
8–12px
```

---

# 33. BORDER RADIUS SYSTEM

Do not make everything extremely rounded.

Use:

Buttons:

```text
10–12px
```

Cards:

```text
14px
```

Large hero:

```text
18px
```

Small controls:

```text
8–10px
```

---

# 34. ICON SYSTEM

Use one consistent icon library/style.

Do not mix random icon styles.

Icons should be:

- small
- simple
- line-based
- visually consistent

Icons should support the UI rather than become decorations.

---

# 35. ANIMATION SYSTEM

Keep animations subtle.

Hover:

```text
150ms
```

Selection:

```text
150–200ms
```

Correct match:

```text
250–350ms
```

Incorrect shake:

```text
250–400ms
```

Page transitions:

```text
200ms
```

Do NOT add excessive animations.

---

# 36. IMPORTANT CONSISTENCY RULE

The following elements must look the same across EVERY page:

- Header
- Navigation
- Primary button
- Secondary button
- Card
- Selected state
- Checkbox
- Segmented control
- Badge
- Typography
- Japanese character rendering
- Spacing
- Border radius
- Colors

Create reusable components/styles instead of styling every page independently.

For example:

```text
Button
Card
Badge
SegmentedControl
CharacterTile
ProgressBar
StatBadge
GameCard
```

Reuse them everywhere.

---

# 37. DO NOT CHANGE THE PRODUCT'S CORE FUNCTIONALITY

The redesign must preserve all existing functionality:

- Navigation
- Game selection
- Character row selection
- Select All
- Clear All
- Font switching
- Practice start
- Chart
- Audio playback
- Speed controls
- Match Up
- Timer
- Moves
- Drag and drop
- Click-to-match
- Progress
- Reset

Only improve the UI/UX and interaction presentation.

---

# 38. FINAL VISUAL PRIORITY

The final application should follow this hierarchy:

```text
BRAND
 ↓
PAGE TITLE
 ↓
MAIN ACTION
 ↓
CONTENT
 ↓
SECONDARY INFORMATION
 ↓
UTILITY ACTIONS
```

Never allow secondary information to visually compete with the main action.

---

# 39. MOST IMPORTANT CHANGES FROM THE CURRENT VERSION

Do ALL of these:

- Reduce oversized cards.
- Reduce unnecessary empty space.
- Make cards more compact.
- Use one consistent color system.
- Stop using random accent colors everywhere.
- Use pink as the primary brand color.
- Use orange only as a secondary highlight.
- Use purple/green/blue only for meaningful categories.
- Make selected states consistent.
- Make buttons consistent.
- Make typography consistent.
- Make Japanese characters larger and more important.
- Make chart rows compact.
- Make Match Up tiles compact.
- Make Home game cards compact.
- Improve Practice Configuration hierarchy.
- Improve Match Up interaction.
- Make click-to-match primary.
- Keep drag-and-drop as secondary.
- Shuffle sound tiles.
- Add proper correct/incorrect states.
- Add subtle animations.
- Add progress indicators.
- Improve responsive behavior.
- Remove unnecessary text from interactive elements.
- Remove excessive decorative borders.
- Remove excessive glow.
- Keep the interface visually calm.

The final result should look like one professionally designed product, not three separate pages made by different designers.

The design should feel closer to a polished modern learning app such as Duolingo/Anki-inspired interaction quality, but with its own distinctive **dark + coral/pink Japanese-learning identity**.

Do not redesign only the visual appearance. Improve the **information hierarchy, spacing, component consistency, interaction feedback, and usability** of all four screens together.