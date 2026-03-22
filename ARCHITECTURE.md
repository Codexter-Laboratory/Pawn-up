# Chess Stats Dashboard - Clean Architecture

## 📁 Project Structure

This project has been refactored from a single 1178-line file into a clean, modular architecture following React best practices.

### 🎯 Key Improvements

- **Before**: 1178 lines in a single `page.tsx` file
- **After**: Modular components with clear separation of concerns
- **Benefits**: Maintainable, testable, reusable, and easier to understand

## 📂 File Organization

### `/src/components/` - UI Components
```
components/
├── layout.tsx              # Layout shell components
├── UserInput.tsx           # Username input and action buttons
├── ErrorMessage.tsx        # Error display component
├── StatCards.tsx           # Statistics cards display
├── PlayerProfile.tsx       # Player profile information
├── PuzzleRushPerformance.tsx # Puzzle Rush chart and stats
├── GamesGraph.tsx          # Games rating chart
├── CurrentGames.tsx        # Current active games
├── ToMoveGames.tsx         # Games requiring user's move
├── Clubs.tsx               # Club memberships
├── Tournaments.tsx         # Tournament history
├── TeamMatches.tsx         # Team match history
├── RecentSnapshots.tsx     # Recent puzzle rush snapshots
└── index.ts                # Component exports
```

### `/src/hooks/` - Business Logic
```
hooks/
├── useChessData.ts         # Main data fetching hook (11KB)
├── useChessCalculations.ts # Data processing and calculations
└── index.ts                # Hook exports
```

### `/src/app/` - Next.js Pages
```
app/
├── page.tsx                # Main page (now ~150 lines)
├── page-backup.tsx         # Original file backup
├── layout.tsx              # Next.js layout
└── api/                    # API routes (unchanged)
```

## 🏗️ Architecture Pattern

### 1. **Separation of Concerns**
- **Components**: Only handle UI and presentation
- **Hooks**: Handle data fetching and business logic
- **Types**: Centralized TypeScript interfaces

### 2. **Custom Hooks Pattern**
```tsx
// Main data hook
const chessData = useChessData();

// Calculations hook
const { puzzleRushSummary, attemptsChart, ratingChart } = useChessCalculations(
  chessData.stats, 
  chessData.data, 
  chessData.games
);
```

### 3. **Component Composition**
```tsx
<AppShell>
  <AppHeader>
    <UserInput />
    <ErrorMessage />
  </AppHeader>
  <AppMain>
    <PlayerProfile />
    <StatCards />
    <div className="grid2">
      <PuzzleRushPerformance />
      <GamesGraph />
    </div>
    {/* Other sections... */}
  </AppMain>
</AppShell>
```

## 🔄 Data Flow

1. **User Input** → `useChessData.refreshAll()`
2. **API Calls** → Parallel data fetching
3. **State Updates** → Component re-renders
4. **Calculations** → `useChessCalculations()`
5. **UI Updates** → Clean component rendering

## 📊 Component Sizes

| Component | Lines | Purpose |
|-----------|-------|---------|
| `useChessData.ts` | ~400 | All data fetching logic |
| `PuzzleRushPerformance.tsx` | ~150 | Puzzle Rush chart |
| `CurrentGames.tsx` | ~130 | Active games table |
| `PlayerProfile.tsx` | ~100 | Profile display |
| `page.tsx` | ~150 | Main page composition |

## 🎨 Benefits

### ✅ **Maintainability**
- Each component has a single responsibility
- Easy to locate and modify specific features
- Clear dependency relationships

### ✅ **Reusability**
- Components can be reused in different contexts
- Hooks can be shared across pages
- Types are centralized and consistent

### ✅ **Testing**
- Each component can be unit tested independently
- Hooks can be tested with mock data
- Easier to write integration tests

### ✅ **Performance**
- Smaller bundle sizes with tree shaking
- Better code splitting opportunities
- Optimized re-renders with proper memoization

### ✅ **Developer Experience**
- Faster navigation with smaller files
- Clear file naming conventions
- Easier onboarding for new developers

## 🚀 Usage

```tsx
// Import everything from hooks
import { useChessData, useChessCalculations } from '@/hooks';

// Import components
import { PlayerProfile, PuzzleRushPerformance } from '@/components';

// Use in components
const chessData = useChessData();
const calculations = useChessCalculations(chessData.stats, chessData.data, chessData.games);
```

## 📝 Migration Notes

- Original `page.tsx` backed up as `page-backup.tsx`
- All functionality preserved
- No breaking changes to API endpoints
- CSS and styling unchanged
- Same user experience with cleaner code

This refactoring transforms a monolithic component into a scalable, maintainable architecture while preserving all existing functionality.
