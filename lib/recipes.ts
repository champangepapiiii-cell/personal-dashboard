// Curated recipe library. The meal-plan generator filters these by diet and
// fits them to a calorie target — no network, no API, fully client-side.

import type { DietType, MealSlot } from "./types";

export interface Recipe {
  id: string;
  name: string;
  slot: MealSlot;
  /** Approx calories per serving. */
  calories: number;
  /** Diets this recipe satisfies. */
  diets: DietType[];
  /** Total time, minutes. */
  minutes: number;
  /** Approx protein grams — used to favour high-protein plans. */
  protein: number;
}

const ALL: DietType[] = ["omnivore", "vegetarian", "vegan", "pescatarian", "keto", "high-protein"];
const VEG_FRIENDLY: DietType[] = ["omnivore", "vegetarian", "vegan", "pescatarian"];

export const RECIPES: Recipe[] = [
  // --- Breakfast ---
  { id: "b_oats", name: "Overnight oats with berries", slot: "Breakfast", calories: 350, diets: VEG_FRIENDLY, minutes: 5, protein: 12 },
  { id: "b_scramble", name: "Veggie egg scramble", slot: "Breakfast", calories: 320, diets: ["omnivore", "vegetarian", "pescatarian", "keto", "high-protein"], minutes: 12, protein: 22 },
  { id: "b_tofu", name: "Tofu & spinach scramble", slot: "Breakfast", calories: 300, diets: ["vegan", "vegetarian", "omnivore", "high-protein"], minutes: 12, protein: 20 },
  { id: "b_greek", name: "Greek yoghurt, nuts & honey", slot: "Breakfast", calories: 330, diets: ["omnivore", "vegetarian", "pescatarian", "high-protein"], minutes: 4, protein: 24 },
  { id: "b_avotoast", name: "Avocado toast & seeds", slot: "Breakfast", calories: 380, diets: VEG_FRIENDLY, minutes: 8, protein: 11 },
  { id: "b_smoothie", name: "Protein green smoothie", slot: "Breakfast", calories: 290, diets: ALL, minutes: 5, protein: 28 },
  { id: "b_shakshuka", name: "Mini shakshuka", slot: "Breakfast", calories: 340, diets: ["omnivore", "vegetarian", "pescatarian", "keto"], minutes: 18, protein: 18 },
  { id: "b_chia", name: "Chia pudding & mango", slot: "Breakfast", calories: 310, diets: VEG_FRIENDLY, minutes: 5, protein: 10 },

  // --- Lunch ---
  { id: "l_chicken_bowl", name: "Grilled chicken & quinoa bowl", slot: "Lunch", calories: 520, diets: ["omnivore", "high-protein"], minutes: 20, protein: 42 },
  { id: "l_salmon", name: "Salmon & greens plate", slot: "Lunch", calories: 480, diets: ["omnivore", "pescatarian", "keto", "high-protein"], minutes: 18, protein: 38 },
  { id: "l_chickpea", name: "Chickpea & roasted veg bowl", slot: "Lunch", calories: 450, diets: VEG_FRIENDLY, minutes: 20, protein: 18 },
  { id: "l_lentil", name: "Lentil & feta salad", slot: "Lunch", calories: 430, diets: ["vegetarian", "omnivore", "pescatarian", "high-protein"], minutes: 15, protein: 24 },
  { id: "l_tofu_stir", name: "Tofu veggie stir-fry", slot: "Lunch", calories: 440, diets: ["vegan", "vegetarian", "omnivore", "high-protein"], minutes: 18, protein: 22 },
  { id: "l_tuna", name: "Tuna & white bean salad", slot: "Lunch", calories: 410, diets: ["omnivore", "pescatarian", "high-protein"], minutes: 10, protein: 34 },
  { id: "l_wrap", name: "Halloumi & veg wrap", slot: "Lunch", calories: 500, diets: ["vegetarian", "omnivore", "pescatarian"], minutes: 15, protein: 20 },
  { id: "l_beef_salad", name: "Steak strips & avocado salad", slot: "Lunch", calories: 540, diets: ["omnivore", "keto", "high-protein"], minutes: 20, protein: 40 },

  // --- Dinner ---
  { id: "d_chicken_veg", name: "Roast chicken & vegetables", slot: "Dinner", calories: 560, diets: ["omnivore", "high-protein"], minutes: 40, protein: 45 },
  { id: "d_curry", name: "Chickpea coconut curry", slot: "Dinner", calories: 520, diets: VEG_FRIENDLY, minutes: 30, protein: 19 },
  { id: "d_fish", name: "Baked cod & roast potatoes", slot: "Dinner", calories: 500, diets: ["omnivore", "pescatarian", "high-protein"], minutes: 30, protein: 36 },
  { id: "d_stirfry", name: "Beef & broccoli stir-fry", slot: "Dinner", calories: 550, diets: ["omnivore", "keto", "high-protein"], minutes: 22, protein: 42 },
  { id: "d_dhal", name: "Red lentil dhal & rice", slot: "Dinner", calories: 480, diets: VEG_FRIENDLY, minutes: 30, protein: 22 },
  { id: "d_salmon_bowl", name: "Teriyaki salmon rice bowl", slot: "Dinner", calories: 580, diets: ["omnivore", "pescatarian", "high-protein"], minutes: 25, protein: 38 },
  { id: "d_zoodle", name: "Courgette noodles & pesto", slot: "Dinner", calories: 420, diets: ["vegetarian", "vegan", "omnivore", "keto"], minutes: 20, protein: 14 },
  { id: "d_tofu_curry", name: "Tofu tikka & cauliflower rice", slot: "Dinner", calories: 460, diets: ["vegan", "vegetarian", "omnivore", "keto", "high-protein"], minutes: 28, protein: 26 },
];

export function recipeById(id: string): Recipe | undefined {
  return RECIPES.find((r) => r.id === id);
}
