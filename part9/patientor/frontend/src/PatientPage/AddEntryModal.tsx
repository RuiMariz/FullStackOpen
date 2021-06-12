import { Field, Formik } from 'formik';
import React from 'react';
import { Button, Form, Grid, Modal, Segment } from 'semantic-ui-react';
import { DiagnosisSelection, NumberField, TextField } from '../AddPatientModal/FormField';
import { useStateValue } from '../state';
import { Entry, EntryType, HospitalEntry, OccupationalHealthcareEntry } from '../types';

export type EntryFormValues = Omit<Entry, 'id'>;
interface Props {
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryFormValues) => void;
  error?: string;
}

const AddEntryModal = ({ modalOpen, onClose, onSubmit, error }: Props) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
      <Modal.Header>Add a new entry</Modal.Header>
      <Modal.Content>
        {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
        <Formik
          initialValues={{
            description: "",
            date: "",
            specialist: "",
            type: EntryType.Hospital,
            discharge: { date: "", criteria: "" },
            employerName: "",
            sickLeave: { startDate: "", endDate: "" },
            healthCheckRating: 0,
          } as EntryFormValues}
          onSubmit={onSubmit}
          validate={values => {
            const requiredError = "Field is required";
            const errors: { [field: string]: string } = {};
            if (!values.description) {
              errors.description = requiredError;
            }
            if (!values.date) {
              errors.date = requiredError;
            }
            if (!values.specialist) {
              errors.specialist = requiredError;
            }
            if (values.type === EntryType.Hospital) {
              const castValues = values as Omit<HospitalEntry, 'id'>;
              if (!castValues.discharge.date) {
                errors.dischargeDate = requiredError;
              }
              if (!castValues.discharge.criteria) {
                errors.dischargeCriteria = requiredError;
              }
            } else if (values.type === EntryType.OccupationalHealthcare) {
              const castValues = values as Omit<OccupationalHealthcareEntry, 'id'>;
              if (!castValues.employerName) {
                errors.employerName = requiredError;
              }
            }
            return errors;
          }}
        >
          {({ isValid, dirty, setFieldValue, setFieldTouched, values }) => {
            return (
              <Form className="form ui">
                <SelectField
                  label="Type"
                  name="type"
                  options={entryTypeOptions}
                />
                <Field
                  label="Description"
                  placeholder="Description"
                  name="description"
                  component={TextField}
                />
                <Field
                  label="Date"
                  placeholder="YYYY-MM-DD"
                  name="date"
                  component={TextField}
                />
                <Field
                  label="Specialist"
                  placeholder="Specialist"
                  name="specialist"
                  component={TextField}
                />
                {values.type === EntryType.Hospital &&
                  <div>
                    <Field
                      label="Discharge Date"
                      placeholder="YYYY-MM-DD"
                      name="discharge.date"
                      component={TextField}
                    />
                    <Field
                      label="Discharge Criteria"
                      placeholder="Criteria"
                      name="discharge.criteria"
                      component={TextField}
                    />
                  </div>
                }
                {values.type === EntryType.OccupationalHealthcare &&
                  <div>
                    <Field
                      label="Employer Name"
                      placeholder="Employer Name"
                      name="employerName"
                      component={TextField}
                    />
                    <Field
                      label="Sick Leave Start Date"
                      placeholder="YYYY-MM-DD"
                      name="sickLeave.startDate"
                      component={TextField}
                    />
                    <Field
                      label="Sick Leave End Date"
                      placeholder="YYYY-MM-DD"
                      name="sickLeave.endDate"
                      component={TextField}
                    />
                  </div>
                }
                {values.type === EntryType.HealthCheck &&
                  <Field
                    label="healthCheckRating"
                    name="healthCheckRating"
                    component={NumberField}
                    min={0}
                    max={3}
                  />
                }
                <DiagnosisSelection
                  setFieldValue={setFieldValue}
                  setFieldTouched={setFieldTouched}
                  diagnoses={Object.values(diagnoses)}
                />
                <Grid>
                  <Grid.Column floated="left" width={5}>
                    <Button type="button" onClick={onClose} color="red">
                      Cancel
                    </Button>
                  </Grid.Column>
                  <Grid.Column floated="right" width={5}>
                    <Button
                      type="submit"
                      floated="right"
                      color="green"
                      disabled={!dirty || !isValid}
                      onClick={() => onSubmit(values)}
                    >
                      Add
                    </Button>
                  </Grid.Column>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </Modal.Content>
    </Modal>
  );
};

const entryTypeOptions: EntryTypeOption[] = [
  { value: EntryType.Hospital, label: "Hospital" },
  { value: EntryType.OccupationalHealthcare, label: "Occupational Healthcare" },
  { value: EntryType.HealthCheck, label: "Health Check" }
];

export type EntryTypeOption = {
  value: EntryType;
  label: string;
};

type SelectFieldProps = {
  name: string;
  label: string;
  options: EntryTypeOption[];
};

export const SelectField = ({
  name,
  label,
  options
}: SelectFieldProps) => (
  <Form.Field>
    <label>{label}</label>
    <Field as="select" name={name} className="ui dropdown">
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label || option.value}
        </option>
      ))}
    </Field>
  </Form.Field>
);

export default AddEntryModal;