"use client";

import { createContext, useContext } from "react";

export enum HeroStage {
  INTRO = "INTRO",
  REVEAL = "REVEAL",
  TITLE = "TITLE",
  CONTENT = "CONTENT",
  READY = "READY",
  IDLE = "IDLE",
}

interface HeroContextValue {
  stage: HeroStage;
}

const HeroContext = createContext<HeroContextValue>({
  stage: HeroStage.INTRO,
});

export const HeroProvider = HeroContext.Provider;

export function useHeroStage() {
  return useContext(HeroContext).stage;
}
