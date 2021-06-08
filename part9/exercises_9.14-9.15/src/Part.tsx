import React from 'react';
import { CoursePart } from './types';

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ coursePart }: { coursePart: CoursePart }) => {
  switch (coursePart.type) {
    case 'normal':
      return (
        <p>
          <strong>name:</strong> {coursePart.name} <strong>description:</strong> {coursePart.description}
          <strong> exercise count:</strong> {coursePart.exerciseCount}
        </p>
      );
    case 'groupProject':
      return (
        <p>
          <strong>name:</strong> {coursePart.name} <strong>group project count:</strong> {coursePart.groupProjectCount}
          <strong> exercise count:</strong> {coursePart.exerciseCount}
        </p>
      );
    case 'submission':
      return (
        <p>
          <strong>name:</strong> {coursePart.name} <strong>description:</strong> {coursePart.description}
          <strong> exercise count:</strong> {coursePart.exerciseCount} <strong>exercise submission link:</strong> {coursePart.exerciseSubmissionLink}
        </p>
      );
    case 'special':
      return (
        <p>
          <strong>name:</strong> {coursePart.name} <strong>description:</strong> {coursePart.description}
          <strong> exercise count:</strong> {coursePart.exerciseCount} <strong>requirements:</strong> {coursePart.requirements.toString()}
        </p>
      );
    default:
      return assertNever(coursePart);
  }
};

export default Part