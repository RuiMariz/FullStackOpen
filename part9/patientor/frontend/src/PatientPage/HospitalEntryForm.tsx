import React from "react";
import { HospitalEntry, Diagnosis } from "../types";
import { Card, Icon } from 'semantic-ui-react';
import { useStateValue } from "../state";

const HospitalEntryForm: React.FC<{ entry: HospitalEntry }> = ({ entry }) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <div>
      <Card fluid>
        <Card.Content>
          <div style={{ display: 'flex' }}>
            <Card.Header content={`${entry.date} - ${entry.specialist}`}></Card.Header>
            <Icon name='bed' size='large' style={{ marginLeft: '5px' }} />
            discharge: {entry.discharge.date}
          </div>
          <Card.Meta content={entry.description} />
          <ul>
            {entry.diagnosisCodes && entry.diagnosisCodes?.map(code => <div key={code}>
              <li>{code} {Object.values(diagnoses).find((diagnosis: Diagnosis) => diagnosis.code === code)?.name}</li>
            </div>
            )}
          </ul>
        </Card.Content>
      </Card>
    </div>
  );
};

export default HospitalEntryForm;