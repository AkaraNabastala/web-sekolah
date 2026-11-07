// Domain models: admissions

export interface PPDBFeeItem {
  item: string;
  nominal: string;
  note?: string;
}

export interface PPDBScheduleItem {
  phase: string;
  period: string;
  notes?: string;
}

export interface PPDBStepItem {
  step: number;
  title: string;
  desc: string;
}

export interface PPDBInfo {
  id: number;
  academic_year: string;
  is_open: boolean | number;
  start_date?: string;
  end_date?: string;
  banner_image?: string;
  overview: string;
  requirements: string[];
  schedules: PPDBScheduleItem[];
  steps: PPDBStepItem[];
  show_fees: boolean | number;
  fees_description: string;
  fees_items: PPDBFeeItem[];
  contact_person: string;
  contact_phone: string;
  contact_whatsapp: string;
  registration_url?: string;
}
