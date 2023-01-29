import * as Checkbox from '@radix-ui/react-checkbox';
import { Check, CheckCircle, X, XCircle } from "phosphor-react";
import { FormEvent, useState } from 'react';
import clsx from 'clsx'
import { api } from '../lib/axios';

interface TypesResponses {
  type: 'success' | 'fail' | null,
  message?: string
}

const availableWeekDays = [
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
  'Domingo',
]

export function NewHabitForm() {
  const [title, setTitle] = useState('')
  const [feedbackResponse, setFeedbackResponse] = useState<TypesResponses>({ type: null })
  const [weekDays, setWeekDays] = useState<Array<number>>([])

  const createNewHabit = async (event: FormEvent) => {
    event.preventDefault()

    if (!title || weekDays.length === 0) return

    await api.post('habits', { title, weekDays })
      .then(() => {
        setFeedbackResponse({
          type: 'success',
          message: 'Seu hábito foi criado com sucesso!'
        })
        setWeekDays([])
        setTitle('')
      })
      .catch(() => setFeedbackResponse({
        type: 'fail',
        message: 'Ocorreu um erro ao criar seu hábito!'
      }))
  }

  const handleToggleWeekDay = (weekDay: number) => {
    if (weekDays.includes(weekDay)) {
      setWeekDays((oldValues) => oldValues.filter((value) => value !== weekDay))
      return
    }
    setWeekDays((oldValue) => [...oldValue, weekDay])
  }

  return (
    <>
      {
        feedbackResponse.type && (
          <div
            className={clsx('w-full mt-4 px-3 py-2 border rounded-md flex items-start justify-center gap-2', {
              'bg-green-400/20 border-green-400': feedbackResponse.type === 'success',
              'bg-red-400/20 border-red-400': feedbackResponse.type === 'fail'
            })}
          >
            {
              feedbackResponse.type === 'success' ? 
                <CheckCircle size={20} aria-label="sucesso" /> : 
                <XCircle size={30} aria-label="erro" />
            }
            <p className='w-full'>{feedbackResponse.message}</p>
            <button 
              type='button'
              className='hover:text-zinc-400'
              onClick={() => setFeedbackResponse({ type: null })}
            >
              <X aria-label="fechar" size={20}/>
            </button>
          </div>
        )
      }
      <form
      onSubmit={createNewHabit}
        className="w-full flex flex-col mt-6"
      >
        <label
          htmlFor="title"
          className="font-semibold leading-tight"
        >
          Qual seu comprometimento?
        </label>

        <input
          type="text"
          id="title"
          placeholder="Ex.: Exercícios, dormir bem, etc..."
          className="p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400"
          autoFocus
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label
          htmlFor=""
          className="font-semibold leading-tight mt-4"
        >
          Qual sua recorrência?
        </label>

        <div className='mt-3 flex flex-col gap-2'>
          {availableWeekDays.map((dayName, i) => (
              <Checkbox.Root
                key={`${dayName}-i`}
                className='flex items-center gap-3 group'
                checked={weekDays.includes(i)}
                onCheckedChange={() => handleToggleWeekDay(i)}
              >
                <div
                  className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500'
                >
                  <Checkbox.Indicator>
                    <Check size={20} className="text-white" />
                  </Checkbox.Indicator>
                </div>

                <span
                  className='text-white leading-tight'>{dayName}</span>
              </Checkbox.Root>
            
          ))}
        </div>

        <button
          type="submit"
          className="mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500"
        >
          <Check size={20} weight="bold" />
          Confirmar
        </button>
      </form>
    </>
  )
}