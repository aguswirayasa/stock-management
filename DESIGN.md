# Design System: Stock Management Multivariation (Zapier-Inspired)
**Project ID:** N/A (Local Next.js Project)

# Design System Inspired by Zapier

## 1. Visual Theme & Atmosphere

Zapier's website radiates warm, approachable professionalism. It rejects the cold monochrome minimalism of developer tools in favor of a cream-tinted canvas (`#fffefb`) that feels like unbleached paper -- the digital equivalent of a well-organized notebook. The near-black (`#201515`) text has a faint reddish-brown warmth, creating an atmosphere more human than mechanical. This is automation designed to feel effortless, not technical.

The typographic system is a deliberate interplay of two distinct personalities. **Degular Display** -- a geometric, wide-set display face -- handles hero-scale headlines at 56-80px with medium weight (500) and extraordinarily tight line-heights (0.90), creating headlines that compress vertically like stacked blocks. **Inter** serves as the workhorse for everything else, from section headings to body text and navigation, with fallbacks to Helvetica and Arial. **GT Alpina**, an elegant thin-weight serif with aggressive negative letter-spacing (-1.6px to -1.92px), makes occasional appearances for softer editorial moments. This three-font system gives Zapier the ability to shift register -- from bold and punchy (Degular) to clean and functional (Inter) to refined and literary (GT Alpina).

The brand's signature orange (`#ff4f00`) is unmistakable -- a vivid, saturated red-orange that sits precisely between traffic-cone urgency and sunset warmth. It's used sparingly but decisively: primary CTA buttons, active state underlines, and accent borders. Against the warm cream background, this orange creates a color relationship that feels energetic without being aggressive.

**Key Characteristics:**
- Warm cream canvas (`#fffefb`) instead of pure white -- organic, paper-like warmth
- Near-black with reddish undertone (`#201515`) -- text that breathes rather than dominates
- Degular Display for hero headlines at 0.90 line-height -- compressed, impactful, modern
- Inter as the universal UI font across all functional typography
- GT Alpina for editorial accents -- thin-weight serif with extreme negative tracking
- Zapier Orange (`#ff4f00`) as the single accent -- vivid, warm, sparingly applied
- Warm neutral palette: borders (`#c5c0b1`), muted text (`#939084`), surface tints (`#eceae3`)
- 8px base spacing system with generous padding on CTAs (20px 24px)
- Border-forward design: `1px solid` borders in warm grays define structure over shadows

## 2. Color Palette & Roles

### Primary
- **Zapier Black** (`#201515`): Primary text, headings, dark button backgrounds. A warm near-black with reddish undertones -- never cold.
- **Cream White** (`#fffefb`): Page background, card surfaces, light button fills. Not pure white; the yellowish warmth is intentional.
- **Off-White** (`#fffdf9`): Secondary background surface, subtle alternate tint. Nearly indistinguishable from cream white but creates depth.

### Brand Accent
- **Zapier Orange** (`#ff4f00`): Primary CTA buttons, active underline indicators, accent borders. The signature color -- vivid and warm.

### Neutral Scale
- **Dark Charcoal** (`#36342e`): Secondary text, footer text, border color for strong dividers. A warm dark gray-brown with 70% opacity variant.
- **Warm Gray** (`#939084`): Tertiary text, muted labels, timestamp-style content. Mid-range with greenish-warm undertone.
- **Sand** (`#c5c0b1`): Primary border color, hover state backgrounds, divider lines. The backbone of Zapier's structural elements.
- **Light Sand** (`#eceae3`): Secondary button backgrounds, light borders, subtle card surfaces.
- **Mid Warm** (`#b5b2aa`): Alternate border tone, used on specific span elements.

### Interactive
- **Orange CTA** (`#ff4f00`): Primary action buttons and active tab underlines.
- **Dark CTA** (`#201515`): Secondary dark buttons with sand hover state.
- **Light CTA** (`#eceae3`): Tertiary/ghost buttons with sand hover.
- **Link Default** (`#201515`): Standard link color, matching body text.
- **Hover Underline**: Links remove `text-decoration: underline` on hover (inverse pattern).

### Overlay & Surface
- **Semi-transparent Dark** (`rgba(45, 45, 46, 0.5)`): Overlay button variant, backdrop-like elements.
- **Pill Surface** (`#fffefb`): White pill buttons with sand borders.

