import { createFeature } from "@ngrx/store";
import { sharedReducer } from "./shared.reducer";

export const sharedFeature = createFeature({
  name: 'shared',
  reducer: sharedReducer,
});
