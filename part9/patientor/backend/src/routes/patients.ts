/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import express from 'express';
import patientService from '../services/patientService';
import toNewPatientEntry from '../utils';

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
    const newEntry = patientService.addEntry(toNewPatientEntry({ name, dateOfBirth, ssn, gender, occupation }));
    res.json(newEntry);
  } catch (e: unknown) {
    if (e instanceof Error) {
      res.status(400).json({ error: e.message });
    } else {
      res.status(400).json({ error: 'Error, something bad happened' });
    }
  }
});

export default router;