### Shadows & Depth
- **Inset Underline** (`rgb(255, 79, 0) 0px -4px 0px 0px inset`): Active tab indicator -- orange underline using inset box-shadow.
- **Hover Underline** (`rgb(197, 192, 177) 0px -4px 0px 0px inset`): Inactive tab hover -- sand-colored underline.

## 3. Typography Rules

### Font Families
- **Display**: `Degular Display` -- wide geometric display face for hero headlines
- **Primary**: `Inter`, with fallbacks: `Helvetica, Arial`
- **Editorial**: `GT Alpina` -- thin-weight serif for editorial moments
- **System**: `Arial` -- fallback for form elements and system UI

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display Hero XL | Degular Display | 80px (5.00rem) | 500 | 0.90 (tight) | normal | Maximum impact, compressed block |
| Display Hero | Degular Display | 56px (3.50rem) | 500 | 0.90-1.10 (tight) | 0-1.12px | Primary hero headlines |
| Display Hero SM | Degular Display | 40px (2.50rem) | 500 | 0.90 (tight) | normal | Smaller hero variant |
| Display Button | Degular Display | 24px (1.50rem) | 600 | 1.00 (tight) | 1px | Large CTA button text |
| Section Heading | Inter | 48px (3.00rem) | 500 | 1.04 (tight) | normal | Major section titles |
| Editorial Heading | GT Alpina | 48px (3.00rem) | 250 | normal | -1.92px | Thin editorial headlines |
| Editorial Sub | GT Alpina | 40px (2.50rem) | 300 | 1.08 (tight) | -1.6px | Editorial subheadings |
| Sub-heading LG | Inter | 36px (2.25rem) | 500 | normal | -1px | Large sub-sections |
| Sub-heading | Inter | 32px (2.00rem) | 400 | 1.25 (tight) | normal | Standard sub-sections |
| Sub-heading MD | Inter | 28px (1.75rem) | 500 | normal | normal | Medium sub-headings |
| Card Title | Inter | 24px (1.50rem) | 600 | normal | -0.48px | Card headings |
| Body Large | Inter | 20px (1.25rem) | 400-500 | 1.00-1.20 (tight) | -0.2px | Feature descriptions |
| Body Emphasis | Inter | 18px (1.13rem) | 600 | 1.00 (tight) | normal | Emphasized body text |
| Body | Inter | 16px (1.00rem) | 400-500 | 1.20-1.25 | -0.16px | Standard reading text |
| Body Semibold | Inter | 16px (1.00rem) | 600 | 1.16 (tight) | normal | Strong labels |
| Button | Inter | 16px (1.00rem) | 600 | normal | normal | Standard buttons |
| Button SM | Inter | 14px (0.88rem) | 600 | normal | normal | Small buttons |
| Caption | Inter | 14px (0.88rem) | 500 | 1.25-1.43 | normal | Labels, metadata |
| Caption Upper | Inter | 14px (0.88rem) | 600 | normal | 0.5px | Uppercase section labels |
| Micro | Inter | 12px (0.75rem) | 600 | 0.90-1.33 | 0.5px | Tiny labels, often uppercase |
| Micro SM | Inter | 13px (0.81rem) | 500 | 1.00-1.54 | normal | Small metadata text |

### Principles
- **Three-font system, clear roles**: Degular Display commands attention at hero scale only. Inter handles everything functional. GT Alpina adds editorial warmth sparingly.
- **Compressed display**: Degular at 0.90 line-height creates vertically compressed headline blocks that feel modern and architectural.
- **Weight as hierarchy signal**: Inter uses 400 (reading), 500 (navigation/emphasis), 600 (headings/CTAs). Degular uses 500 (display) and 600 (buttons).
- **Uppercase for labels**: Section labels (like "01 / Colors") and small categorization use `text-transform: uppercase` with 0.5px letter-spacing.
- **Negative tracking for elegance**: GT Alpina uses -1.6px to -1.92px letter-spacing for its thin-weight editorial headlines.

## 4. Component Stylings

### Buttons

**Primary Orange**
- Background: `#ff4f00`
- Text: `#fffefb`
- Padding: 8px 16px
- Radius: 4px
- Border: `1px solid #ff4f00`
- Use: Primary CTA ("Start free with email", "Sign up free")

**Primary Dark**
- Background: `#201515`
- Text: `#fffefb`
- Padding: 20px 24px
- Radius: 8px
- Border: `1px solid #201515`
- Hover: background shifts to `#c5c0b1`, text to `#201515`
- Use: Large secondary CTA buttons

