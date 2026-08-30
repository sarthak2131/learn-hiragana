Completely redesign and polish the existing Hiragana Mastery website into a premium, production-quality Japanese learning application.

IMPORTANT:

Do NOT make this a simple CSS/color update.

You are allowed and expected to change the structure, layout, component hierarchy, spacing, sizing, interaction patterns, and visual presentation wherever necessary.

Keep the existing functionality and learning logic working, but redesign the UI/UX so the entire product feels intentional, cohesive, modern, premium, interactive, and finished.

The final website should feel like a real Japanese learning product, not a generic dashboard made from repeated cards.

The design must work perfectly in both DARK MODE and LIGHT MODE.

Use ONE coherent Indigo-based visual identity throughout the entire application.

---

# 1. OVERALL DESIGN GOAL

The website should communicate:

- Japanese learning
- active recall
- practice
- progress
- focus
- mastery
- interactive games

The visual style should be:

- premium
- clean
- modern
- calm
- focused
- slightly game-like
- educational
- polished
- responsive

Avoid:

- generic dashboard appearance
- excessive cards
- excessive pills
- random colors
- giant empty spaces
- repetitive layouts
- oversized containers
- unnecessary gradients
- excessive shadows
- childish game UI
- inconsistent component styling

The interface should feel like ONE complete product.

---

# 2. BRAND COLOR SYSTEM

Use a monochromatic Indigo system as the primary visual identity.

Primary:

#6366F1

Primary Hover:

#818CF8

Primary Pressed:

#4F46E5

Soft Indigo:

rgba(99,102,241,0.10)

Selected Indigo:

rgba(99,102,241,0.14)

Do NOT use pink, purple, orange, green, cyan, and yellow as separate decorative UI colors.

Use Indigo consistently for:

- active navigation
- primary buttons
- selected cards
- progress
- matching
- audio controls
- interactive elements
- chart highlights
- selected answers
- hover states
- focus states
- success feedback
- important badges

Only use restrained red for genuine error states.

---

# 3. DARK MODE

Use:

Background:

#080A12

Page Surface:

#0B0E18

Card Surface:

#111522

Elevated Surface:

#171C2D

Interactive Surface:

#0D1120

Border:

#252B40

Hover Border:

#343B58

Primary:

#6366F1

Primary Hover:

#818CF8

Primary Pressed:

#4F46E5

Main Text:

#F8FAFC

Secondary Text:

#A8B0C2

Muted Text:

#737D94

The dark mode must feel soft and premium.

Do not use pure black.

---

# 4. LIGHT MODE

Create a proper light theme.

Do NOT simply turn the dark interface white.

Use:

Background:

#F5F7FF

Main Surface:

#FFFFFF

Secondary Surface:

#EEF2FF

Border:

#D9DDF0

Primary:

#4F46E5

Primary Hover:

#4338CA

Main Text:

#151827

Secondary Text:

#475069

Muted Text:

#69738A

All components must have proper light-mode states.

Cards, inputs, buttons, tiles, navigation, progress bars, selected states and hover states must all remain visually coherent.

---

# 5. GLOBAL APPLICATION SHELL

Create one consistent application shell across all pages.

Desktop content width:

1120–1200px maximum.

Center the application.

Use a consistent spacing system:

8px
12px
16px
20px
24px
32px
40px
48px

Do not randomly use different spacing values.

All major sections should align to the same content grid.

---

# 6. HEADER REDESIGN

Create a clean compact application header.

Structure:

Logo / Hiragana Mastery

Home
Practice
Chart
Stats
Write

Right side:

Font
Sound
Theme
Streak
Goal
Settings

The header must remain consistent throughout the website.

Active navigation:

- Indigo background
- white text
- subtle transition

Inactive navigation:

- muted text

Hover:

- soft Indigo background
- slight text brightening

Do not turn every navigation item into a huge pill.

Keep the header compact and professional.

---

# 7. TYPOGRAPHY

Use a clean modern UI font such as Inter or the existing equivalent.

Page title:

32–40px
700–800 weight

Section title:

20–24px
700 weight

Card title:

