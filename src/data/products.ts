import salmonWholeAsset from '@/assets/fish-whole-salmon-real.jpg';
import tunaWholeAsset from '@/assets/fish-whole-tuna-real.jpg';
import branzinoWholeAsset from '@/assets/fish-whole-branzino-real.jpg';
import redSnapperWholeAsset from '@/assets/fish-whole-red-snapper-real.jpg';
import grouperWholeAsset from '@/assets/fish-whole-grouper-real.jpg';
import codWholeAsset from '@/assets/fish-whole-cod-real.jpg';
import halibutWholeAsset from '@/assets/fish-whole-halibut-real.jpg';
import flounderWholeAsset from '@/assets/fish-whole-flounder-real.jpg';
import tileFishWholeAsset from '@/assets/fish-whole-tile-fish-real.jpg';
import whitingWholeAsset from '@/assets/fish-whole-whiting-real.jpg';
import mulletWholeAsset from '@/assets/fish-whole-mullet-real.jpg';
import buffaloWholeAsset from '@/assets/fish-whole-buffalo-real.jpg';
import carpWholeAsset from '@/assets/fish-whole-carp-real.jpg';
import doradoWholeAsset from '@/assets/fish-whole-dorado-real.jpg';
import tilapiaWholeAsset from '@/assets/fish-whole-tilapia-real.jpg';
import graySoleWholeAsset from '@/assets/fish-whole-gray-sole-real.jpg';
import blackSeabassWholeAsset from '@/assets/fish-whole-black-seabass-real.jpg';
import stripedBassWholeAsset from '@/assets/fish-whole-striped-bass-real.jpg';

export interface Product {
  id: number;
  name: string;
  species: string;
  origin: string;
  price: number;
  weight: string;
  type: string;
  rating: number;
  image: string;
  badge?: string;
  badgeColor?: string;
  callForPrice?: boolean;
}

const WHOLE_PRICE = 9.99;

export const products: Product[] = [
  { id: 2, name: 'Tuna', species: 'tuna', origin: 'Pacific Ocean', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: tunaWholeAsset },
  { id: 3, name: 'Branzino', species: 'branzino', origin: 'Greece', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: branzinoWholeAsset },
  { id: 4, name: 'Red Snapper', species: 'snapper', origin: 'USA', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: redSnapperWholeAsset },
  { id: 5, name: 'Grouper', species: 'grouper', origin: 'USA', price: WHOLE_PRICE, weight: '5-8lb', type: 'Whole Fish', rating: 5, image: grouperWholeAsset },
  { id: 6, name: 'Cod', species: 'cod', origin: 'Alaska', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: codWholeAsset },
  { id: 7, name: 'Halibut', species: 'halibut', origin: 'Arctic Ocean', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: halibutWholeAsset },
  { id: 8, name: 'Flounder', species: 'flounder', origin: 'USA', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: flounderWholeAsset },
  { id: 9, name: 'Tile Fish', species: 'tilefish', origin: 'USA', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: tileFishWholeAsset },
  { id: 10, name: 'Whiting', species: 'whiting', origin: 'USA', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: whitingWholeAsset },
  { id: 11, name: 'Mullet', species: 'mullet', origin: 'USA', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: mulletWholeAsset },
  { id: 12, name: 'Buffalo Fish', species: 'buffalo', origin: 'Mississippi River', price: WHOLE_PRICE, weight: '10-12lb', type: 'Whole Fish Clean', rating: 5, image: buffaloWholeAsset },
  { id: 13, name: 'Carp', species: 'carp', origin: 'Mississippi River', price: WHOLE_PRICE, weight: '10-12lb', type: 'Whole Fish Clean', rating: 5, image: carpWholeAsset },
  { id: 14, name: 'Dorado', species: 'dorado', origin: 'USA', price: WHOLE_PRICE, weight: '5-8lb', type: 'Whole Fish Clean', rating: 5, image: doradoWholeAsset },
  { id: 15, name: 'Tilapia', species: 'tilapia', origin: 'USA', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: tilapiaWholeAsset },
  { id: 16, name: 'Gray Sole', species: 'gray-sole', origin: 'USA', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: graySoleWholeAsset },
  { id: 17, name: 'Black Seabass', species: 'black-seabass', origin: 'USA', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: blackSeabassWholeAsset },
  { id: 18, name: 'Striped Bass', species: 'striped-bass', origin: 'USA', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: stripedBassWholeAsset },
  { id: 19, name: 'Scottish Salmon', species: 'salmon', origin: 'Scotland', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: salmonWholeAsset },
  { id: 20, name: 'Faroe Island Salmon', species: 'salmon', origin: 'Faroe Islands', price: WHOLE_PRICE, weight: '5lb', type: 'Whole Fish', rating: 5, image: salmonWholeAsset },
  { id: 21, name: 'King Salmon', species: 'salmon', origin: 'Alaska', price: 0, weight: 'Varies', type: 'Whole Fish', rating: 5, image: salmonWholeAsset, callForPrice: true },
];

// Species info for pages
export interface SpeciesInfo {
  slug: string;
  name: string;
  description: string;
  heroImage: string;
}