**Light / Ghost**
- Background: `#eceae3`
- Text: `#36342e`
- Padding: 20px 24px
- Radius: 8px
- Border: `1px solid #c5c0b1`
- Hover: background shifts to `#c5c0b1`, text to `#201515`
- Use: Tertiary actions, filter buttons

**Pill Button**
- Background: `#fffefb`
- Text: `#36342e`
- Padding: 0px 16px
- Radius: 20px
- Border: `1px solid #c5c0b1`
- Use: Tag-like selections, filter pills

**Overlay Semi-transparent**
- Background: `rgba(45, 45, 46, 0.5)`
- Text: `#fffefb`
- Radius: 20px
- Hover: background becomes fully opaque `#2d2d2e`
- Use: Video play buttons, floating actions

**Tab / Navigation (Inset Shadow)**
- Background: transparent
- Text: `#201515`
- Padding: 12px 16px
- Shadow: `rgb(255, 79, 0) 0px -4px 0px 0px inset` (active orange underline)
- Hover shadow: `rgb(197, 192, 177) 0px -4px 0px 0px inset` (sand underline)
- Use: Horizontal tab navigation

### Cards & Containers
- Background: `#fffefb`
- Border: `1px solid #c5c0b1` (warm sand border)
- Radius: 5px (standard), 8px (featured)
- No shadow elevation by default -- borders define containment
- Hover: subtle border color intensification

### Inputs & Forms
- Background: `#fffefb`
- Text: `#201515`
- Border: `1px solid #c5c0b1`
- Radius: 5px
- Focus: border color shifts to `#ff4f00` (orange)
- Placeholder: `#939084`

### Navigation
- Clean horizontal nav on cream background
- Zapier logotype left-aligned, 104x28px
- Links: Inter 16px weight 500, `#201515` text
- CTA: Orange button ("Start free with email")
- Tab navigation uses inset box-shadow underline technique
- Mobile: hamburger collapse

### Image Treatment
- Product screenshots with `1px solid #c5c0b1` border
- Rounded corners: 5-8px
- Dashboard/workflow screenshots prominent in feature sections
- Light gradient backgrounds behind hero content

### Distinctive Components

**Workflow Integration Cards**
- Display connected app icons in pairs
- Arrow or connection indicator between apps
- Sand border containment
- Inter weight 500 for app names

**Stat Counter**
- Large display number using Inter 48px weight 500
- Muted description below in `#36342e`
- Used for social proof metrics

**Social Proof Icons**
- Circular icon buttons: 14px radius
- Sand border: `1px solid #c5c0b1`
- Used for social media follow links in footer

## 5. Layout Principles

### Spacing System
- Base unit: 8px
- Scale: 1px, 4px, 6px, 8px, 10px, 12px, 16px, 20px, 24px, 32px, 40px, 48px, 56px, 64px, 72px
- CTA buttons use generous padding: 20px 24px for large, 8px 16px for standard
- Section padding: 64px-80px vertical on desktop
- Section padding reduces to 40px-48px on mobile
- Page-level padding:
  - Mobile: 16px
  - Tablet: 24px
  - Desktop: 32px
- Form spacing:
  - Mobile: 16px vertical gap between fields
  - Desktop: 20px-24px vertical gap between grouped sections
- Bottom navigation spacing:
  - Mobile pages must include enough bottom padding so fixed bottom nav never overlaps content
  - Recommended: `pb-24` or equivalent

### Grid & Container
- Max content width: approximately 1200px-1280px
- General app pages should use a centered container with responsive padding
- Auth pages should use a narrow container: 400px-480px max width
- Form-heavy pages should use 720px-960px max width
- Table-heavy pages such as SKU Matrix and Stock History may use the full available content width
- Dashboard pages should use responsive card grids:
  - Mobile: 1 column
  - Mobile large / tablet: 2 columns
  - Desktop: 3-4 columns
- Product lists:
  - Desktop: table or dense list layout
  - Mobile: stacked product cards
- SKU Matrix:
  - Desktop: full table layout
  - Mobile: card-based vertical list
- Forms:
  - Mobile: stacked, full-width fields
  - Desktop: 2-column only when fields are short and logically related
- Avoid stretching forms too wide on large desktop screens. Use max-width constraints for readability.

