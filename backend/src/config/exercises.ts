export const exercises = [
  {
    id: 'squat',
    name: 'Squat',
    category: 'lower-body',
    description: 'A basic squat exercise.',
    view: 'front',
    primaryAngle: 'knee',
    instructions: ['Stand up straight', 'Bend your knees'],
    commonMistakes: ['Knees too far forward'],
    recommendedReps: 10,
    hasAnalyzer: true
  },
  {
    id: 'shoulder-raise',
    name: 'Shoulder Raise',
    category: 'upper-body',
    description: 'Shoulder raise exercise.',
    view: 'side',
    primaryAngle: 'shoulder',
    instructions: ['Raise your arms'],
    commonMistakes: ['Raising too high'],
    recommendedReps: 10,
    hasAnalyzer: true
  },
  {
    id: 'leg-raise',
    name: 'Leg Raise',
    category: 'lower-body',
    description: 'Leg raise exercise.',
    view: 'side',
    primaryAngle: 'hip',
    instructions: ['Raise your leg'],
    commonMistakes: ['Bending knee'],
    recommendedReps: 10,
    hasAnalyzer: true
  },
  {
    id: 'sit-to-stand',
    name: 'Sit to Stand',
    category: 'full-body',
    description: 'Sit to stand exercise.',
    view: 'side',
    primaryAngle: 'hip',
    instructions: ['Sit down', 'Stand up'],
    commonMistakes: ['Using hands to push up'],
    recommendedReps: 10,
    hasAnalyzer: false
  },
  {
    id: 'heel-raise',
    name: 'Heel Raise',
    category: 'lower-body',
    description: 'Heel raise exercise.',
    view: 'back',
    primaryAngle: 'ankle',
    instructions: ['Raise your heels'],
    commonMistakes: ['Leaning forward'],
    recommendedReps: 10,
    hasAnalyzer: false
  },
  {
    id: 'knee-extension',
    name: 'Knee Extension',
    category: 'lower-body',
    description: 'Knee extension exercise.',
    view: 'front',
    primaryAngle: 'knee',
    instructions: ['Extend your knee'],
    commonMistakes: ['Moving hip'],
    recommendedReps: 10,
    hasAnalyzer: false
  }
];
