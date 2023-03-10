import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx'

import dayjs from 'dayjs';
import { useState } from 'react';
import { HabitsList } from './HabitsList';
import { ProgressBar } from './ProgressBar';

interface HabitDayProps {
  date: Date;
  defaultCompleted?: number;
  amount?: number;
}

export function HabitDay({ amount = 0, defaultCompleted = 0, date }: HabitDayProps) {
  const [completed, setCompleted] = useState(defaultCompleted)

  const completedPercentage = amount > 0 ? Math.round(completed / amount * 100) : 0
  const dayAndMonth = dayjs(date).format('DD/MM')
  const dayOfWeek = dayjs(date).format('dddd')

  function handleCompletedChange(completed: number) {
    setCompleted(completed)
  }

  return (
    <>
      <Popover.Root>
        <Popover.Trigger
          className={clsx('w-10 h-10  border-2  rounded-lg', {
            'bg-zinc-900 border-zinc-800': completedPercentage === 0,
            'bg-violet-900 border-violet-800': completedPercentage > 0 && completedPercentage < 20,
            'bg-violet-800 border-violet-700': completedPercentage >= 20 && completedPercentage < 40,
            'bg-violet-700 border-violet-600': completedPercentage >= 40 && completedPercentage < 60,
            'bg-violet-600 border-violet-500': completedPercentage >= 60 && completedPercentage < 80,
            'bg-violet-500 border-violet-400': completedPercentage >= 80,
          })}
        />

        <Popover.Portal>
          <Popover.Content
            className='min-w-[320px] p-6 bg-zinc-900 rounded-2xl flex flex-col'
          >
            <span className='font-semibold text-zinc-700 w-full mt-4'>{dayOfWeek}</span>
            <span className='font-extrabold leading-tight text-3xl mt-1'>{dayAndMonth}</span>

            <ProgressBar progress={completedPercentage}  />
            
            <HabitsList date={date} handleCompletedChange={handleCompletedChange} />
            
            <Popover.Arrow className='fill-zinc-900' height={8} width={16} />
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>
    </>
  )
}