### App Shell Layout
- Desktop layout uses a persistent left sidebar starting at `md` breakpoint.
- Mobile layout uses a fixed bottom navigation.
- The desktop sidebar may be collapsible but should remain discoverable.
- The mobile bottom navigation should prioritize the most frequent workflows:
  - Dashboard
  - Products
  - Stock Out
  - Stock In
  - More / Account
- Do not use desktop sidebar on mobile.
- Do not rely on a hamburger menu as the only access to core stock workflows.
- Active navigation should use Zapier Orange sparingly, such as an active indicator or inset underline.
- Sidebar and bottom nav should keep the same warm cream background and sand border style.

### Page Layout Behavior
- Each page should begin with a clear page header:
  - Page title
  - Short supporting description when needed
  - Primary action button when relevant
- Desktop page headers may place title and actions side by side.
- Mobile page headers should stack title, description, and actions vertically.
- Primary action buttons on mobile should usually be full width.
- Secondary actions may collapse into a menu on mobile.
- Keep important actions visible without overwhelming the screen.

### Whitespace Philosophy
- **Warm breathing room**: Maintain Zapier’s generous spacing, but adapt it for data-heavy inventory workflows.
- **Mobile efficiency**: On mobile, reduce decorative spacing and prioritize fast scanning, clear labels, and large tap targets.
- **Desktop density**: On desktop, allow more information per row, especially for product lists, SKU tables, stock history, and dashboards.
- **Section rhythm**: Keep cream background throughout, with sand-colored borders separating sections instead of heavy background changes.

### Border Radius Scale
- Tight (3px): Small inline spans
- Standard (4px): Buttons, tags, small elements
- Content (5px): Cards, links, general containers
- Comfortable (8px): Featured cards, large buttons, tabs, form sections
- Social (14px): Social icon buttons, compact circular controls
- Pill (20px): Filter pills, tag-like selections, floating actions

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Level 0) | No shadow | Page background, text blocks |
| Bordered (Level 1) | `1px solid #c5c0b1` | Standard cards, containers, inputs |
| Strong Border (Level 1b) | `1px solid #36342e` | Dark dividers, emphasized sections |
| Active Tab (Level 2) | `rgb(255, 79, 0) 0px -4px 0px 0px inset` | Active tab underline (orange) |
| Hover Tab (Level 2b) | `rgb(197, 192, 177) 0px -4px 0px 0px inset` | Hover tab underline (sand) |
| Focus (Accessibility) | `1px solid #ff4f00` outline | Focus ring on interactive elements |

**Shadow Philosophy**: Zapier deliberately avoids traditional shadow-based elevation. Structure is defined almost entirely through borders -- warm sand (`#c5c0b1`) borders for standard containment, dark charcoal (`#36342e`) borders for emphasis. The only shadow-like technique is the inset box-shadow used for tab underlines, where a `0px -4px 0px 0px inset` shadow creates a bottom-bar indicator. This border-first approach keeps the design grounded and tangible rather than floating.

### Decorative Depth
- Orange inset underline on active tabs creates visual "weight" at the bottom of elements
- Sand hover underlines provide preview states without layout shifts
- No background gradients in main content -- the cream canvas is consistent
- Footer uses full dark background (`#201515`) for contrast reversal

## 7. Do's and Don'ts

### Do
- Use Degular Display exclusively for hero-scale headlines only.
- Use Inter for all functional app UI: navigation, labels, forms, buttons, tables, cards, and dashboard content.
- Apply warm cream (`#fffefb`) as the primary background.
- Use `#201515` for primary text, never pure black.
- Keep Zapier Orange (`#ff4f00`) reserved for primary actions, focus states, and active indicators.
- Use sand borders (`#c5c0b1`) as the main structural element instead of shadows.
- Preserve the border-first Zapier-inspired visual style.
- Design mobile-first, then enhance for desktop.
- Use full-width stacked layouts on mobile.
- Use multi-column layouts only when the content remains readable.
- Convert complex desktop tables into mobile cards.
- Keep stock-related actions easy to complete on mobile.
- Make Stock Out / cashier flow especially fast and thumb-friendly.
- Use large touch targets, minimum 44px height.
- Use `inputMode="numeric"` for quantity, stock, price, and minimum stock inputs.
- Show current stock clearly before users submit Stock Out.
- Show low-stock warnings near the top of relevant pages.
- Use sticky bottom actions on long mobile forms or wizard steps.
- Use pagination, grouping, or virtualized rendering when SKU lists become large.
- Keep labels visible on forms; do not rely only on placeholders.
- Use clear empty states, loading states, error states, and success feedback.