16–18px
700 weight

Body:

14–15px

Helper:

12–13px

Japanese characters must always receive strong visual hierarchy.

Do not make Hiragana characters look like secondary information.

---

# 8. BUTTON SYSTEM

Create reusable button styles.

Primary:

- Indigo background
- white text

Secondary:

- surface background
- border

Ghost:

- transparent
- subtle hover

Icon button:

- 40–44px square

Every interactive button must support:

- default
- hover
- active
- focus
- disabled
- loading

Hover:

translateY(-1px)

Pressed:

scale(0.98)

Transitions:

150–200ms

---

# 9. DO NOT OVERUSE CARDS

This is one of the most important changes.

Do not put every piece of content inside a card.

Use:

- cards for grouped information
- tiles for game interactions
- buttons for actions
- sections for organization
- plain text for labels

Avoid:

card inside card inside card.

Use visual hierarchy through spacing, typography, borders, surfaces and positioning instead.

---

# 10. DO NOT OVERUSE PILLS

Use pill-shaped elements only for:

- small status
- filters
- compact metadata

Do not make every:

- button
- card
- tile
- control

a pill.

Most components should use approximately 10–14px corner radius.

---

# 11. PRACTICE CONFIGURATION PAGE

Redesign the practice configuration page into a clear step-based experience.

Use:

01 Game Mode
02 Character Rows
03 Session Settings
04 Start Practice

The user should immediately understand what they are configuring.

Do not create huge empty spaces between sections.

---

# 12. GAME MODE SECTION

The game mode section contains:

- Read It
- Build It
- Rapid True / False
- Sequence Memory
- Ear Training
- Pure Recall
- Write It
- Match Up
- Spot Difference
- Speed Recall
- Mixed Challenge

Keep a desktop 3-column layout where appropriate.

But redesign every game card.

Each card should contain:

Icon
Game Name
Short category/direction
One-line explanation
Subtle action indicator

Example:

Read It
Character → Sound
See a character and select its sound.

The hierarchy must be clear.

---

# 13. GAME MODE CARD DESIGN

Normal:

- dark/light surface
- subtle border
- clean radius

Hover:

- translateY(-2px)
- Indigo border
- subtle shadow
- icon slightly brightens
- arrow moves slightly right

Selected:

- 2px Indigo border
- subtle Indigo-tinted background
- check indicator
- Indigo icon

Do not turn the entire selected card into a bright purple block.

---

# 14. CHARACTER ROW SELECTION

Redesign the character row selection area.

Current concept:

ROW A
あいうえお
checkbox

should become a polished learning selection tile.

Example structure:

ROW A

あ   い   う   え   お
a   i   u   e   o

checkbox/check indicator

The Hiragana characters must be the visual focus.

The row name should be secondary.

The selection control should be integrated naturally into the tile.

---

# 15. CHARACTER ROW HOVER

On hover:

- card moves up approximately 2px
- border becomes Indigo
- Japanese characters slightly brighten
- selection indicator becomes more visible

Do not make the entire card jump aggressively.

---

# 16. CHARACTER ROW SELECTED STATE

Selected row:

- 2px Indigo border
- soft Indigo background
- visible check icon
- subtle glow

When selected:

1. border appears
2. background tint appears
3. check icon scales from 0.7 → 1
4. selected count updates

Animation:

150–250ms.

---

# 17. SELECT ALL / CLEAR ALL

Replace weak text-only controls with compact utility actions.

Use:

Select all
Clear

They should be visually secondary.

When Select All is used:

- all character rows animate into selected state
- check indicators appear
- selected count updates

Do not create excessive animation.

---

# 18. SELECTED COUNT

Show:

Choose Character Rows

1 / 11 selected

Update the number smoothly when selections change.

---

# 19. QUESTION COUNT

Do not place four tiny options inside a giant empty card.

Use a compact segmented control:

Question Count

[10] [20] [30] [50]

Selected:

Indigo background
white text

Unselected:

surface
secondary text

The entire component should be compact.

---

# 20. PRACTICE FONT STYLE

Use:

Practice Font

[ Kyokasho ] [ Mincho ] [ Gothic ]

