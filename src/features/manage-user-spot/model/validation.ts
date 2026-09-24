import type { UserSpotFormValues } from "@/entities/user-spot";

export type UserSpotFormErrors = Partial<Record<keyof UserSpotFormValues, string>>;

export function validateUserSpot(values: UserSpotFormValues): UserSpotFormErrors {
  const errors: UserSpotFormErrors = {};

  if (values.name.trim().length < 2) {
    errors.name = "Вкажи назву водойми.";
  }

  if (!values.regionId) {
    errors.region = "Обери область зі списку.";
  }

  if (!values.communityId) {
    errors.community = "Обери громаду або місто зі списку.";
  }

  if (!values.settlementId) {
    errors.settlement = "Обери населений пункт зі списку.";
  }

  if (values.waterType.trim().length < 2) {
    errors.waterType = "Вкажи тип водойми.";
  }

  if (!values.fish.split(",").some((fish) => fish.trim())) {
    errors.fish = "Додай хоча б один вид риби.";
  }

  if (values.description.trim().length < 20) {
    errors.description = "Опиши водойму щонайменше 20 символами.";
  }

  return errors;
}
