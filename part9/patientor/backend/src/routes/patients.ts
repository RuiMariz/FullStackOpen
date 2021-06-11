/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import patientService from '../services/patientService';
import { toNewEntry, toNewPatientEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientService.getNonSensitiveEntries());
});

router.get('/:id', (req, res) => {
  const id = req.params.id;
  const patient = patientService.findById(id);
  if (patient) {
    return res.json(patient);
  } else {
    return res.sendStatus(404);
  }
});

router.post('/', (req, res) => {
  const { name, dateOfBirth, ssn, gender, occupation } = req.body;
  try {
    const newEntry = patientService.addPatient(toNewPatientEntry({ name, dateOfBirth, ssn, gender, occupation }));
    res.json(newEntry);
  } catch (e: unknown) {
    if (e instanceof Error) {
      res.status(400).json({ error: e.message });
    } else {
      res.status(400).json({ error: 'Error, something bad happened' });
    }
  }
});

router.post('/:id/entries', (req, res) => {
  const id = req.params.id;
  try {
    const patient = patientService.findById(id);
    if (!patient)
      return res.sendStatus(404);
    const { description, date, specialist, diagnosisCodes, type, discharge, employerName, sickLeave, healthCheckRating } = req.body;
    const returnedPatient = patientService.addEntry(patient, toNewEntry({ description, date, specialist, diagnosisCodes, type, discharge, employerName, sickLeave, healthCheckRating }));
    return res.json(returnedPatient);
  } catch (e: unknown) {
    if (e instanceof Error) {
      return res.status(400).json({ error: e.message });
    } else {
      return res.status(400).json({ error: 'Error, something bad happened' });
    }
  }
});

export default router;