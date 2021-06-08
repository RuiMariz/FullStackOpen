import React from 'react';
import {CoursePartInterface} from './Types';
import Header from './Header';
import Content from './Content';
import Total from './Total';

const App = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePartInterface[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14
    }
  ];

  return (
    <div>
      <Header courseName={courseName}></Header>
      <Content courseParts={courseParts}></Content>
      <Total courseParts={courseParts}></Total>
    </div>
  );
};

export default App;
