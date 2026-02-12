# Cabinette (Online Edition)

Inspired by the Power BI report created for [Cabinette](https://github.com/vmgaribay/cabinette), this is a similar interactive dashboard for exploring and ranking candidate cabin sites near U.S. National Parks and Monuments. This version is an online application for improved accessibility which was built with Next.js, React, Redux, and TypeScript ([See it Live!](https://cabinette-frontend.vercel.app/)).

## Functionalities

- Interactive map (Leaflet)
- Dynamic site scoring and ranking
- Adjustable scoring weights
- (Filtered) table with rankings 
- Detailed view upon selection of parks/sites
- Default/light theme toggle
- Bookmark utilities (save/load/merge)

## Key Project Structure
```
├───src
│   └───app
|       ⋮
|       ├───globals.css             # styles for app-specific elements
│       ├───page.tsx                # main page/entry point
│       ├───api                     # Next.js API routes
│       │   ├───details             # fetch site and visitor center information
│       │   │   ├───site_info/route.ts
│       │   │   ├───vc_info/route.ts
│       │   │   └───visitation/route.ts
│       │   └───map                 # fetch data for map display
│       │       ├───site-polygons/route.ts
│       │       ├───unitcodes_names/route.ts
│       │       └───vc-points/route.ts
│       ├───components
│       │   ├───BookmarksFilter.tsx # bookmark save/load/merge
│       │   ├───DefaultMap.tsx      # base interactive map
│       │   ├───FilteredMap.tsx     # filters for map
│       │   ├───RankingTable.tsx    # top 10 table
│       │   ├───SiteGauges.tsx      # visitation comparison
│       │   ├───TextDetails.tsx     # additional site/park info
│       │   ├───ThemeToggle.tsx     # default/light color scheme switch
│       │   ├───VCPlot.tsx          # monthly visitation for park
│       │   ├───WeightsProxies.tsx  # adjustable scoring weights and proxies
│       │   └───__tests__           # unit tests for components
│       ├───store
│       │   ├───bookmarksSlice.ts   # bookmark state management
│       │   ├───filtersSlice.ts     # map filter state management
│       │   ├───provider.tsx        # Redux store provider
│       │   ├───selector.ts         # selector for site visibility
│       │   ├───store.ts            # Redux store configuration
│       │   ├───themeSlice.ts       # UI color state management
│       │   └───__tests__           # unit tests for store slices/selector
│       └───utils                   # utility functions
└───__mocks__/mockStyles.ts         # empty style for unit tests
```

## Data

The Postgres database was built as described in [Cabinette](https://github.com/vmgaribay/cabinette.git). Relevant tables are live on Neon and accessed via Next.js API routes. The pared-down database used by the application and instructions on hosting it remotely are available on Zenodo, [doi:10.5281/zenodo.18110980](https://doi.org/10.5281/zenodo.18110980).

## Local Testing
### Prerequisites

- Node.js (v18+)
- npm (or similar package manager)
- Remote Postgres database with relevant tables (see Data section)

### Installation

```bash
git clone https://github.com/vmgaribay/cabinette-frontend.git
cd cabinette-frontend
npm install
```

### Run

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

The application is deployed on Vercel at [https://cabinette-frontend.vercel.app/](https://cabinette-frontend.vercel.app/). The Neon database connection string was set as the `DATABASE_URL` environment variable for deployment.

## Acknowledgements
I acknowledge that I consulted resources such as GitHub Copilot (GPT-5, GPT-5 mini, GPT-4.1, Grok Code Fast 1), Plotly and Leaflet video tutorials, and various online forums in the construction of this project.

## Contact

Victoria Garibay, Ph.D. — [Email Contact Form](https://vmgaribay.github.io/portfolio/contact_form.html) | [GitHub Profile](https://github.com/vmgaribay)