### Don't
- Don’t change the color palette or introduce a new aesthetic direction.
- Don’t use pure white (`#ffffff`) or pure black (`#000000`).
- Don’t apply heavy shadows to cards or containers.
- Don’t scatter Zapier Orange across every element.
- Don’t use Degular Display for tables, forms, or body text.
- Don’t force large desktop tables onto mobile screens.
- Don’t rely on horizontal scrolling for core mobile workflows.
- Don’t hide important stock actions inside hard-to-find menus.
- Don’t make mobile users complete long side-by-side forms.
- Don’t make primary mobile buttons small or inline when they should be full width.
- Don’t allow the bottom navigation to cover page content.
- Don’t use a hamburger menu as the only navigation for Dashboard, Products, Stock Out, or Stock In.
- Don’t over-compress product/SKU information on mobile; use hierarchy instead.
- Don’t rely on color alone for status such as low stock, active, inactive, or error.
- Don’t place destructive actions next to primary actions without confirmation.

## 8. Responsive Behavior

### Breakpoints
| Name | Width | Key Changes |
|------|-------|-------------|
| Mobile Small | <450px | Tight single column, compact headers, full-width actions |
| Mobile | 450-600px | Standard mobile, stacked layout, bottom nav |
| Mobile Large | 600-640px | More horizontal breathing room, some 2-column card grids allowed |
| Tablet Small | 640-680px | 2-column dashboard cards begin |
| Tablet | 680-768px | Wider cards, improved form spacing |
| Tablet Large | 768-991px | Sidebar may appear, tables can return where readable |
| Desktop Small | 991-1024px | Desktop layout initiates fully |
| Desktop | 1024-1280px | Full layout, sidebar, tables, multi-column dashboard |
| Large Desktop | >1280px | Centered content with max-width constraints |

### Touch Targets
- Minimum touch target: 44px height
- Important mobile actions should be 48px-56px high
- Mobile bottom nav items should have clear icon + label pairing
- Quantity controls should be easy to tap with one hand
- Avoid small icon-only actions unless they include accessible labels
- Table row actions on desktop may be compact, but mobile actions should be larger and clearer

### Collapsing Strategy

#### Navigation
- Desktop:
  - Use persistent left sidebar
  - Sidebar may collapse to icons
  - Active item uses orange indicator or warm bordered state
- Mobile:
  - Use fixed bottom navigation
  - Show only the most important destinations
  - Move secondary/admin pages into More menu
  - Add bottom padding to page content

#### Dashboard
- Desktop:
  - 3-4 stat cards per row
  - Low-stock alerts can sit beside recent activity
  - Use tables or compact lists where useful
- Mobile:
  - 1-column layout by default
  - 2-column only for small stat cards if readable
  - Low-stock alerts should appear near the top
  - Recent activity becomes stacked cards or compact list

#### Product List
- Desktop:
  - Use table layout with columns:
    - Product name
    - Category
    - Total variants
    - Total stock
    - Low-stock status
    - Actions
- Mobile:
  - Convert each product row into a card
  - Show only:
    - Product name
    - Category
    - Total stock
    - Low-stock indicator
    - Primary action
  - Put secondary actions inside an overflow menu

#### Product Detail
- Desktop:
  - Use two-column layout where appropriate:
    - Left: product information
    - Right: stock summary / actions
  - SKU variants can appear as table below
- Mobile:
  - Stack product information, summary, and actions vertically
  - Keep primary stock actions visible
  - SKU variants appear as cards, not a dense table

#### Product Creation Wizard
- Desktop:
  - Use horizontal stepper or left-side step indicator
  - Step content should be centered and constrained
  - SKU Matrix can use table layout
- Mobile:
  - Show one step at a time
  - Use compact top stepper
  - Use sticky bottom action bar for Next / Back / Save
  - Avoid displaying full SKU matrix as a table

#### SKU Matrix
- Desktop:
  - Use full table layout
  - Columns:
    - SKU
    - Variation combination
    - Price
    - Stock
    - Minimum stock
    - Status
    - Actions
  - Bulk actions may sit above the table
- Mobile:
  - Convert each SKU row into a bordered card
  - Show:
    - SKU as card title
    - Variation combination as muted text
    - Price, stock, and min stock as labeled rows
    - Edit action as a clear button
  - Use pagination or grouping if more than 50 SKUs
  - Avoid horizontal scrolling for the primary SKU editing experience

