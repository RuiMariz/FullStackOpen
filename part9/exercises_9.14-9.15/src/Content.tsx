import React from 'react';
import { CoursePart } from './types';
import Part from './Part';

const Content = ({ courseParts }: { courseParts: CoursePart[] }) => {
  return (
    <div>
      {courseParts.map(c=> <Part key={c.name} coursePart={c}></Part>)}
    </div>
  )
};

export default Content