import type { UserSpotFormValues } from "@/entities/user-spot";

export type UserSpotFormErrors = Partial<Record<keyof UserSpotFormValues, string>>;

export type UserSpotValidationMessages = {
  name: string;
  region: string;
  community: string;
  settlement: string;
  waterType: string;
  fish: string;
  description: string;
};

export function validateUserSpot(values: UserSpotFormValues, messages: UserSpotValidationMessages): UserSpotFormErrors {
  const errors: UserSpotFormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = messages.name;
  }

  if (!values.regionId) {
    errors.region = messages.region;
  }

  if (!values.communityId) {
    errors.community = messages.community;
  }

  if (!values.settlementId) {
    errors.settlement = messages.settlement;
  }

  if (values.waterType.trim().length < 2) {
    errors.waterType = messages.waterType;
  }

  if (!values.fish.split(",").some((fish) => fish.trim())) {
    errors.fish = messages.fish;
  }

  if (values.description.trim().length < 20) {
    errors.description = messages.description;
  }

  return errors;
}