Also show a small live preview:

あいうえお

The preview should update immediately when the font changes.

Use a subtle transition.

---

# 21. CONFIGURATION SUMMARY

Create a compact final summary.

Example:

READY TO PRACTICE

Match Up
Row N
20 Questions
Kyokasho

[ Start Practice → ]

The user should know exactly what is about to start.

---

# 22. MATCH UP GAME — MAJOR REDESIGN

Match Up must be redesigned as a real game board.

Do NOT use a huge empty container.

Do NOT leave a large blank area below the column headings.

The tiles must occupy the available space naturally.

---

# 23. MATCH UP HEADER

Create a focused game HUD.

Example:

MATCH THE HIRAGANA

Match each character with its correct sound.

3 / 5 matched

TIME 12s
MOVES 4

Reset

Keep the HUD compact.

Do not use giant bright timer pills.

---

# 24. MATCH UP BOARD STRUCTURE

Use two clearly defined columns:

HIRAGANA

and

SOUND

Each side should contain matching tiles.

Example:

HIRAGANA                         SOUND

[   な   ]                       [ "na" ]

[   ぬ   ]                       [ "nu" ]

[   の   ]                       [ "no" ]

The two columns must be aligned.

---

# 25. MATCH UP TILE

Tiles should feel like actual interactive game pieces.

Desktop:

approximately 150–180px wide
70–82px high

Japanese character:

36–44px

Sound:

18–22px

Normal:

- surface background
- subtle border
- 10–14px radius

Do not create giant empty cards.

---

# 26. MATCH UP TILE HOVER

Hover:

- Indigo border
- translateY(-2px)
- subtle shadow
- slight character/text brightness

Transition:

150–200ms.

---

# 27. MATCH UP CLICK INTERACTION

The main interaction must work through simple clicking/tapping.

Flow:

Click Hiragana tile
→ tile becomes selected

Click sound tile
→ evaluate pair

This must work perfectly without requiring drag-and-drop.

---

# 28. MATCH UP DRAG-AND-DROP

Also support drag-and-drop on desktop.

Dragging:

- tile slightly scales up
- stronger shadow
- subtle elevation
- cursor changes

Drop target:

- Indigo border
- soft Indigo background
- subtle pulse

The user must clearly understand where the tile can be dropped.

---

# 29. MATCH UP SELECTED TILE

Selected tile:

- 2px Indigo border
- soft Indigo background
- subtle focus ring

Do not make selected tiles neon.

---

# 30. MATCH UP CORRECT MATCH ANIMATION

Correct match:

selected
→ visual connection
→ Indigo success pulse
→ check icon
→ small scale/pop
→ tile fades/slides away
→ remaining tiles smoothly reposition

Duration:

300–450ms.

Do not instantly delete matched tiles.

---

# 31. MATCH UP INCORRECT MATCH

Wrong match:

- brief restrained red outline
- small horizontal shake
- return to normal

Duration:

250–350ms.

Do not leave the tile permanently red.

---

# 32. MATCH UP PROGRESS

Show:

3 / 5 matched

and a progress bar.

Use Indigo.

Animate progress smoothly after every correct match.

---

# 33. MATCHED PAIRS

Place matched pairs below the main board.

Use:

Matched Pairs

[ ぬ ↔ "nu" 🔊 ]
[ ね ↔ "ne" 🔊 ]
[ の ↔ "no" 🔊 ]

Use neutral surfaces and subtle Indigo borders.

Do not use bright green pills.

---

# 34. MATCHED PAIR AUDIO

Clicking the speaker plays pronunciation.

While playing:

- speaker animates
- tiny audio-wave indicator appears

Use Indigo.

Respect the global Sound On/Off state.

---

# 35. MATCH UP COMPLETION

After all matches:

✓ COMPLETE

Perfect Match!

5 / 5 matched

Time
18s

Moves
7

Accuracy
100%

[ Play Again ]
[ Back to Practice ]

Use Indigo visual language.

Do not use rainbow gradients.

Do not use giant multicolor celebration graphics.

A subtle Indigo particle/sparkle effect is acceptable.

