interface ExerciseCalculatorValues {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

const parseArgumentsExerciseCalculator = (args: Array<string>): number[] => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const numbers = [];
  for (let i = 2; i < args.length; i++) {
    if (isNaN(Number(args[i]))) {
      throw new Error('Provided values were not numbers!');
    } else {
      numbers.push(Number(args[i]));
    }
  }
  return numbers;
};

const calculateExercises = (args: number[]): ExerciseCalculatorValues => {
  const target = args[0];
  const exerciseHours = args.slice(1);
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
  };
};

try {
  console.log(calculateExercises(parseArgumentsExerciseCalculator(process.argv)));
} catch (e: unknown) {
  if (e instanceof Error) {
    console.log('Error, something bad happened, message: ', e.message);
  } else {
    console.log('Error, something bad happened');
  }
}