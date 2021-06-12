import React, { useEffect } from "react";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { useStateValue, addPatient } from "../state";
import { useParams } from 'react-router-dom';
import { Patient, Entry, EntryType, OccupationalHealthcareEntry } from "../types";
import { Button, Icon } from 'semantic-ui-react';
import HospitalEntryForm from './HospitalEntryForm';
import OccupationalHealthcareForm from './OccupationalHealthcareForm';
import HealthCheckForm from './HealthCheckForm';
import AddEntryModal, { EntryFormValues } from "./AddEntryModal";
import Alert from "../components/Alert";

let previousTimeoutID: number;

const PatientPage = () => {
  const [{ patients }, dispatch] = useStateValue();
  const [error, setError] = React.useState<string | undefined>();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const patient = Object.values(patients).find((patient: Patient) => patient.id === id);
  const [alert, setAlert] = React.useState<{ message: string, type: string }>({ message: "", type: "" });

  useEffect(() => {
    const getPatient = async () => {
      try {
        const { data: newPatient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        if (!newPatient)
          return;
        dispatch(addPatient(newPatient));
      } catch (e) {
        console.error(e);
        showErrorMessage(e.response?.data?.error || 'Unknown error');
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

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      if (values.type === EntryType.OccupationalHealthcare) {
        const castValues = { ...values as OccupationalHealthcareEntry };
        //for the case where there is no sick leave
        if (castValues.sickLeave?.startDate === '' && castValues.sickLeave?.endDate === '') {
          castValues.sickLeave = undefined;
          const { data: updatedPatient } = await axios.post<Patient>(
            `${apiBaseUrl}/patients/${patient?.id as string}/entries`, castValues);
          dispatch(addPatient(updatedPatient));
          showSuccessMessage('Entry added');
          closeModal();
          return;
        }
      }
      //for all other cases
      const { data: updatedPatient } = await axios.post<Patient>(
        `${apiBaseUrl}/patients/${patient?.id as string}/entries`, values);
      dispatch(addPatient(updatedPatient));
      showSuccessMessage('Entry added');
      closeModal();
    } catch (e) {
      showErrorMessage(e.response?.data?.error || 'Unknown error');
      console.error(e.response?.data || 'Unknown Error');
      closeModal();
    }
  };

  const showSuccessMessage = (message: string) => {
    setAlert({ message: message, type: 'success' });
    clearTimeout(previousTimeoutID);
    previousTimeoutID = Number(setTimeout(() => {
      setAlert({ message: '', type: '' });
    }, 5000));
  };

  const showErrorMessage = (message: string) => {
    setAlert({ message: message, type: 'error' });
    clearTimeout(previousTimeoutID);
    previousTimeoutID = Number(setTimeout(() => {
      setAlert({ message: '', type: '' });
    }, 5000));
  };

  if (!patient) {
    return null;
  }
  return (
    <div>
      <Alert message={alert.message} type={alert.type} />
      <h2>{patient.name} {patient.gender === 'male' ? <Icon name='man' /> : patient.gender === 'female' ? <Icon name='woman' /> : <Icon name='genderless' />}</h2>
      ssn: {patient.ssn}<br />
      occupation: {patient.occupation}<br />
      <h3>entries</h3>
      {patient.entries && patient.entries.map(entry =>
        <div key={entry.id}>
          {EntryDetails(entry)}
        </div>
      )}
      <AddEntryModal
        modalOpen={modalOpen}
        onClose={closeModal}
        onSubmit={submitNewEntry}
        error={error}
      />
      <div style={{ marginTop: '15px' }}>
        <Button onClick={() => openModal()}>Add New Entry</Button>
      </div>
    </div>
  );
};

export default PatientPage;