---

# 36. PURE RECALL

Redesign Pure Recall around memory focus.

Structure:

Question 1 of 20

PURE RECALL

Type the answer from memory.

               ね

Type the sound
(romanization)

[ Type the sound... ] [ Check ]

The Hiragana character must be the hero element.

---

# 37. PURE RECALL CHARACTER AREA

Do not create an enormous empty container.

Use a focused recall panel.

Character:

72–100px depending on viewport.

The surrounding area should be visually calm.

---

# 38. PURE RECALL TIMER

Use a compact segmented control:

[ Off ] [ 3s ] [ 5s ] [ 10s ] [ 15s ]

Selected:

Indigo

Do not use yellow/orange.

---

# 39. PURE RECALL AUDIO

Use a secondary Indigo audio button:

[ 🔊 Play ]

When playing:

[ 🔊 Playing... ]

Add a subtle audio animation.

---

# 40. PURE RECALL INPUT

Input height:

56–60px

Normal:

surface + border

Focus:

Indigo border
Indigo focus ring

Placeholder:

Type the sound...

Do not use yellow/orange focus styling.

---

# 41. PURE RECALL CHECK BUTTON

Disabled:

muted surface

Enabled:

Indigo + white

Loading:

spinner + Checking...

Hover:

lighter Indigo

Pressed:

darker Indigo

---

# 42. PURE RECALL FEEDBACK

Correct:

✓ Correct

ね = ne

Use subtle Indigo success feedback.

Incorrect:

Not quite

Correct answer: ne

Use restrained red only for actual error feedback.

Animate feedback with a small fade/slide.

---

# 43. READ IT GAME

Create a focused question layout.

Question 1 of 20

READ IT — CHARACTER → SOUND

What sound does this character make?

              ね

Example: 猫 (neko)

[ 🔊 Play Sound ]

[ ne ] [ se ]

[ fu ] [ ru ]

Use a 2×2 answer grid on desktop.

---

# 44. READ IT CHARACTER AREA

Do not use a giant empty card.

Make the character the hero.

Japanese character:

80–110px

Use a subtle Indigo-tinted surface.

---

# 45. READ IT ANSWER BUTTONS

Equal height.

Approximately:

60–72px.

Normal:

surface + border

Hover:

Indigo border
slight elevation

Selected:

Indigo background
white text

Correct:

Indigo success animation
check icon

Incorrect:

restrained red
small shake

---

# 46. QUESTION PROGRESS

Use:

×                         Question 1 of 20

████████░░░░░░░░░░░░░░      5%

The progress bar should use Indigo.

Question number and percentage should update smoothly.

---

# 47. QUESTION TRANSITIONS

When moving between questions:

Current question:

fade + slight horizontal movement

Next question:

fade in + slight movement into place

Duration:

200–300ms.

Do not use dramatic transitions.

---

# 48. GAME START

For speed-based games:

3
2
1
GO

For normal games:

Ready?
Start

Keep the transition short.

---

# 49. HOVER SYSTEM

Every clickable component must have a clear hover state.

This includes:

- navigation
- buttons
- game cards
- character rows
- answer choices
- chart tiles
- audio buttons
- matched pairs
- settings
- controls

Use subtle motion.

Do not animate static content.

---

# 50. FOCUS / KEYBOARD

All interactive elements must support keyboard navigation.

Use a visible Indigo focus ring.

Do not remove accessibility focus.

---

# 51. TOUCH INTERACTION

Minimum interactive target:

44×44px.

Prefer 48–56px for major controls.

Drag-and-drop must always have a click/tap alternative.

---

# 52. LOADING STATES

Create consistent loading states.

Audio:

Loading audio...

Answer:

Checking...

Session:

Starting...

Use a small Indigo spinner.

Never freeze the entire interface.

---

# 53. TOASTS

Create a consistent toast system.

Examples:

✓ Practice started
✓ Font changed
✓ Row selected

Use Indigo styling.

Animate with:

fade + slide up

Keep toasts small.

---

# 54. EMPTY STATES

If no rows are selected:

No character rows selected

