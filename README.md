# Cabinette Online

Inspired by the Power BI dasboard created for Cabinette, this is a similar interactive dashboard for exploring and ranking candidate cabin sites near U.S. National Parks and Monuments. This version is an online application for improved accessibility which will be built with Next.js, React, and TypeScript.

## Planned Functionalities

- Interactive map (Leaflet)
- Dynamic site scoring and ranking
- Adjustable scoring weights
- (Filtered) table with rankings 
- Detailed view upon selection of parks/sites

## Key Project Structure
```
├───src
│   └───app
|       ⋮
|       ├───globals.css # styles for app-specific elements
│       ├───page.tsx # main page/entry point
│       ├───api # Next.js API routes
│       │   ├───details # fetch site and visitor center information
│       │   │   ├───site_info/route.ts
│       │   │   ├───vc_info/route.ts
│       │   │   └───visitation/route.ts
│       │   └───map # fetch data for map display
│       │       ├───site-polygons/route.ts
│       │       ├───unitcodes_names/route.ts
│       │       └───vc-points/route.ts
│       └───components
│           ├───DefaultMap.tsx # base interactive map
│           ├───FilteredMap.tsx # filters for map
│           ├───RankingTable.tsx # top 10 table
│           ├───SiteGauges.tsx # visitation comparison
│           ├───TextDetails.tsx # additional site/park info
│           ├───VCPlot.tsx # monthly visitation for park
│           ├───WeightsProxies.tsx # adjustable scoring weights and proxies
│           └───__tests__ # unit tests for components
└───__mocks__/mockStyles.ts # empty style for unit tests
```

## Local Testing
### Prerequisites

- Node.js (v18+)
- npm or similar (yarn, pnpm, bun)

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

## Data

The Postgres database was built as described in [Cabinette](https://github.com/vmgaribay/cabinette.git)

## Deployment

Deployment on [Vercel](https://vercel.com/) is planned to accommodate dynamic features.

## Acknowledgements
I acknowledge that I consulted resources such as GitHub Copilot (GPT-5, GPT-4.1), Plotly and Leaflet video tutorials, and various online forums in the construction of this project.

## Contact

Victoria Garibay, Ph.D. — [Contact Form](https://vmgaribay.github.io/portfolio/contact_form.html) | [GitHub Profile](https://github.com/vmgaribay)