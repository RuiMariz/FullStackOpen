import React from "react";
import { Message } from "semantic-ui-react";

const Alert = ({ message, type }: { message: string, type: string }) => {
  return (
    <div>
      {type === 'success' &&
        <Message positive>
          <Message.Header>Success</Message.Header>
          <p>
            {message}
          </p>
        </Message>
      }
      {type === 'error' &&
        <Message negative>
          <Message.Header>Error</Message.Header>
          <p>
            {message}
          </p>
        </Message>
      }
    </div>
  );
};

export default Alert;