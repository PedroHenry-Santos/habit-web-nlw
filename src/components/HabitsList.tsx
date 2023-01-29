import * as Checkbox from '@radix-ui/react-checkbox';
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react';
import { api } from '../lib/axios';

interface HabitsListProps {
  date: Date;
  handleCompletedChange: (completed: number) => void
}

interface Habit {
  id: string;
  title: string;
  createdAt: Date;
}

interface HabitsInfo {
  possibleHabits: Habit[]
	completedHabits: string[]
}

export function HabitsList({ date, handleCompletedChange }: HabitsListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

  useEffect(() => {
    api.get(`habits/day`, { params: { date: date.toISOString() }})
      .then((response) => setHabitsInfo(response.data))
  }, [])

  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date())

  async function handleToggleHabit(habitId: string) {
    await api.patch(`habits/${habitId}/toggle`)

    const isHabitAlreadyCompleted = habitsInfo!.completedHabits.includes(habitId)

    const newCompletedHabits =  isHabitAlreadyCompleted ?
      habitsInfo!.completedHabits.filter(id => id !== habitId) :
      [...habitsInfo!.completedHabits, habitId]

    setHabitsInfo((oldValues) => ({
      completedHabits: newCompletedHabits,
      possibleHabits: oldValues!.possibleHabits
    }))

    handleCompletedChange(newCompletedHabits.length)
  }

  return (
    <div className='mt-6 flex flex-col gap-3'>
      {habitsInfo?.possibleHabits.map(({ id, title }) => (
        <Checkbox.Root
          key={id}
          onCheckedChange={() => handleToggleHabit(id)}
          className='flex items-center gap-3 group'
          disabled={isDateInPast}
          checked={habitsInfo.completedHabits.includes(id)}
        >
          <div
            className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500'
          >
            <Checkbox.Indicator>
              <Check size={20} className="text-white" />
            </Checkbox.Indicator>
          </div>

          <span
            className='font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400'
          >
            {title}
          </span>
        </Checkbox.Root>
      ))}
    </div>
  )
}