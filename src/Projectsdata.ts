// ─────────────────────────────────────────────────────────────
//  Projectsdata.ts  —  updated with Renovations/Construction
//  category rename + 7 ongoing projects from the PCI profile
// ─────────────────────────────────────────────────────────────

// ── Electrical ──────────────────────────────────────────────
import Globe1  from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag1.png";
import Globe2  from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag2.png";
import Globe3  from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag3.png";
import Globe4  from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag4.png";
import Globe5  from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag5.png";
import Globe6  from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag6.png";
import Globe7  from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag7.png";
import Globe8  from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag8.png";
import Globe9  from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag9.png";
import Globe10 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag10.png";
import Globe11 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag11.png";
import Globe12 from "./CompletedProjects/GlobeBaliuag/GlobeBaliuag12.png";

import Aviation1 from "./CompletedProjects/1AVIATION/1AVIATION1.png";
import Aviation2 from "./CompletedProjects/1AVIATION/1AVIATION2.png";
import Aviation3 from "./CompletedProjects/1AVIATION/1AVIATION3.png";
import Aviation4 from "./CompletedProjects/1AVIATION/1AVIATION4.png";

// ── Gaisano Mactan ──────────────────────────────────────────
import Gaisano1  from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart1.jpg";
import Gaisano2  from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart2.jpg";
import Gaisano3  from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart3.jpg";
import Gaisano4  from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart4.jpg";
import Gaisano5  from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart5.jpg";
import Gaisano6  from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart6.jpg";
import Gaisano7  from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart7.jpg";
import Gaisano8  from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart8.jpg";
import Gaisano9  from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart9.jpg";
import Gaisano10 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart10.jpg";
import Gaisano11 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart11.jpg";
import Gaisano12 from "./CompletedProjects/GaisanoMactan/GaisanoMactanSmart12.jpg";

// ── NCDC Ormoc ──────────────────────────────────────────────
import NCDC1 from "./CompletedProjects/NCDCORMOC/NCDC1.png";
import NCDC2 from "./CompletedProjects/NCDCORMOC/NCDC2.png";
import NCDC3 from "./CompletedProjects/NCDCORMOC/NCDC3.png";
import NCDC4 from "./CompletedProjects/NCDCORMOC/NCDC4.png";
import NCDC5 from "./CompletedProjects/NCDCORMOC/NCDC5.png";
import NCDC6 from "./CompletedProjects/NCDCORMOC/NCDC6.png";

// ── Ongoing — import the images you'll place in the
//    /src/OngoingProjects/ folder (copy from PPTX exports)
// ────────────────────────────────────────────────────────────
//  Mindoro Occidental Cooperative Hospital
import Mindoro1 from "./CompletedProjects/MOCHMC/MOCHMC1.png";
import Mindoro2 from "./CompletedProjects/MOCHMC/MOCHMC2.png";
import Mindoro3 from "./CompletedProjects/MOCHMC/MOCHMC3.png";

//  POI Festoon — San Andres, Catanduanes
import SanAndres1 from "./CompletedProjects/PoiFestonSanAndres/PoiFestonSanAndres1.png";
import SanAndres2 from "./CompletedProjects/PoiFestonSanAndres/PoiFestonSanAndres2.png";
import SanAndres3 from "./CompletedProjects/PoiFestonSanAndres/PoiFestonSanAndres3.png";

//  Badoc POI Festoon
import Badoc1 from "./CompletedProjects/BADOC/Badoc1.png";
import Badoc2 from "./CompletedProjects/BADOC/Badoc2.png";

//  BTP2 NaOH Dozing System
import BTP1 from "./CompletedProjects/BT2P/BT2P1.png";
import BTP2 from "./CompletedProjects/BT2P/BT2P2.png";
import BTP3 from "./CompletedProjects/BT2P/BT2P3.png";

import Elem1 from "./CompletedProjects/SanFernandoElementarySchool/1.jpg";
import Elem2 from "./CompletedProjects/SanFernandoElementarySchool/2.jpg";
import Elem3 from "./CompletedProjects/SanFernandoElementarySchool/3.jpg";
import Elem4 from "./CompletedProjects/SanFernandoElementarySchool/4.jpg";
import Elem5 from "./CompletedProjects/SanFernandoElementarySchool/5.jpg";
import Elem6 from "./CompletedProjects/SanFernandoElementarySchool/6.jpg";
import Elem7 from "./CompletedProjects/SanFernandoElementarySchool/7.jpg";


