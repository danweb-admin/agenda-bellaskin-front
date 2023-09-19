import { CalendarSpecifications } from "./calendarSpecifications";

export interface Calendar {
    id: string;
    equipament: string;
    equipamentId: string;
    lessee: string,
    clientId: string,
    date: string,
    note: string,
    time: string,
    technique: string,
    techniqueId: string,
    driver: string,
    driverId: string,
    driverCollectsId: string,
    status: string,
    startTime1: string,
    startTime: string,
    endTime1: string,
    endTime: string,
    calendarSpecifications: CalendarSpecifications[]
  }