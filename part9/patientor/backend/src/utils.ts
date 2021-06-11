import { NewPatientEntry, Gender, NewEntry, EntryType, DiagnoseEntry, NewHospitalEntry, NewOccupationalHealthcareEntry, NewHealthCheckEntry, HealthCheckRating } from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseString = (str: unknown, param: string): string => {
  if (!str || !isString(str)) {
    throw new Error(`Incorrect or missing ${param}`);
  }
  return str;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error('Incorrect or missing date: ' + date);
  }
  return date;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (param: any): param is Gender => {
  return Object.values(Gender).includes(param);
};

const parseGender = (gender: unknown): Gender => {
  if (!gender || !isGender(gender)) {
    throw new Error('Incorrect or missing gender: ' + gender);
  }
  return gender;
};

type Fields = { name: unknown, dateOfBirth: unknown, ssn: unknown, gender: unknown, occupation: unknown };
const toNewPatientEntry = ({ name, dateOfBirth, ssn, gender, occupation }: Fields): NewPatientEntry => {
  const newEntry: NewPatientEntry = {
    name: parseString(name, 'name'),
    dateOfBirth: parseDate(dateOfBirth),
    ssn: parseString(ssn, 'ssn'),
    gender: parseGender(gender),
    occupation: parseString(occupation, 'occupation'),
    entries: []
  };
  return newEntry;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isEntryType = (param: any): param is EntryType => {
  return Object.values(EntryType).includes(param);
};

const parseEntryType = (type: unknown): EntryType => {
  if (!type || !isEntryType(type)) {
    throw new Error('Incorrect or missing entry type: ' + type);
  }
  return type;
};

const parseDiagnosisCodes = (codes: unknown): Array<DiagnoseEntry['code']> => {
  if (!codes) {
    return [];
  }
  if (Array.isArray(codes) && codes.every(element => isString(element))) {
    return codes as Array<DiagnoseEntry['code']>;
  } else {
    throw new Error('Incorrect diagnosis codes: ' + codes);
  }
};

const parseDischarge = (discharge: unknown): { date: string, criteria: string } => {
  if (discharge && typeof discharge === 'object' && 'date' in discharge && 'criteria' in discharge) {
    const castDischarge = discharge as { date: string, criteria: string };
    if (parseDate(castDischarge.date) && parseString(castDischarge.criteria, 'criteria')) {
      return discharge as { date: string, criteria: string };
    }
  }
  throw new Error('Incorrect or missing discharge: ' + discharge);
};

const parseSickLeave = (sickLeave: unknown): { startDate: string, endDate: string } | undefined => {
  if (!sickLeave)
    return undefined;
  if (sickLeave && typeof sickLeave === 'object' && 'startDate' in sickLeave && 'endDate' in sickLeave) {
    const castSickLeave = sickLeave as { startDate: string, endDate: string };
    if (parseDate(castSickLeave.startDate) && parseDate(castSickLeave.endDate)) {
      return sickLeave as { startDate: string, endDate: string };
    }
  }
  throw new Error('Incorrect sick leave: ' + sickLeave);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isHealthCheckRating = (param: any): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (rating: unknown): HealthCheckRating => {
  if (rating !== undefined && isHealthCheckRating(rating)) {
    return rating;
  } else {
    throw new Error('Incorrect or missing health check rating: ' + rating);
  }
};

type EntryFields = { description: unknown, date: unknown, specialist: unknown, diagnosisCodes: unknown, type: unknown, discharge: unknown, employerName: unknown, sickLeave: unknown, healthCheckRating: unknown };
const toNewEntry = ({ description, date, specialist, diagnosisCodes, type, discharge, employerName, sickLeave, healthCheckRating }: EntryFields): NewEntry => {
  const parsedType = parseEntryType(type);
  if (parsedType === EntryType.Hospital) {
    const HospitalEntry: NewHospitalEntry = {
      description: parseString(description, 'description'),
      date: parseDate(date),
      specialist: parseString(specialist, 'specialist'),
      diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
      type: parsedType,
      discharge: parseDischarge(discharge)
    };
    return HospitalEntry;
  } else if (parsedType === EntryType.OccupationalHealthcare) {
    const OccupationalHealthcareEntry: NewOccupationalHealthcareEntry = {
      description: parseString(description, 'description'),
      date: parseDate(date),
      specialist: parseString(specialist, 'specialist'),
      diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
      type: parsedType,
      employerName: parseString(employerName, 'employer name'),
      sickLeave: parseSickLeave(sickLeave)
    };
    return OccupationalHealthcareEntry;
  } else {
    const NewHealthCheckEntry: NewHealthCheckEntry = {
      description: parseString(description, 'description'),
      date: parseDate(date),
      specialist: parseString(specialist, 'specialist'),
      diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),
      type: parsedType,
      healthCheckRating: parseHealthCheckRating(healthCheckRating)
    };
    return NewHealthCheckEntry;
  }
};

export { toNewPatientEntry, toNewEntry };