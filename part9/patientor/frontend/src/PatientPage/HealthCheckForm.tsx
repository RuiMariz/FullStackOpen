import React from "react";
import { HealthCheckEntry, Diagnosis } from "../types";
import { Card, Icon } from 'semantic-ui-react';
import { useStateValue } from "../state";

const HealthCheckForm: React.FC<{ entry: HealthCheckEntry }> = ({ entry }) => {
  const [{ diagnoses }] = useStateValue();
  if (!entry)
    return null;
  return (
    <div>
      <Card fluid>
        <Card.Content>
          <div style={{ display: 'flex' }}>
            <Card.Header content={`${entry.date} - ${entry.specialist}`}></Card.Header>
            <Icon name='doctor' size='large' style={{ marginLeft: '5px' }} />
          </div>
          <Card.Meta content={entry.description} />
          <ul>
            {entry.diagnosisCodes && entry.diagnosisCodes?.map(code => <div key={code}>
              <li>{code} {Object.values(diagnoses).find((diagnosis: Diagnosis) => diagnosis.code === code)?.name}</li>
            </div>
            )}
          </ul>
          {entry.healthCheckRating === 0 && <Icon name='heart' size='large' style={{ color: 'green' }} />}
          {entry.healthCheckRating === 1 && <Icon name='heart' size='large' style={{ color: 'GreenYellow' }} />}
          {entry.healthCheckRating === 2 && <Icon name='heart' size='large' style={{ color: 'orange' }} />}
          {entry.healthCheckRating === 3 && <Icon name='heart' size='large' style={{ color: 'red' }} />}
        </Card.Content>
      </Card>
    </div>
  );
};

export default HealthCheckForm;