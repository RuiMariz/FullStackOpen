import patientData from '../../data/patients';
import { PatientEntry, NonSensitivePatientEntry, NewPatientEntry, NewEntry, Entry } from '../types';
import { v1 as uuid } from 'uuid';

const patients: Array<PatientEntry> = patientData;

const getEntries = (): Array<PatientEntry> => {
  return patients;
};

const getNonSensitiveEntries = (): NonSensitivePatientEntry[] => {
  return patients.map(({ id, name, dateOfBirth, gender, occupation }) => ({
    id,
    name,
    dateOfBirth,
    gender,
    occupation
  }));
};

const addPatient = (entry: NewPatientEntry): PatientEntry => {
  const newEntry = {
    id: uuid(),
    ...entry
  };

  patients.push(newEntry);
  return newEntry;
};

const findById = (id: string): PatientEntry | undefined => {
  const entry = patients.find(p => p.id === id);
  return entry;
};

const addEntry = (patient: PatientEntry, entry: NewEntry): PatientEntry => {
  const newEntry = {
    id: uuid(),
    ...entry
  };
  patient.entries.push(newEntry as Entry);
  return patient;
};

export default { getEntries, getNonSensitiveEntries, addPatient, findById, addEntry };