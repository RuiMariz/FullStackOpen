import express = require('express');
import { calculateBmi, parseArgumentsBmiCalculator } from './bmiCalculator';
import { calculateExercises, parseArgumentsExerciseCalculator } from './exerciseCalculator';
const app = express();
app.use(express.json());

interface reqPostExercises {
  body: {
    target: string,
    daily_exercises: string[]
  }
}

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = req.query.height;
  const weight = req.query.weight;
  try {
    const bmi = calculateBmi(parseArgumentsBmiCalculator(['', '', String(height), String(weight)]));
    res.json({ height: Number(height), weight: Number(weight), bmi: bmi });
  } catch (e: unknown) {
    if (e instanceof Error) {
      res.json({ error: e.message });
    } else {
      res.json({ error: 'Error, something bad happened' });
    }
  }
});

app.post("/exercises", (req: reqPostExercises, res) => {
  const target = req.body.target;
  const daily_exercises = req.body.daily_exercises;
  try {
    const result = calculateExercises(parseArgumentsExerciseCalculator(['', '', target, ...daily_exercises]));
    res.json(result);
  } catch (e: unknown) {
    if (e instanceof Error) {
      res.json({ error: e.message });
    } else {
      res.json({ error: 'Error, something bad happened' });
    }
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});