import React, { useEffect } from "react";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { useStateValue, addPatient } from "../state";
import { useParams } from 'react-router-dom';
import { Patient, Entry } from "../types";
import { Icon } from 'semantic-ui-react';
import HospitalEntryForm from './HospitalEntryForm';
import OccupationalHealthcareForm from './OccupationalHealthcareForm';
import HealthCheckForm from './HealthCheckForm';

const PatientPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [, setError] = React.useState<string | undefined>();
  const { id } = useParams<{ id: string }>();
  const patient = Object.values(patients).find((patient: Patient) => patient.id === id);

  useEffect(() => {
    const getPatient = async () => {
      try {
        const { data: newPatient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        if (!newPatient)
          return;
        dispatch(addPatient(newPatient));
      } catch (e) {
        console.error(e.response?.data || 'Unknown Error');
        setError(e.response?.data?.error || 'Unknown error');
      }
    };
    if (!patient || !patient.ssn) {
      void getPatient();
    }
  }, [id, patient]);

  const EntryDetails = (entry: Entry) => {
    switch (entry.type) {
      case 'Hospital':
        return <HospitalEntryForm entry={entry} />;
      case 'OccupationalHealthcare':
        return <OccupationalHealthcareForm entry={entry} />;
      case 'HealthCheck':
        return <HealthCheckForm entry={entry} />;
      default:
        return <div></div>;
    }
  };

  if (!patient) {
    return null;
  }
  return (
    <div>
      <h2>{patient.name} {patient.gender === 'male' ? <Icon name='man' /> : patient.gender === 'female' ? <Icon name='woman' /> : <Icon name='genderless' />}</h2>
      ssn: {patient.ssn}<br />
      occupation: {patient.occupation}<br />
      <h3>entries</h3>
      {patient.entries && patient.entries.map(entry =>
        <div key={entry.id}>
          {EntryDetails(entry)}
        </div>
      )}
    </div>
  );
};

export default PatientPage;