# 🎮 NEON DREAM - Cyberpunk Store

## New Features Added

### ⚡ Glitch Page Transitions
- **Framer Motion Integration**: Smooth, cyberpunk-style page transitions with glitch effects
- **RGB Color Shift**: Pages transition with cyan/magenta color splitting
- **Blur & Scale Effects**: Dynamic entrance and exit animations
- **Applied to all pages**: Home, Products, Plans, About, Contact, Profile, and Wallet

### 🎯 Hacking Mini-Game

#### Game Features:
- **Floating Hack Button**: Lightning bolt (⚡) button in bottom-right corner
- **30-Second Timer**: Race against time to crack the code
- **4x4 Grid System**: 16 hexadecimal cells (0-F)
- **5-Cell Sequence**: Find the correct pattern
- **3 Attempts**: Three chances to crack the security

#### Rewards:
- **1000 Credits**: Instant credit transfer to your account
- **50% Discount**: Applied to your next purchase (overrides tier discount)

#### How to Play:
1. Click the floating lightning button
2. Read the mission briefing
3. Click "INITIATE HACK" to start
4. Select cells in the correct sequence (5 cells total)
5. Wrong selection = -1 attempt, sequence resets
6. Complete the sequence before time runs out
7. Earn your reward!

#### Visual Feedback:
- Timer turns red at 5 seconds
- Selected cells turn green with glow effect
- Success: Cells pulse green with elastic animation
- Failure: Cells dim and lock down
- Sound effects for each action

### 🛍️ Enhanced Cart System
- **Hack Discount Display**: When active, shows "⚡ HACK DISCOUNT (50%)" in red with glow
- **Automatic Clear**: Hack discount clears after successful purchase
- **Visual Distinction**: Hack discount displayed in pink (#ff0055) vs tier discount in green

## Technical Implementation

### Components Created:
- `GlitchTransition.jsx`: Framer Motion wrapper for page transitions
- `HackingGame.jsx`: Complete mini-game with timer, grid, and reward system

### Context Updates:
- Added `hackDiscountActive` state
- `activateHackDiscount()`: Activates 50% discount
- `clearHackDiscount()`: Removes discount after purchase
- Enhanced `getCartTotal()`: Prioritizes hack discount over tier discount

### Animations:
- Page entrance: Opacity 0→1, blur 10px→0, scale 0.95→1
- Page exit: Reversed with random X-axis shift
- Grid cells: Elastic bounce on success, fade on failure
- Hack button: Pulse animation, 360° rotation on hover

## Usage

### Start the Game:
```bash
npm run dev
```

### Access Hacking Game:
1. Look for the pulsing lightning button (⚡) in bottom-right
2. Click to open the hacking interface
3. Read instructions and start hacking!

### Tips:
- The sequence is random each time
- Pay attention to your remaining attempts
- Time management is crucial
- Use the hack discount wisely - it clears after one purchase

## Keyboard Shortcuts:
- Click cells to select (no keyboard input for grid)
- ESC or click outside modal to close game

## Technologies Used:
- **Framer Motion**: Page transitions and animations
- **GSAP**: Grid animations and timer effects
- **React Context**: State management for rewards
- **Web Audio API**: Sound effects for game actions

---

Enjoy hacking the mainframe! 🎮✨