export const speciesInfo: Record<string, SpeciesInfo> = {
  salmon: {
    slug: 'salmon',
    name: 'Salmon',
    description: 'Wild-caught salmon sourced from Scotland, the Faroe Islands, and Alaskan King Salmon. Known for its rich, buttery flavor and beautiful pink-orange flesh.',
    heroImage: salmonWholeAsset,
  },
  tuna: {
    slug: 'tuna',
    name: 'Tuna',
    description: 'Premium tuna from the Pacific Ocean. Prized for its deep red color and clean, meaty flavor.',
    heroImage: tunaWholeAsset,
  },
  branzino: {
    slug: 'branzino',
    name: 'Branzino',
    description: 'Mediterranean sea bass from Greece. Known for its delicate, flaky white flesh and subtle, sweet flavor perfect for whole roasting.',
    heroImage: branzinoWholeAsset,
  },
  snapper: {
    slug: 'snapper',
    name: 'Red Snapper',
    description: 'Fresh-caught red snapper from the Gulf of Mexico. Offers a sweet, nutty flavor with a firm texture that holds up beautifully to any cooking method.',
    heroImage: redSnapperWholeAsset,
  },
  grouper: {
    slug: 'grouper',
    name: 'Grouper',
    description: 'Wild-caught grouper from the Atlantic. Features a mild, sweet flavor with a firm texture that makes it perfect for grilling and blackening.',
    heroImage: grouperWholeAsset,
  },
  cod: {
    slug: 'cod',
    name: 'Cod',
    description: 'Wild Alaskan cod with its mild, slightly sweet flavor and flaky white flesh. A versatile favorite for fish and chips to elegant preparations.',
    heroImage: codWholeAsset,
  },
  halibut: {
    slug: 'halibut',
    name: 'Halibut',
    description: 'Wild-caught halibut from the cold Arctic waters. Celebrated for its firm, snow-white flesh and sweet, delicate flavor.',
    heroImage: halibutWholeAsset,
  },
  flounder: {
    slug: 'flounder',
    name: 'Flounder',
    description: 'Fresh Atlantic flounder with its delicate, fine-textured white flesh. Its mild, sweet taste makes it a versatile choice for any preparation.',
    heroImage: flounderWholeAsset,
  },
  tilefish: {
    slug: 'tilefish',
    name: 'Tile Fish',
    description: 'Wild-caught tilefish from the Atlantic coast. Features a sweet, slightly firm flesh reminiscent of lobster with excellent versatility.',
    heroImage: tileFishWholeAsset,
  },
  whiting: {
    slug: 'whiting',
    name: 'Whiting',
    description: 'Fresh Atlantic whiting with tender, flaky white flesh. An affordable, mild-flavored fish perfect for frying and casual preparations.',
    heroImage: whitingWholeAsset,
  },
  mullet: {
    slug: 'mullet',
    name: 'Mullet',
    description: 'Wild-caught mullet from coastal waters. Known for its rich, distinctive flavor and firm texture ideal for smoking and grilling.',
    heroImage: mulletWholeAsset,
  },
  buffalo: {
    slug: 'buffalo',
    name: 'Buffalo Fish',
    description: 'Sustainably harvested buffalo fish from the Mississippi River. A traditional favorite with firm, flavorful flesh perfect for traditional preparations.',
    heroImage: buffaloWholeAsset,
  },
  carp: {
    slug: 'carp',
    name: 'Carp',
    description: 'Fresh carp from the Mississippi River. Prized in many cuisines for its firm texture and rich flavor, especially in traditional Jewish and Asian cooking.',
    heroImage: carpWholeAsset,
  },
  dorado: {
    slug: 'dorado',
    name: 'Dorado',
    description: 'Wild-caught dorado, also known as mahi-mahi, from warm Atlantic waters. Prized for its firm, lean flesh and mild, slightly sweet flavor that grills beautifully.',
    heroImage: doradoWholeAsset,
  },
  tilapia: {
    slug: 'tilapia',
    name: 'Tilapia',
    description: 'Fresh farm-raised tilapia from clean U.S. waters. Known for its mild, flaky white flesh and versatility in everything from frying to baking.',
    heroImage: tilapiaWholeAsset,
  },
  'gray-sole': {
    slug: 'gray-sole',
    name: 'Gray Sole',
    description: 'Delicate gray sole from Atlantic waters, prized for its thin, mild fillets and fine, flaky texture. A refined flatfish perfect for light sautéing and classic preparations.',
    heroImage: graySoleWholeAsset,
  },
  'black-seabass': {
    slug: 'black-seabass',
    name: 'Black Seabass',
    description: 'Wild-caught black seabass from Atlantic waters. Prized for its firm, sweet, delicately flavored flesh, perfect for whole roasting or steaming.',
    heroImage: blackSeabassWholeAsset,
  },
  'striped-bass': {
    slug: 'striped-bass',
    name: 'Striped Bass',
    description: 'Wild-caught striped bass from Atlantic coastal waters. Known for its firm, moist white flesh and mild, clean flavor — a favorite for whole grilling and roasting.',
    heroImage: stripedBassWholeAsset,
  },
};

export const getProductsBySpecies = (species: string): Product[] => {
  return products.filter(p => p.species === species);
};

export const getAllSpecies = (): string[] => {
  return Object.keys(speciesInfo);
};
