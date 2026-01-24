// Prepopulated exercise database
export const exercises = [
  // CHEST EXERCISES
  {
    id: 'bench_press',
    name: 'Bench Press',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['pectoralis_major_lower', 'pectoralis_major_upper'],
    secondaryMuscles: ['anterior_deltoid', 'triceps_brachii'],
    compatibleMachines: ['barbell', 'bench_flat'],
    instructions: 'Lie flat on bench. Grip bar slightly wider than shoulder width. Lower bar to chest, press up to full extension.'
  },
  {
    id: 'incline_bench_press',
    name: 'Incline Bench Press',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['pectoralis_major_upper'],
    secondaryMuscles: ['anterior_deltoid', 'triceps_brachii'],
    compatibleMachines: ['barbell', 'bench_adjustable'],
    instructions: 'Set bench to 30-45 degree incline. Lower bar to upper chest, press up.'
  },
  {
    id: 'dumbbell_press',
    name: 'Dumbbell Press',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['pectoralis_major_lower', 'pectoralis_major_upper'],
    secondaryMuscles: ['anterior_deltoid', 'triceps_brachii'],
    compatibleMachines: ['dumbbells', 'bench_flat'],
    instructions: 'Lie on bench with dumbbells. Press up from chest level, bring together at top.'
  },
  {
    id: 'dumbbell_fly',
    name: 'Dumbbell Fly',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['pectoralis_major_lower', 'pectoralis_major_upper'],
    secondaryMuscles: [],
    compatibleMachines: ['dumbbells', 'bench_flat'],
    instructions: 'Lie on bench. Lower dumbbells out to sides with slight bend in elbows, bring back together.'
  },
  {
    id: 'cable_fly',
    name: 'Cable Fly',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['pectoralis_major_lower', 'pectoralis_major_upper'],
    secondaryMuscles: [],
    compatibleMachines: ['cable_dual', 'cable_crossover'],
    instructions: 'Stand between cables set at shoulder height. Bring handles together in front of chest.'
  },
  {
    id: 'push_up',
    name: 'Push-up',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['pectoralis_major_lower', 'pectoralis_major_upper'],
    secondaryMuscles: ['anterior_deltoid', 'triceps_brachii'],
    compatibleMachines: [],
    instructions: 'Start in plank position. Lower body until chest nearly touches floor, push back up.'
  },
  {
    id: 'chest_press_machine',
    name: 'Chest Press Machine',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['pectoralis_major_lower', 'pectoralis_major_upper'],
    secondaryMuscles: ['anterior_deltoid', 'triceps_brachii'],
    compatibleMachines: ['chest_press_machine'],
    instructions: 'Adjust seat height. Press handles forward until arms fully extended.'
  },

  // BACK EXERCISES
  {
    id: 'deadlift',
    name: 'Deadlift',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['erector_spinae', 'latissimus_dorsi'],
    secondaryMuscles: ['gluteus_maximus', 'hamstrings', 'trapezius_middle'],
    compatibleMachines: ['barbell'],
    instructions: 'Stand with feet hip-width. Grip bar, keep back straight, lift by extending hips and knees.'
  },
  {
    id: 'barbell_row',
    name: 'Barbell Row',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['latissimus_dorsi', 'rhomboids'],
    secondaryMuscles: ['trapezius_middle', 'biceps_brachii'],
    compatibleMachines: ['barbell'],
    instructions: 'Bend at hips, keep back straight. Pull bar to lower chest, squeeze shoulder blades.'
  },
  {
    id: 'pull_up',
    name: 'Pull-up',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['latissimus_dorsi'],
    secondaryMuscles: ['biceps_brachii', 'rhomboids'],
    compatibleMachines: ['pull_up_bar'],
    instructions: 'Hang from bar with overhand grip. Pull body up until chin clears bar.'
  },
  {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['latissimus_dorsi'],
    secondaryMuscles: ['biceps_brachii', 'rhomboids'],
    compatibleMachines: ['lat_pulldown_machine'],
    instructions: 'Sit at machine. Pull bar down to upper chest, squeeze lats.'
  },
  {
    id: 'cable_row',
    name: 'Cable Row',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['latissimus_dorsi', 'rhomboids'],
    secondaryMuscles: ['biceps_brachii', 'trapezius_middle'],
    compatibleMachines: ['cable_single', 'cable_dual', 'seated_row_machine'],
    instructions: 'Sit with feet on platform. Pull handle to torso, squeeze shoulder blades.'
  },
  {
    id: 'dumbbell_row',
    name: 'Dumbbell Row',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['latissimus_dorsi', 'rhomboids'],
    secondaryMuscles: ['biceps_brachii', 'trapezius_middle'],
    compatibleMachines: ['dumbbells', 'bench_flat'],
    instructions: 'Support one hand on bench. Pull dumbbell to hip, keep elbow close to body.'
  },

  // SHOULDER EXERCISES
  {
    id: 'overhead_press',
    name: 'Overhead Press',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['anterior_deltoid', 'lateral_deltoid'],
    secondaryMuscles: ['triceps_brachii', 'trapezius_upper'],
    compatibleMachines: ['barbell', 'squat_rack'],
    instructions: 'Stand with bar at shoulder height. Press overhead until arms fully extended.'
  },
  {
    id: 'dumbbell_shoulder_press',
    name: 'Dumbbell Shoulder Press',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['anterior_deltoid', 'lateral_deltoid'],
    secondaryMuscles: ['triceps_brachii'],
    compatibleMachines: ['dumbbells', 'bench_adjustable'],
    instructions: 'Sit with dumbbells at shoulder height. Press up until arms extended overhead.'
  },
  {
    id: 'lateral_raise',
    name: 'Lateral Raise',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['lateral_deltoid'],
    secondaryMuscles: [],
    compatibleMachines: ['dumbbells'],
    instructions: 'Stand with dumbbells at sides. Raise arms out to shoulder height, slight bend in elbows.'
  },
  {
    id: 'front_raise',
    name: 'Front Raise',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['anterior_deltoid'],
    secondaryMuscles: [],
    compatibleMachines: ['dumbbells'],
    instructions: 'Stand with dumbbells in front of thighs. Raise arms forward to shoulder height.'
  },
  {
    id: 'face_pull',
    name: 'Face Pull',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['posterior_deltoid'],
    secondaryMuscles: ['trapezius_middle', 'rhomboids'],
    compatibleMachines: ['cable_single', 'cable_dual'],
    instructions: 'Pull rope to face level, flare elbows out. Squeeze shoulder blades together.'
  },

  // ARM EXERCISES
  {
    id: 'barbell_curl',
    name: 'Barbell Curl',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['biceps_brachii'],
    secondaryMuscles: ['forearm_flexors'],
    compatibleMachines: ['barbell'],
    instructions: 'Stand with barbell at thighs. Curl up to shoulders, keep elbows stationary.'
  },
  {
    id: 'dumbbell_curl',
    name: 'Dumbbell Curl',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['biceps_brachii'],
    secondaryMuscles: ['forearm_flexors'],
    compatibleMachines: ['dumbbells'],
    instructions: 'Stand with dumbbells at sides. Curl up, rotating palms up at top.'
  },
  {
    id: 'hammer_curl',
    name: 'Hammer Curl',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['biceps_brachii'],
    secondaryMuscles: ['forearm_flexors'],
    compatibleMachines: ['dumbbells'],
    instructions: 'Stand with dumbbells at sides, palms facing in. Curl up maintaining grip position.'
  },
  {
    id: 'tricep_pushdown',
    name: 'Tricep Pushdown',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['triceps_brachii'],
    secondaryMuscles: [],
    compatibleMachines: ['cable_single', 'cable_dual'],
    instructions: 'Stand at cable with bar at chest height. Push down until arms fully extended.'
  },
  {
    id: 'tricep_dips',
    name: 'Tricep Dips',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['triceps_brachii'],
    secondaryMuscles: ['pectoralis_major_lower', 'anterior_deltoid'],
    compatibleMachines: ['dip_station'],
    instructions: 'Support body on parallel bars. Lower until upper arms parallel to floor, push back up.'
  },
  {
    id: 'skull_crusher',
    name: 'Skull Crusher',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['triceps_brachii'],
    secondaryMuscles: [],
    compatibleMachines: ['barbell', 'bench_flat'],
    instructions: 'Lie on bench with bar overhead. Lower bar to forehead by bending elbows, extend back up.'
  },

  // LEG EXERCISES
  {
    id: 'barbell_squat',
    name: 'Barbell Squat',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['quadriceps', 'gluteus_maximus'],
    secondaryMuscles: ['hamstrings', 'erector_spinae'],
    compatibleMachines: ['barbell', 'squat_rack'],
    instructions: 'Bar on upper back. Lower by bending knees and hips, keep chest up. Stand back up.'
  },
  {
    id: 'front_squat',
    name: 'Front Squat',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: ['gluteus_maximus', 'erector_spinae'],
    compatibleMachines: ['barbell', 'squat_rack'],
    instructions: 'Bar on front of shoulders. Squat down keeping torso upright, stand back up.'
  },
  {
    id: 'leg_press',
    name: 'Leg Press',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['quadriceps', 'gluteus_maximus'],
    secondaryMuscles: ['hamstrings'],
    compatibleMachines: ['leg_press_machine'],
    instructions: 'Sit in machine with feet on platform. Push platform away by extending knees and hips.'
  },
  {
    id: 'leg_extension',
    name: 'Leg Extension',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['quadriceps'],
    secondaryMuscles: [],
    compatibleMachines: ['leg_extension_machine'],
    instructions: 'Sit in machine. Extend legs until knees are straight, lower back down with control.'
  },
  {
    id: 'leg_curl',
    name: 'Leg Curl',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['hamstrings'],
    secondaryMuscles: [],
    compatibleMachines: ['leg_curl_machine'],
    instructions: 'Lie face down. Curl legs up toward buttocks, lower back down with control.'
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['hamstrings', 'gluteus_maximus'],
    secondaryMuscles: ['erector_spinae'],
    compatibleMachines: ['barbell'],
    instructions: 'Stand holding bar. Hinge at hips, lower bar down legs keeping back straight.'
  },
  {
    id: 'lunge',
    name: 'Lunge',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['quadriceps', 'gluteus_maximus'],
    secondaryMuscles: ['hamstrings'],
    compatibleMachines: [],
    instructions: 'Step forward into lunge position. Lower back knee toward floor, push back to start.'
  },
  {
    id: 'bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    type: 'dynamic',
    category: 'compound',
    primaryMuscles: ['quadriceps', 'gluteus_maximus'],
    secondaryMuscles: ['hamstrings'],
    compatibleMachines: ['bench_flat'],
    instructions: 'Rear foot elevated on bench. Lower into lunge position, push back up.'
  },
  {
    id: 'calf_raise',
    name: 'Calf Raise',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['gastrocnemius', 'soleus'],
    secondaryMuscles: [],
    compatibleMachines: [],
    instructions: 'Stand on edge of platform. Rise up on toes, lower heels below platform level.'
  },

  // CORE EXERCISES
  {
    id: 'plank',
    name: 'Plank',
    type: 'static',
    category: 'isolation',
    primaryMuscles: ['rectus_abdominis', 'transverse_abdominis'],
    secondaryMuscles: ['obliques_external', 'obliques_internal'],
    compatibleMachines: [],
    instructions: 'Support body on forearms and toes. Keep body straight from head to heels.'
  },
  {
    id: 'side_plank',
    name: 'Side Plank',
    type: 'static',
    category: 'isolation',
    primaryMuscles: ['obliques_external', 'obliques_internal'],
    secondaryMuscles: ['transverse_abdominis'],
    compatibleMachines: [],
    instructions: 'Support body on one forearm and side of feet. Keep body straight.'
  },
  {
    id: 'crunch',
    name: 'Crunch',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['rectus_abdominis'],
    secondaryMuscles: [],
    compatibleMachines: [],
    instructions: 'Lie on back, knees bent. Lift shoulders off floor, contract abs.'
  },
  {
    id: 'hanging_leg_raise',
    name: 'Hanging Leg Raise',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['rectus_abdominis'],
    secondaryMuscles: ['hip_flexors'],
    compatibleMachines: ['pull_up_bar'],
    instructions: 'Hang from bar. Raise legs up in front keeping them straight.'
  },
  {
    id: 'russian_twist',
    name: 'Russian Twist',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['obliques_external', 'obliques_internal'],
    secondaryMuscles: ['rectus_abdominis'],
    compatibleMachines: [],
    instructions: 'Sit with knees bent, lean back slightly. Rotate torso side to side.'
  },
  {
    id: 'cable_woodchop',
    name: 'Cable Woodchop',
    type: 'dynamic',
    category: 'isolation',
    primaryMuscles: ['obliques_external', 'obliques_internal'],
    secondaryMuscles: ['rectus_abdominis'],
    compatibleMachines: ['cable_single'],
    instructions: 'Stand sideways to cable. Pull handle diagonally across body in chopping motion.'
  }
]