Select at least one row to continue.

[ Select Rows ]

If matched pairs are empty, show a subtle helper rather than a giant empty box.

---

# 55. ERROR STATES

Audio error:

Unable to play audio
Try again

Session error:

Could not start session
Try again

Use restrained red only for genuine errors.

---

# 56. CHART PAGE

The Hiragana chart should use the same visual language.

Each row:

ROW A

あ  い  う  え  お

Each character tile:

- Japanese character
- romaji
- hover
- focus
- audio interaction

Do not make every chart tile huge.

Rows should be compact and easy to scan.

---

# 57. CHART AUDIO

Each row can have a Play Row control.

Each character can be clicked to hear pronunciation.

Hover:

- Indigo border
- subtle elevation

Playing:

- speaker animation
- Indigo highlight

---

# 58. WRITE PAGE

The writing experience must use the same visual system.

Canvas should be the primary focus.

Controls should be secondary.

Use:

- clear
- undo
- redo
- check
- next

with consistent buttons.

The character prompt should use the selected practice font.

---

# 59. STATS PAGE

Use Indigo-based charts.

Do not use rainbow graphs.

Use:

- Indigo primary data
- neutral grid
- clear labels
- subtle hover tooltips

Stats should feel analytical and clean.

---

# 60. HOME PAGE

Home should have:

Hero
Practice modes
Today's goal
Current font
Progress

The hero should not dominate the entire screen.

The user should quickly reach practice.

Primary CTA:

Start Practicing

Secondary:

View Hiragana Chart

---

# 61. HOME GAME CARDS

Use the same GameCard component used by Practice.

Do not create completely different card styles.

Consistency is important.

---

# 62. ANIMATION SYSTEM

Use subtle, purposeful motion.

Cards:

translateY(-2px)

Buttons:

translateY(-1px)

Pressed:

scale(.98)

Selection:

small pulse

Checkbox:

scale .7 → 1

Progress:

smooth width animation

Correct:

pop + fade

Incorrect:

shake

Audio:

small waveform

Page/question:

fade + small translation

Theme:

200–300ms crossfade

Do not make the entire website constantly move.

---

# 63. REDUCED MOTION

Respect:

prefers-reduced-motion.

When enabled:

- remove particles
- reduce movement
- shorten transitions
- avoid large transforms

Keep state changes understandable.

---

# 64. THEME SWITCHING

Theme switching must affect:

- page background
- cards
- tiles
- text
- borders
- inputs
- buttons
- navigation
- progress
- charts
- game boards

Use a smooth 200–300ms transition.

Persist the selected theme.

---

# 65. RESPONSIVE DESIGN

Desktop:

- spacious
- centered
- structured

Tablet:

- reduce columns where necessary

Mobile:

- single-column where required
- compact header
- touch-friendly controls
- no horizontal overflow
- no tiny text
- no nested scrolling where avoidable

Do not simply shrink the desktop UI.

Reflow it intelligently.

---

# 66. MOBILE MATCH UP

On mobile, prioritize tap interaction.

Flow:

Tap Hiragana
→ selected
→ tap sound
→ match

Tiles should be large enough for fingers.

No tiny drag handles.

---

# 67. MOBILE READ IT

If a 2×2 grid becomes cramped, switch to a single-column answer layout.

Never make answer buttons too narrow.

---

# 68. MOBILE PURE RECALL

Use:

Character
↓
Input
↓
Check

or input + check side-by-side when there is enough width.

---

# 69. MOBILE CHARACTER ROWS

Keep row cards readable.

Hiragana must remain prominent.

Checkboxes must be easy to tap.

---

# 70. CONSISTENT INTERACTION LANGUAGE

Across the entire app:

Selected = Indigo

Hover = Indigo emphasis

Focus = Indigo ring

Primary action = Indigo

Success = Indigo success treatment

Error = restrained red

Disabled = muted

Do not introduce unrelated colors for the same interaction state.

---

# 71. SPACING AND ALIGNMENT QA

Fix all:

- inconsistent margins
- inconsistent card widths
- misaligned headings
- uneven columns
- oversized gaps
- tiny gaps
- misaligned buttons
- misaligned Japanese characters
- inconsistent checkbox placement
- inconsistent section widths

Everything should align to a consistent grid.

---

# 72. REMOVE VISUAL CLUTTER

Remove unnecessary:

- duplicate labels
- repeated instructions
- decorative pills
- unnecessary borders
- excessive shadows
- oversized empty cards
- redundant buttons
- repeated text

For example, do not repeat:

Drag or tap
Drag or drop
Drop Target

everywhere.

One clear instruction is enough.

---

# 73. VISUAL HIERARCHY RULE

Every screen must answer these questions immediately:

1. What am I doing?
2. What do I need to look at?
3. What do I need to click/type?
4. What happened after I interacted?

If any screen fails this, redesign it.

---

# 74. CONSISTENT COMPONENT LIBRARY

Create reusable components:

AppShell
Header
PageHeader
SectionHeader
Button
IconButton
GameCard
CharacterRowCard
CharacterTile
MatchTile
AnswerOption
ProgressBar
SegmentedControl
AudioButton
GameHUD
MatchedPair
CompletionCard
Toast
Tooltip
StatCard

Do not duplicate styles unnecessarily.

---

# 75. COMPONENT STATES

Where relevant, every component should support:

default
hover
active
selected
focus
disabled
loading
success
error

States must look related across the whole application.

---

# 76. PERFORMANCE

Prefer lightweight CSS transitions and existing animation infrastructure.

Do not introduce heavy libraries unnecessarily.

Do not animate hundreds of elements continuously.

Keep scrolling smooth.

---

# 77. ACCESSIBILITY

Implement:

- semantic buttons
- keyboard navigation
- visible focus
- ARIA labels where needed
- readable contrast
- large touch targets
- reduced motion
- keyboard alternative to drag-and-drop

---

# 78. FINAL VISUAL STANDARD

The final application should NOT look like:

“many cards placed on a page.”

It should look like:

“A carefully designed Japanese learning platform.”

The visual hierarchy should come from:

- typography
- spacing
- surface levels
- borders
- Indigo emphasis
- interaction
- animation

NOT from adding more colors.

---

# 79. IMPORTANT: YOU ARE ALLOWED TO CHANGE STRUCTURE

If the current structure is causing poor UI:

CHANGE IT.

Examples:

If a large card should become a compact control → change it.

If two sections should be combined → combine them.

If one section should be split → split it.

If Match Up needs a completely different board layout → rebuild it.

If Pure Recall needs a smaller character panel → change it.

If Read It needs a better answer layout → change it.

If Character Rows need a better selection system → change it.

Do not preserve a bad layout simply because it already exists.

---

# 80. DO NOT CHANGE FUNCTIONAL LOGIC UNNECESSARILY

Keep existing:

- game logic
- scoring
- question generation
- audio functionality
- character data
- selected rows
- question counts
- font selection
- progress tracking
- theme persistence
- navigation

working correctly.

Improve the presentation and interaction without breaking the underlying functionality.

---

# 81. FINAL QA PASS

After implementing everything, independently inspect the entire application.

Check every page in:

Dark Desktop
Dark Mobile
Light Desktop
Light Mobile

Check:

- spacing
- alignment
- typography
- contrast
- buttons
- hover
- active
- selected
- disabled
- loading
- success
- error
- animations
- responsiveness
- keyboard interaction
- touch interaction
- audio interaction
- Match Up drag/drop
- Match Up click matching
- question transitions
- theme switching

Fix any obvious issue yourself.

Do not stop after making the basic redesign.

---

# FINAL REQUIREMENT

The result must feel like a polished, premium, cohesive Hiragana learning application.

It should be visually impressive without becoming flashy.

It should be interactive without becoming distracting.

It should be game-like without becoming childish.

It should be educational without looking like a boring dashboard.

Use one coherent Indigo visual language across the entire product.

If an existing UI element looks awkward, oversized, empty, repetitive, badly aligned, outdated, or unnecessary, redesign or replace it.

Do not leave obvious UI/UX problems for later.

Finish the entire experience to a production-quality standard.