#### Stock In / Stock Out Forms
- Desktop:
  - Use compact form layout
  - Search SKU and quantity can sit side by side if space allows
  - Show selected SKU details in a bordered summary card
- Mobile:
  - SKU search must be near the top
  - Quantity input must be large and numeric
  - Submit button should be full width
  - Current stock must be visible before submission
  - Validation errors should appear directly below the relevant field
  - Keep the workflow fast enough for cashier use

#### Stock History
- Desktop:
  - Use table layout with filters above
  - Columns:
    - Date
    - Type
    - SKU
    - Product
    - Quantity
    - User
    - Note
- Mobile:
  - Use stacked transaction cards
  - Show date, type, SKU/product, quantity, and user
  - Filters collapse into a drawer or stacked controls

#### Filters & Search
- Desktop:
  - Search and filters can be placed in a horizontal toolbar
  - Use filter pills, select components, and date controls
- Mobile:
  - Search should be full width
  - Filters should stack or collapse into a drawer/sheet
  - Avoid cramped horizontal filter rows

### Image Behavior
- Product images maintain sand border treatment at all sizes
- Product images should use consistent aspect ratios
- On mobile, images should not push important stock data too far down
- Use thumbnails in product lists
- Use larger image preview only on product detail pages

### Form Behavior
- Inputs should be full width on mobile
- Related fields can be grouped in bordered sections
- Long forms should use progressive disclosure
- Required fields should be clearly marked
- Error messages should be immediate and readable
- Primary action should remain easy to access on mobile

## 9. Agent Prompt Guide

### Quick Color Reference
- Primary CTA: Zapier Orange (`#ff4f00`)
- Background: Cream White (`#fffefb`)
- Heading text: Zapier Black (`#201515`)
- Body text: Dark Charcoal (`#36342e`)
- Border: Sand (`#c5c0b1`)
- Secondary surface: Light Sand (`#eceae3`)
- Muted text: Warm Gray (`#939084`)

### Responsive Implementation Reference
When generating UI for this app, preserve the Zapier-inspired visual system but adapt the layout for inventory-management workflows.

Use:
- Desktop sidebar, mobile bottom navigation
- Desktop tables, mobile cards
- Multi-column dashboard on desktop, stacked dashboard on mobile
- Full-width mobile forms
- Large mobile touch targets
- Sticky mobile actions for long forms and wizard steps
- Sand borders instead of shadows
- Zapier Orange only for primary actions and active states

### Example Component Prompts
- "Create an app dashboard on cream background (`#fffefb`) with warm sand bordered stat cards. On desktop, use a 4-column grid. On mobile, collapse to 1 column or 2 columns only for small stat cards. Preserve Inter typography and Zapier-style border-first layout."
- "Create a product list page. On desktop, use a bordered table with product name, category, variants, total stock, low-stock status, and actions. On mobile, transform each row into a full-width bordered card with only essential information and one primary action."
- "Create a SKU Matrix Editor. On desktop, use a full-width table. On mobile, replace table rows with stacked SKU cards showing SKU, variation values, price, stock, minimum stock, and edit button. Avoid horizontal scrolling as the primary mobile experience."
- "Create a Stock Out cashier form optimized for mobile. SKU search appears first, followed by selected SKU summary, current stock, quantity input with numeric keyboard, note field, and full-width submit button. Use warm cream background, sand borders, Inter text, and orange only for the primary submit action."
- "Create app navigation. Desktop uses a persistent left sidebar with warm cream background and sand right border. Mobile uses a fixed bottom navigation with 4-5 core items. Active state uses a subtle Zapier Orange indicator."

### Iteration Guide
1. Always use warm cream (`#fffefb`) background, never pure white.
2. Borders (`1px solid #c5c0b1`) are the structural backbone.
3. Zapier Orange (`#ff4f00`) is the only accent color.
4. Three fonts, strict roles: Degular Display for hero/display, Inter for app UI, GT Alpina only for rare editorial accents.
5. Large CTA buttons need generous padding.
6. Tab navigation uses inset box-shadow underlines, not border-bottom.
7. Text is always warm: `#201515` for dark, `#36342e` for body, `#939084` for muted.
8. Mobile layouts must prioritize stock workflow speed and readability.
9. Tables should become cards on mobile unless the table is secondary and explicitly scrollable.
10. Desktop layouts should use available width for productivity without making forms unreadably wide.
