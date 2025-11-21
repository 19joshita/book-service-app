export interface Booking {
  id: string; // uuid or timestamp
  serviceId: string; // reference to Service
  serviceName: string; // name of service
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string; // optional notes
}
