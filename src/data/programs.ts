import { Program } from '../types';

export const BUILTIN_PROGRAMS: Program[] = [
  {
    id: 'gymlog',
    name: 'GymLog',
    groups: [
      {
        name: 'Chest + Triceps',
        exercises: [
          'Barbell Bench Press',
          'Incline Dumbbell Press',
          'Chest Press Machine',
          'Cable Crossover',
          'Dips',
          'Rope Pushdown',
          'Overhead Dumbbell Extension',
        ],
      },
      {
        name: 'Mugura + Biceps',
        exercises: [
          'Pievilkšanās',
          'Barbell Bent-Over Row',
          'Lat Pulldown',
          'Seated Row',
          'EZ Barbell Curl',
          'Hammer Curl',
          'Concentration Curl',
        ],
      },
      {
        name: 'Kājas',
        exercises: [
          'Squats',
          'Leg Press',
          'Romanian Deadlift',
          'Leg Curl',
          'Leg Extension',
          'Calf Raises',
        ],
      },
      {
        name: 'Pleči + Rokas',
        exercises: [
          'Overhead Press',
          'Lateral Raises',
          'Face Pulls',
          'Barbell Curl',
          'Tricep Pushdown',
        ],
      },
    ],
  },
];
