//Feature Type
export type FeatureSelection = {
  type: "site" | "vc";
  id: string | number;
} | null;

export type SiteInfoRow = {
  id: string;
  combined_min_monthly_visitation_norm: number;
  combined_max_monthly_visitation_norm: number;
  combined_overall_avg_monthly_visitation_norm: number;
  nearest_park_min_monthly_visitation_norm: number;
  nearest_park_max_monthly_visitation_norm: number;
  nearest_park_overall_avg_monthly_visitation_norm: number;
  lodging_for_site_norm: number;
  combined_lodging_norm: number;
  combined_vc_distance_norm: number;
  nearest_vc_distance_norm: number;
  nearest_road_distance_norm: number;
  parks_within_30_mi_unitcodes: string;
  parks_within_30_mi_names: string;
  nearest_road_distance_mi: number;
  nearest_road_distance_km: number;
  nearest_road_type: string;
  lodging_for_site: number;
  combined_lodging: number;
  combined_vc_distance_mi: number;
  combined_vc_distance_km: number;
  nearest_vc_distance_mi: number;
  nearest_vc_distance_km: number;
  combined_min_monthly_visitation: number;
  combined_max_monthly_visitation: number;
  combined_overall_avg_monthly_visitation: number;
  nearest_park_min_monthly_visitation: number;
  nearest_park_max_monthly_visitation: number;
  nearest_park_overall_avg_monthly_visitation: number;
};

export type VCInfoRow = {
  id: string;
  unitcode: string;
  visitor_center_name: string;
  vc_site_count: number;
};

export type VisitationRow = {
  parkname: string;
  unitcode: string;
  month: number;
  avg_recreation_visits: number;
  min_recreation_visits: number;
  max_recreation_visits: number;
};

export type VCPointRow = {
  id: string | number;
  unitcode: string;
  geometry: string;
};

export type SitePolyRow = {
  id: string;
  geometry: string;
  parks_within_30_mi_unitcodes: string;
};
