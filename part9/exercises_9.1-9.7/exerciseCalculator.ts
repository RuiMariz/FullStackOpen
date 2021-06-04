interface Result {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
};

const calculateExercises = (exerciseHours: number[], target: number): Result => {
  const periodLength = exerciseHours.length;
  const trainingDays = exerciseHours.reduce((acc, curr) => curr > 0 ? acc + 1 : acc, 0);
  const average = exerciseHours.reduce((acc, curr) => acc + curr, 0) / periodLength;
  
  let rating, ratingDescription;
  if (average < target) {
    rating = 1;
    ratingDescription = 'Not good enough';
  } else if (average < target * 1.5) {
    rating = 2;
    ratingDescription = 'Good job, you achieved your goal!';
  } else {
    rating = 3;
    ratingDescription = 'Great job, you exceeded your goal!';
  }

  return {
    periodLength,
    trainingDays,
    success: average >= target ? true : false,
    rating,
    ratingDescription,
    target,
    average
  }
}

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2))