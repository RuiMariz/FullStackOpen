import React from "react";
import { OccupationalHealthcareEntry, Diagnosis } from "../types";
import { Card, Icon } from 'semantic-ui-react';
import { useStateValue } from "../state";

const OccupationalHealthcareForm: React.FC<{ entry: OccupationalHealthcareEntry }> = ({ entry }) => {
  const [{ diagnoses }] = useStateValue();
  return (
    <div>
      <Card fluid>
        <Card.Content>
          <div style={{ display: 'flex' }}>
            <Card.Header content={`${entry.date} - ${entry.specialist}`}></Card.Header>
            <Icon name='medkit' size='large' style={{ marginLeft: '5px' }} />
            {entry.sickLeave && <div>sick leave: {entry.sickLeave?.startDate} - {entry.sickLeave?.endDate}</div>}
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

export default OccupationalHealthcareForm;