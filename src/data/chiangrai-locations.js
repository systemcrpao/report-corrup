import districts from "./chiangrai-locations.json";

export const CHIANG_RAI_PROVINCE = "เชียงราย";

export const CHIANG_RAI_DISTRICTS = districts;

export function getTambonsByDistrict(districtName) {
  const district = districts.find((item) => item.name === districtName);
  return district?.tambons ?? [];
}
