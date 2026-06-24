import { useState, useEffect } from "react";
import {
  CHIANG_RAI_DISTRICTS,
  CHIANG_RAI_PROVINCE,
  getTambonsByDistrict,
} from "../data/chiangrai-locations.js";

export default function LocationSelector({
  address,
  district,
  subDistrict,
  onAddressChange,
  onDistrictChange,
  onSubDistrictChange,
  disabled = false,
}) {
  const [tambonOptions, setTambonOptions] = useState([]);

  useEffect(() => {
    setTambonOptions(getTambonsByDistrict(district));
  }, [district]);

  function handleDistrictChange(value) {
    onDistrictChange(value);
    onSubDistrictChange("");
  }

  return (
    <fieldset className="location-fieldset">
      <legend>สถานที่เกิดเหตุ</legend>

      <div className="form-group">
        <label htmlFor="incidentAddress">สถานที่ (บ้านเลขที่ ถนน หมู่บ้าน ฯลฯ) *</label>
        <input
          id="incidentAddress"
          type="text"
          value={address}
          onChange={(e) => onAddressChange(e.target.value)}
          placeholder="เช่น 123 หมู่ 5 ถนนพหลโยธิน หมู่บ้าน..."
          disabled={disabled}
        />
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="province">จังหวัด</label>
          <input id="province" type="text" value={CHIANG_RAI_PROVINCE} disabled readOnly />
        </div>

        <div className="form-group">
          <label htmlFor="district">อำเภอ *</label>
          <select
            id="district"
            value={district}
            onChange={(e) => handleDistrictChange(e.target.value)}
            disabled={disabled}
          >
            <option value="">-- เลือกอำเภอ --</option>
            {CHIANG_RAI_DISTRICTS.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="subDistrict">ตำบล *</label>
          <select
            id="subDistrict"
            value={subDistrict}
            onChange={(e) => onSubDistrictChange(e.target.value)}
            disabled={disabled || !district}
          >
            <option value="">-- เลือกตำบล --</option>
            {tambonOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </fieldset>
  );
}