// ─────────────────────────────────────────────────────────────
export interface ProjectData {
  id:          number;
  title:       string;
  category:    string;
  cover:       string;
  images:      string[];
  description: string;
  location?:   string;
  client?:     string;
  completion?: string;
  amount?:     string;
  ongoing?:    boolean;
}

export interface CategoryGroup {
  label:    string;
  projects: ProjectData[];
}

// ─────────────────────────────────────────────────────────────
//  ALL PROJECTS
// ─────────────────────────────────────────────────────────────
export const ALL_PROJECTS: ProjectData[] = [

  // ── Electrical ──────────────────────────────────────────
  {
    id: 1,
    title: "Globe Baliuag — Electrical & Transformer Upgrade",
    category: "Electrical",
    cover: Globe1,
    images: [Globe1, Globe2, Globe3, Globe4, Globe5, Globe6,
             Globe7, Globe8, Globe9, Globe10, Globe11, Globe12],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    location: "Baliuag, Bulacan",
    client: "Globe Telecom",
  },
  {
    id: 2,
    title: "Gaisano Mactan — Smart Store Development",
    category: "Electrical",
    cover: Gaisano1,
    images: [Gaisano1, Gaisano2, Gaisano3, Gaisano4, Gaisano5, Gaisano6,
             Gaisano7, Gaisano8, Gaisano9, Gaisano10, Gaisano11, Gaisano12],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    location: "Mactan, Cebu",
    client: "PLDT / Smart",
  },

  // ── Civil Works ─────────────────────────────────────────
  {
    id: 3,
    title: "NCDC Ormoc — Core Data Center",
    category: "Civil Works",
    cover: NCDC1,
    images: [NCDC1, NCDC2, NCDC3, NCDC4, NCDC5, NCDC6,],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    location: "Brgy. Bantique, Ormoc City, Leyte",
    client: "Globe",
    completion: "March 2024",
  },

  // ── Renovations / Construction ───────────────────────────
  {
    id: 4,
    title: "1Aviation Office Fit-Out",
    category: "Renovations/Construction",
    cover: Aviation1,
    images: [Aviation1, Aviation2, Aviation3, Aviation4],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    location: "Along Domestic Road, Pasay City",
    client: "1Aviation",
    completion: "September 2024",
  },
  {
    id: 5,
    title: "San Fernando Elementary School",
    category: "Civil Works",
    cover: Elem1,
    images: [Elem1, Elem2, Elem3, Elem4, Elem5, Elem6, Elem7],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    location: "San Fernando, Pampanga",
    client: "San Fernando City Government",
    completion: "tanong kay maam"
  },

  // ── Ongoing ─────────────────────────────────────────────
  {
    id: 101,
    title: "Mindoro Occidental Cooperative Hospital",
    category: "Ongoing",
    cover: Mindoro1,
    images: [Mindoro1, Mindoro2, Mindoro3],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    location: "Sitio San Carlos, San Jose, Mindoro Occidental",
    ongoing: true,
  },
  {
    id: 102,
    title: "POI Festoon — San Andres, Catanduanes",
    category: "Ongoing",
    cover: SanAndres1,
    images: [SanAndres1, SanAndres2, SanAndres3],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    location: "San Andres, Catanduanes",
    ongoing: true,
  },
  {
    id: 103,
    title: "Badoc POI Festoon Project",
    category: "Ongoing",
    cover: Badoc1,
    images: [Badoc1, Badoc2],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    location: "Brgy. Mabajao, Maasin City, Leyte",
    ongoing: true,
  },
  {
    id: 104,
    title: "BTP2 Centralized NaOH Dozing System",
    category: "Ongoing",
    cover: BTP1,
    images: [BTP1, BTP2, BTP3],
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    location: "Pansol, Quezon City",
    client: "Manila Water Company Inc.",
    ongoing: true,
  },
];

// ── Featured on home page (pick best visual projects) ───────
export const FEATURED_PROJECTS = ALL_PROJECTS.filter(p =>
  [1, 2, 3, 4].includes(p.id)
);

// ── Category groups for Projects page ───────────────────────
export const CATEGORIES: CategoryGroup[] = [
  {
    label: "Ongoing Projects",
    projects: ALL_PROJECTS.filter(p => p.category === "Ongoing"),
  },
  {
    label: "Civil Works",
    projects: ALL_PROJECTS.filter(p => p.category === "Civil Works"),
  },
  {
    label: "Electrical",
    projects: ALL_PROJECTS.filter(p => p.category === "Electrical"),
  },
  {
    label: "Renovations / Construction",
    projects: ALL_PROJECTS.filter(p => p.category === "Renovations/Construction"),
  },
];