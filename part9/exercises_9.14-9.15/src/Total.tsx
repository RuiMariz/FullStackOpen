import React from 'react';
import { CoursePartInterface } from './Types';

const Total = ({ courseParts }: { courseParts: CoursePartInterface[] }) => {
  return (
    <div>
      <p>
        Number of exercises{" "}
        {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
      </p>
    </div>
  )
};

export default Total