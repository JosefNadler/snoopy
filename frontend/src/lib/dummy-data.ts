import type { BoardState, CardData } from "./types";

const cardList: CardData[] = [
  {
    id: "card-1",
    title: "Define product roadmap",
    details: "Outline milestones for the next two quarters and share with stakeholders.",
  },
  {
    id: "card-2",
    title: "Research competitor pricing",
    details: "Compare tiered pricing models from the top three competitors.",
  },
  {
    id: "card-3",
    title: "Design onboarding flow",
    details: "Sketch wireframes for first-run experience, focused on time-to-value.",
  },
  {
    id: "card-4",
    title: "Set up CI pipeline",
    details: "Add lint, test, and build steps that run on every pull request.",
  },
  {
    id: "card-5",
    title: "Build authentication screens",
    details: "Implement sign in, sign up, and password reset views.",
  },
  {
    id: "card-6",
    title: "Write API documentation",
    details: "Document all public endpoints with request and response examples.",
  },
  {
    id: "card-7",
    title: "Accessibility audit",
    details: "Check color contrast and keyboard navigation across the app.",
  },
  {
    id: "card-8",
    title: "Performance pass",
    details: "Profile the app and reduce initial load time below two seconds.",
  },
  {
    id: "card-9",
    title: "Launch marketing site",
    details: "Publish the new landing page with updated messaging and pricing.",
  },
];

export const cards: Record<string, CardData> = Object.fromEntries(
  cardList.map((card) => [card.id, card])
);

export const initialBoardState: BoardState = {
  cards,
  columns: [
    { id: "col-1", title: "Backlog", cardIds: ["card-1", "card-2"] },
    { id: "col-2", title: "To Do", cardIds: ["card-3", "card-4"] },
    { id: "col-3", title: "In Progress", cardIds: ["card-5", "card-6"] },
    { id: "col-4", title: "Review", cardIds: ["card-7"] },
    { id: "col-5", title: "Done", cardIds: ["card-8", "card-9"] },
  ],
};
